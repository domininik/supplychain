const Item = artifacts.require('Item')
const ItemManager = artifacts.require('ItemManager')

contract('Item', (accounts) => {
  let owner
  let buyer

  beforeEach(async() => {
    owner = accounts[0]
    buyer = accounts[1]
  })

  it('receives payment and marks item as paid when price is met', async() => {
    const manager = await ItemManager.new()
    const item = await Item.new(manager.address, 0, 100, { from: owner })

    assert.equal(100, await item.getPrice())
    
    await item.receivePayment(0, { from: buyer, value: 100 })
    const itemData = await manager.getItem(0)

    assert.equal(ItemManager.Status.Paid, itemData.status)
  })

  it('does not mark item as paid when price is not met', async() => {
    const manager = await ItemManager.new()
    const item = await Item.new(manager.address, 0, 100, { from: owner })

    try {
      await item.receivePayment(0, { from: buyer, value: 99 })
    } catch (e) {
      const itemData = await manager.getItem(0)
      assert.equal(ItemManager.Status.Created, itemData.status)
    }
  })

  it('withdraws funds to owner', async() => {
    const manager = await ItemManager.new()
    const item = await Item.new(manager.address, 0, 100, { from: owner })
    const initialBalance = await web3.eth.getBalance(owner)
    // console.log("initialBalance: ", initialBalance / 1e18)

    await item.receivePayment(0, { from: buyer, value: 100 })
    const balanceToSend = await item.getBalance()
    assert.equal(100, balanceToSend)
    
    const transaction = await item.withdrawAll({ from: owner })
    // const gasUsed = transaction.receipt.gasUsed
    // const txDetails = await web3.eth.getTransaction(transaction.tx)
    // const gasPrice = txDetails.gasPrice
    // const gasCost = gasPrice * gasUsed

    // const finalBalance = await web3.eth.getBalance(owner)
    // console.log("finalBalance: ", finalBalance / 1e18)

    //const diff = (finalBalance - initialBalance)
    // console.log("diff: ", diff / 1e18)

    assert.equal(0, await item.getBalance())
    // assert.equal(finalBalance, initialBalance + balanceToSend - gasCost)
  })
})
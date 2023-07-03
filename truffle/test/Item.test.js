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
    await item.receivePayment(0, { from: buyer, value: 100 })
    const itemData = await manager.getItem(0)

    assert.equal(ItemManager.Status.Paid, itemData.status)
  })
})
const ItemManager = artifacts.require('ItemManager')

contract('ItemManager', (accounts) => {
  let itemManager
  let owner

  beforeEach(async() => {
    itemManager = await ItemManager.new()
    owner = accounts[0]
  })

  it('assigns the contract owner', async() => {
    assert.equal(owner, await itemManager.owner.call())
  })

  it('creates new item data with proper data', async() => {
    await itemManager.createItem('qwe', '100', { from: owner })
    const itemData = await itemManager.items(0)
    
    assert.equal('qwe', itemData.identifier)
    assert.equal(ItemManager.Status.Created, itemData.status)
  })

  it('updates itemIndex after creation which reflects total number of items', async() => {
    await itemManager.createItem('qwe', '100', { from: owner })
    const index = await itemManager.itemIndex.call()
    
    assert.equal(1, index.toNumber())
  })

  it('marks item as paid', async() => {
    await itemManager.createItem('qwe', '100', { from: owner })
    await itemManager.markItemAsPaid(0, { from: owner })
    const itemData = await itemManager.items(0)
    
    assert.equal(ItemManager.Status.Paid, itemData.status)
  })

  it('marks item as delivered', async() => {
    await itemManager.createItem('qwe', '100', { from: owner })
    await itemManager.markItemAsPaid(0, { from: owner })
    await itemManager.markItemAsDelivered(0, { from: owner })
    const itemData = await itemManager.items(0)
    
    assert.equal(ItemManager.Status.Delivered, itemData.status)
  })
})


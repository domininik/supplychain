const ItemManager = artifacts.require("ItemManager");

contract('ItemManager', (accounts) => {
  it('assigns the contract owner', async() => {
    const itemManager = await ItemManager.deployed();
    assert.equal(accounts[0], await itemManager.owner.call());
  })

  it('creates new item data', async() => {
    const itemManager = await ItemManager.deployed();
    await itemManager.createItem('qwe', '100', { from: accounts[0] });
    const itemData = await itemManager.items(0);
    assert.equal('qwe', itemData.identifier);
  })

  it('updates itemIndex which reflects total number of items', async() => {
    const itemManager = await ItemManager.deployed();
    const index = await itemManager.itemIndex.call();
    assert.equal(1, index.toNumber());
  })
})

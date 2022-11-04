// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable {
    enum Status { Created, Paid, Delivered }

    struct ItemData {
        string identifier;
        Status status;
        Item item;
    }

    mapping(uint => ItemData) public items;
    uint public itemIndex;

    event StatusChange(uint indexed index, Status indexed status);

    function createItem(string memory identifier, uint price) public onlyOwner {
        Item item = new Item(this, itemIndex, price);
        ItemData memory itemData = ItemData(identifier, Status.Created, item);
        items[itemIndex] = itemData;
        itemIndex++;
    }

    function markItemAsPaid(uint index) public payable {
        require(items[index].status == Status.Created, "Item has invalid status");

        items[index].status = Status.Paid;
        emit StatusChange(index, Status.Paid);
    }

    function markItemAsDelivered(uint index) public onlyOwner {
        require(items[index].status == Status.Paid, "Item has invalid status");

        items[index].status = Status.Delivered;
        emit StatusChange(index, Status.Delivered);
    }
}

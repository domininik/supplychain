// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {Item} from "./Item.sol";
import {Ownable} from "./Ownable.sol";

contract ItemManager is Ownable {
    enum Status { Created, Paid, Delivered }

    struct ItemData {
        string identifier;
        Status status;
        Item item;
    }

    mapping(uint => ItemData) private s_items;
    
    uint256 private s_itemIndex;

    event StatusChange(uint indexed index, Status indexed status);

    function createItem(string memory identifier, uint price) public onlyOwner {
        Item item = new Item(this, s_itemIndex, price);
        ItemData memory itemData = ItemData(identifier, Status.Created, item);
        s_items[s_itemIndex] = itemData;
        s_itemIndex++;
    }

    function markItemAsPaid(uint index) public payable {
        require(s_items[index].status == Status.Created, "Item has invalid status");

        s_items[index].status = Status.Paid;
        emit StatusChange(index, Status.Paid);
    }

    function markItemAsDelivered(uint index) public onlyOwner {
        require(s_items[index].status == Status.Paid, "Item has invalid status");

        s_items[index].status = Status.Delivered;
        emit StatusChange(index, Status.Delivered);
    }

    function getItem(uint256 index) public view returns (ItemData memory) {
        return s_items[index];
    }

    function getItemIndex() public view returns (uint256) {
        return s_itemIndex;
    }
}

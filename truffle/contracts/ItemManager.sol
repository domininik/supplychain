// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {Item} from "./Item.sol";
import {Ownable} from "./Ownable.sol";

error ItemManager__InvalidStatus(uint256 index, uint256 status);

contract ItemManager is Ownable {
    enum Status { Created, Paid, Delivered }

    struct ItemData {
        string identifier;
        Status status;
        Item item;
    }

    mapping(uint256 => ItemData) private s_items;
    
    uint256 private s_itemIndex;

    event StatusChange(uint256 indexed index, Status indexed status);

    function createItem(string memory identifier, uint256 price) public onlyOwner {
        Item item = new Item(this, s_itemIndex, price);
        ItemData memory itemData = ItemData(identifier, Status.Created, item);
        s_items[s_itemIndex] = itemData;
        s_itemIndex++;
    }

    function markItemAsPaid(uint256 index) public payable {
        Status status = s_items[index].status;
        
        if (status != Status.Created) {
            revert ItemManager__InvalidStatus(index, uint256(status));
        }

        s_items[index].status = Status.Paid;
        emit StatusChange(index, Status.Paid);
    }

    function markItemAsDelivered(uint256 index) public onlyOwner {
        Status status = s_items[index].status;
        
        if (status != Status.Paid) {
            revert ItemManager__InvalidStatus(index, uint256(status));
        }

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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {ItemManager} from "./ItemManager.sol";
import {Ownable} from "./Ownable.sol";
import "truffle/console.sol";

interface ItemManagerInterface {
    function markItemAsPaid(uint256 index) external;
    function getOwner() external view returns (address);
}

contract Item is Ownable {
    ItemManager private immutable i_manager;
    uint256 private immutable i_price;
    uint256 private immutable i_index;

    constructor(ItemManager manager, uint256 index, uint256 price) {
        i_manager = manager;
        i_index = index;
        i_price = price;
    }

    receive() external payable {}

    fallback() external payable {}

    function receivePayment(uint256 index) external payable {
        require(msg.value == i_price, "Price is not met");
        
        ItemManagerInterface(address(i_manager)).markItemAsPaid(index);
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getPrice() public view returns(uint256) {
        return i_price;
    }

    function withdrawAll() public payable onlyOwner {
        uint256 balance = getBalance();

        require(balance > 0, "No money to withdraw");
        
        address owner = ItemManagerInterface(address(i_manager)).getOwner();
        (bool sent,) = payable(owner).call{value: balance}("");
        
        require(sent, "Failed to withdraw");
    }
}

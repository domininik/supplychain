// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./ItemManager.sol";

interface ItemManagerInterface {
    function markItemAsPaid(uint256 index) external;
    function getOwner() external view returns (address);
}

contract Item {
    ItemManager private immutable i_manager;
    uint256 private immutable i_price;
    uint256 private immutable i_index;

    constructor(ItemManager manager, uint256 index, uint256 price) {
        i_manager = manager;
        i_index = index;
        i_price = price;
    }

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

    function withdrawAll() public {
        require(getBalance() > 0, "No money to withdraw");

        address payable receiver = payable(ItemManagerInterface(address(i_manager)).getOwner());
        receiver.transfer(getBalance());
    }
}

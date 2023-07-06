// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {ItemManager} from "./ItemManager.sol";
import {Ownable} from "./Ownable.sol";
import "truffle/console.sol";

error Item__PriceNotMet(uint256 price, uint256 value);
error Item__BalanceTooLow(uint256 balance);
error Item__WithdrawFailed();

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
        uint256 value = msg.value;

        if (value != i_price) {
            revert Item__PriceNotMet(i_price, value);
        }

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

        if (balance == 0) {
            revert Item__BalanceTooLow(balance);
        }
        
        address owner = ItemManagerInterface(address(i_manager)).getOwner();
        (bool sent,) = payable(owner).call{value: balance}("");
        
        if (!sent) {
            revert Item__WithdrawFailed();
        }
    }
}

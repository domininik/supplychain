// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./ItemManager.sol";

contract Item {
    uint public price;
    uint public index;
    ItemManager manager;

    constructor(ItemManager _manager, uint _index, uint _price) {
        manager = _manager;
        index = _index;
        price = _price;
    }

    receive() external payable {
        require(msg.value == price, "Price is not met");

        (bool success, ) = address(manager).call{ value:msg.value }(abi.encodeWithSignature("markItemAsPaid(uint256)", index));

        require(success, "Something went wrong");
    }
}

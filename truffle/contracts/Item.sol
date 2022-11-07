// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./ItemManager.sol";

interface ItemManagerInterface {
    function markItemAsPaid(uint index) external;
}

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

        ItemManagerInterface(address(manager)).markItemAsPaid(index);
    }
}

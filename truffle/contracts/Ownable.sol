// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Ownable {
    address private immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == getOwner(), "Caller is not the owner");
        _;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}

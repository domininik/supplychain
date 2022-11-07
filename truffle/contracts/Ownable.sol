// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Ownable {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner(), "Caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }
}

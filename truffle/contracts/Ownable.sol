// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract Ownable {
    address private immutable i_owner;

    error Ownable__Unauthorized(address sender, address owner);

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner {
        address owner = getOwner();

        if (msg.sender != owner) {
            revert Ownable__Unauthorized(msg.sender, owner);
        }
        _;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}

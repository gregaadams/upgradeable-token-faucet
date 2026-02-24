// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Hello {
    string public message = "Hello Blockchain!";
    address public owner;

    event MessageUpdated(address indexed updater, string newMessage);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function setMessage(string memory _newMessage) public onlyOwner {
        message = _newMessage;
        emit MessageUpdated(msg.sender, _newMessage);
    }
}

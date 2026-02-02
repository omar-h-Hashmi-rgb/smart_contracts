// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Lock {
    uint public unlockTime;
    
    constructor(uint _unlockTime) {
        unlockTime = _unlockTime;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title DeVoteTimelockController
 * @dev TimelockController for the decentralized voting dApp
 * Adds a delay between governance decisions and their execution
 * Allows governance actions to be canceled during this timelock period
 */
contract DeVoteTimelockController is TimelockController {
    /**
     * @dev Constructor that initializes the timelock with a minimum delay,
     * initial proposers, and executors
     * @param minDelay The minimum delay in seconds between proposal and execution
     * @param proposers The addresses allowed to propose actions
     * @param executors The addresses allowed to execute actions
     * @param admin The optional admin address that can perform maintenance operations
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(
        minDelay,
        proposers,
        executors,
        admin
    ) {}
}

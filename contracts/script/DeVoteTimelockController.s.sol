// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeVoteTimelockController.sol";

contract DeployDeVoteTimelockController is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Default values if not provided in .env
        uint256 minDelay = 2 days; // 2 day timelock

        // Try to read from env if available
        try vm.envUint("MIN_DELAY") returns (uint256 delay) {
            minDelay = delay;
        } catch {}

        vm.startBroadcast(deployerPrivateKey);

        // For the initial setup, we'll make the deployer the admin
        // and also the only proposer and executor
        address[] memory proposers = new address[](1);
        proposers[0] = deployer;

        address[] memory executors = new address[](1);
        executors[0] = deployer;

        // Deploy timelock controller
        DeVoteTimelockController timelock = new DeVoteTimelockController(
            minDelay,
            proposers,
            executors,
            deployer // Admin - can grant/revoke roles later
        );

        console.log("DeVoteTimelockController deployed at:", address(timelock));
        console.log("Min delay (in seconds):", minDelay);

        vm.stopBroadcast();
    }
}

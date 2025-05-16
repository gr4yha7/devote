// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DAOVoting.sol";
import "../src/GovernanceToken.sol";

contract DeployGovernanceToken is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        GovernanceToken token = new GovernanceToken(deployer);
        console.log("GovernanceToken deployed at:", address(token));

        vm.stopBroadcast();
    }
}

contract DeployDAOVoting is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        uint256 proposalThreshold = vm.envUint("PROPOSAL_THRESHOLD");
        uint256 votingPeriod = vm.envUint("VOTING_PERIOD");

        vm.startBroadcast(deployerPrivateKey);

        DAOVoting voting = new DAOVoting(
            tokenAddress,
            proposalThreshold,
            votingPeriod
        );
        console.log("DAOVoting deployed at:", address(voting));

        vm.stopBroadcast();
    }
}

// Main deployment script to deploy all contracts
contract DeployAll is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Default values if not provided in .env
        uint256 proposalThreshold = 1000 * 10**18; // 1000 tokens
        uint256 votingPeriod = 3 days;
        
        // Try to read from env if available
        try vm.envUint("PROPOSAL_THRESHOLD") returns (uint256 threshold) {
            proposalThreshold = threshold;
        } catch {}
        
        try vm.envUint("VOTING_PERIOD") returns (uint256 period) {
            votingPeriod = period;
        } catch {}

        vm.startBroadcast(deployerPrivateKey);

        // Deploy token
        GovernanceToken token = new GovernanceToken(deployer);
        console.log("GovernanceToken deployed at:", address(token));

        // Deploy voting contract
        DAOVoting voting = new DAOVoting(
            address(token),
            proposalThreshold,
            votingPeriod
        );
        console.log("DAOVoting deployed at:", address(voting));

        vm.stopBroadcast();
    }
} 
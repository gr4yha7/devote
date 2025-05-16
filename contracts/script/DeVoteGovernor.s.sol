// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeVoteGovernor.sol";
import "../src/DeVoteTimelockController.sol";
import "../src/DeVoteGovernanceToken.sol";

contract DeployDeVoteGovernor is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        address payable timelockAddress = payable(vm.envAddress("TIMELOCK_ADDRESS"));

        // Default values if not provided in .env
        uint48 votingDelay = 1; // 1 block delay before voting starts
        uint32 votingPeriod = 50400; // ~1 week at 12s blocks
        uint256 proposalThreshold = 100 * 10**18; // 100 tokens to propose
        uint256 quorumNumerator = 4; // 4% quorum

        // Try to read from env if available
        try vm.envUint("VOTING_DELAY") returns (uint256 delay) {
            votingDelay = uint48(delay);
        } catch {}

        try vm.envUint("VOTING_PERIOD") returns (uint256 period) {
            votingPeriod = uint32(period);
        } catch {}

        try vm.envUint("PROPOSAL_THRESHOLD") returns (uint256 threshold) {
            proposalThreshold = threshold;
        } catch {}

        try vm.envUint("QUORUM_NUMERATOR") returns (uint256 quorum) {
            quorumNumerator = quorum;
        } catch {}

        vm.startBroadcast(deployerPrivateKey);

        // Deploy governor contract
        DeVoteGovernor governor = new DeVoteGovernor(
            IVotes(tokenAddress),
            TimelockController(timelockAddress),
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumNumerator
        );

        console.log("DeVoteGovernor deployed at:", address(governor));

        // Setup roles for the governor and timelock
        DeVoteTimelockController timelock = DeVoteTimelockController(payable(timelockAddress));

        // Grant proposer role to the governor
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 cancellerRole = timelock.CANCELLER_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        // Grant proposer role to the governor so it can propose transactions
        timelock.grantRole(proposerRole, address(governor));

        // Set executor role to anybody (address(0) means anyone can execute)
        timelock.grantRole(executorRole, address(0));

        // Optionally, grant canceller role to the deployer for safety during initial setup
        timelock.grantRole(cancellerRole, vm.addr(deployerPrivateKey));

        // Revoke admin role from deployer after setup
        // This effectively makes the timelock autonomous and controlled solely by governance
        timelock.revokeRole(adminRole, vm.addr(deployerPrivateKey));

        console.log("Governance setup complete");

        vm.stopBroadcast();
    }
}

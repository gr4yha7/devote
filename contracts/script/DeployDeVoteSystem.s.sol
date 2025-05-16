// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeVoteGovernanceToken.sol";
import "../src/DeVoteTimelockController.sol";
import "../src/DeVoteGovernor.sol";

contract DeployDeVoteSystem is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Default values if not provided in .env
        uint256 minDelay = 2 days; // 2 day timelock
        uint48 votingDelay = 1; // 1 block delay before voting starts
        uint32 votingPeriod = 50400; // ~1 week at 12s blocks
        uint256 proposalThreshold = 100 * 10**18; // 100 tokens to propose
        uint256 quorumNumerator = 4; // 4% quorum

        // Try to read from env if available
        try vm.envUint("MIN_DELAY") returns (uint256 delay) {
            minDelay = delay;
        } catch {}

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

        // 1. Deploy governance token
        DeVoteGovernanceToken token = new DeVoteGovernanceToken(deployer);
        console.log("DeVoteGovernanceToken deployed at:", address(token));

        // 2. Deploy timelock controller
        // For the initial setup, we'll make the deployer the admin
        address[] memory proposers = new address[](1);
        proposers[0] = deployer;

        address[] memory executors = new address[](1);
        executors[0] = deployer;

        DeVoteTimelockController timelock = new DeVoteTimelockController(
            minDelay,
            proposers,
            executors,
            deployer // Admin - can grant/revoke roles later
        );

        console.log("DeVoteTimelockController deployed at:", address(timelock));

        // 3. Deploy governor contract
        DeVoteGovernor governor = new DeVoteGovernor(
            IVotes(address(token)),
            TimelockController(payable(address(timelock))),
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumNumerator
        );

        console.log("DeVoteGovernor deployed at:", address(governor));

        // 4. Setup roles for the governor and timelock
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 cancellerRole = timelock.CANCELLER_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        // Remove the deployer as proposer
        timelock.revokeRole(proposerRole, deployer);

        // Grant proposer role to the governor so it can propose transactions
        timelock.grantRole(proposerRole, address(governor));

        // Set executor role to anybody (address(0) means anyone can execute)
        timelock.grantRole(executorRole, address(0));

        // Optionally, grant canceller role to the deployer for safety during initial setup
        timelock.grantRole(cancellerRole, deployer);

        // Revoke admin role from deployer after setup
        // This effectively makes the timelock autonomous and controlled solely by governance
        timelock.revokeRole(adminRole, deployer);

        // 5. Self-delegate voting power for the deployer
        token.delegate(deployer);
        console.log("Delegated deployer's voting power to self");

        console.log("Governance system setup complete");
        console.log("-----------------------------------");
        console.log("Summary:");
        console.log("Token address:", address(token));
        console.log("Timelock address:", address(timelock));
        console.log("Governor address:", address(governor));
        console.log("Voting delay:", votingDelay, "blocks");
        console.log("Voting period:", votingPeriod, "blocks");
        console.log("Proposal threshold:", proposalThreshold);
        console.log("Quorum:", quorumNumerator, "%");

        vm.stopBroadcast();
    }
}

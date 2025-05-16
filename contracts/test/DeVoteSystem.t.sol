// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DeVoteGovernanceToken.sol";
import "../src/DeVoteTimelockController.sol";
import "../src/DeVoteGovernor.sol";

contract DeVoteSystemTest is Test {
    DeVoteGovernanceToken public token;
    DeVoteTimelockController public timelock;
    DeVoteGovernor public governor;

    address public deployer = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);
    address public charlie = address(0x4);
    address public lowTokenUser = address(0x1234);

    // Governance parameters
    uint256 public minDelay = 2 days;
    uint48 public votingDelay = 1;      // 1 block delay before voting starts
    uint32 public votingPeriod = 50400; // ~1 week at 12s blocks
    uint256 public proposalThreshold = 100 * 10**18; // 100 tokens to propose
    uint256 public quorumNumerator = 4; // 4% quorum

    // Proposal information
    uint256 public proposalId;
    address[] public targets;
    uint256[] public values;
    bytes[] public calldatas;
    string public description;

    function setUp() public {
        vm.startPrank(deployer);

        // Deploy governance token
        token = new DeVoteGovernanceToken(deployer);

        // Distribute tokens to users - give Alice extra tokens to meet the proposal threshold
        token.transfer(alice, 200000 * 10**18); // Increased from 10000 to 200000
        token.transfer(bob, 5000 * 10**18);
        token.transfer(charlie, 3000 * 10**18);
        token.transfer(lowTokenUser, 10 * 10**18);

        // Setup timelock controller
        address[] memory proposers = new address[](1);
        proposers[0] = deployer;
        address[] memory executors = new address[](1);
        executors[0] = deployer;

        timelock = new DeVoteTimelockController(
            minDelay,
            proposers,
            executors,
            deployer
        );

        // Deploy governor
        governor = new DeVoteGovernor(
            IVotes(address(token)),
            TimelockController(payable(address(timelock))),
            votingDelay,
            votingPeriod,
            proposalThreshold,
            quorumNumerator
        );

        // Setup roles for the governor and timelock
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
        timelock.revokeRole(adminRole, deployer);

        // Self-delegate for testing
        token.delegate(deployer);

        vm.stopPrank();

        // Setup delegation for test users and advance blocks to account for voting power delay
        vm.startPrank(alice);
        token.delegate(alice);
        vm.stopPrank();

        vm.startPrank(bob);
        token.delegate(bob);
        vm.stopPrank();

        vm.startPrank(charlie);
        token.delegate(charlie);
        vm.stopPrank();

        vm.startPrank(lowTokenUser);
        token.delegate(lowTokenUser);
        vm.stopPrank();

        // Move forward one block to ensure voting power is active
        vm.roll(block.number + 1);

        // Setup mock proposal for tests
        // This is a proposal to transfer tokens from the timelock to alice
        targets = new address[](1);
        targets[0] = address(token);

        values = new uint256[](1);
        values[0] = 0; // No ETH being sent

        calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature(
            "transfer(address,uint256)",
            alice,
            1000 * 10**18
        );

        description = "Proposal #1: Transfer tokens to Alice";
    }

    function testGovernorSetup() public view {
        // Verify token setup
        assertEq(token.balanceOf(deployer), 792000 * 10**18 - 10 * 10**18); // Initial supply - distributions - lowTokenUser
        assertEq(token.balanceOf(alice), 200000 * 10**18);
        assertEq(token.balanceOf(bob), 5000 * 10**18);
        assertEq(token.balanceOf(charlie), 3000 * 10**18);
        assertEq(token.balanceOf(lowTokenUser), 10 * 10**18);

        // Verify delegation worked
        assertGt(token.getVotes(alice), 0);
        assertGt(token.getVotes(bob), 0);
        assertGt(token.getVotes(charlie), 0);

        // Verify governor setup
        assertEq(address(governor.token()), address(token));
        assertEq(address(governor.timelock()), address(timelock));
        assertEq(governor.votingDelay(), votingDelay);
        assertEq(governor.votingPeriod(), votingPeriod);
        assertEq(governor.proposalThreshold(), proposalThreshold);
        assertEq(governor.quorumNumerator(), quorumNumerator);
    }

    function testCreateProposal() public {
        // Ensure alice has enough tokens to create a proposal
        vm.startPrank(alice);

        // Create a proposal
        proposalId = governor.propose(
            targets,
            values,
            calldatas,
            description
        );

        // Check proposal state - should be Pending
        assertEq(uint(governor.state(proposalId)), uint(IGovernor.ProposalState.Pending));

        vm.stopPrank();
    }

    function testVotingWorkflow() public {
        // Create proposal from alice
        vm.startPrank(alice);
        proposalId = governor.propose(
            targets,
            values,
            calldatas,
            description
        );
        vm.stopPrank();

        // Move forward one block to pass the voting delay
        vm.roll(block.number + votingDelay + 1);

        // Check proposal state - should be Active now
        assertEq(uint(governor.state(proposalId)), uint(IGovernor.ProposalState.Active));

        // Cast votes from different users
        vm.startPrank(alice);
        governor.castVote(proposalId, 1); // Vote For
        vm.stopPrank();

        vm.startPrank(bob);
        governor.castVote(proposalId, 0); // Vote Against
        vm.stopPrank();

        vm.startPrank(charlie);
        governor.castVote(proposalId, 2); // Vote Abstain
        vm.stopPrank();

        // Check votes were recorded
        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        assertEq(forVotes, 200000 * 10**18); // Alice's voting power (updated)
        assertEq(againstVotes, 5000 * 10**18); // Bob's voting power
        assertEq(abstainVotes, 3000 * 10**18); // Charlie's voting power

        // Move forward to pass the voting period
        vm.roll(block.number + votingPeriod + 1);

        // Check proposal state - should be Succeeded
        assertEq(uint(governor.state(proposalId)), uint(IGovernor.ProposalState.Succeeded));
    }

    function testQueueAndExecute() public {
        // Create proposal, vote, and pass it
        testVotingWorkflow();

        // Queue the proposal
        vm.startPrank(alice);
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.queue(targets, values, calldatas, descriptionHash);

        // Check proposal state - should be Queued
        assertEq(uint(governor.state(proposalId)), uint(IGovernor.ProposalState.Queued));
        vm.stopPrank();

        // First, we need to give tokens to the timelock for the proposal to succeed
        vm.startPrank(deployer);
        token.transfer(address(timelock), 5000 * 10**18);
        vm.stopPrank();

        // Move forward to pass the timelock delay
        vm.warp(block.timestamp + minDelay + 1);

        // Execute the proposal
        vm.startPrank(alice);
        governor.execute(targets, values, calldatas, descriptionHash);

        // Check proposal state - should be Executed
        assertEq(uint(governor.state(proposalId)), uint(IGovernor.ProposalState.Executed));
        vm.stopPrank();

        // Verify the proposal action was executed
        assertEq(token.balanceOf(alice), 201000 * 10**18); // Original 200000 + 1000 from proposal
        assertEq(token.balanceOf(address(timelock)), 4000 * 10**18); // 5000 - 1000 transferred
    }

    function testProposalThreshold() public {
        // Verify low token user has less than the threshold
        uint256 lowUserVotes = token.getVotes(lowTokenUser);
        assertLt(lowUserVotes, proposalThreshold, "Low token user should have less votes than the threshold");

        // Try to create a proposal as low token user (should fail)
        vm.startPrank(lowTokenUser);
        (bool success, ) = address(governor).call(
            abi.encodeWithSelector(
                governor.propose.selector,
                targets,
                values,
                calldatas,
                description
            )
        );
        assertFalse(success, "Low token user should not be able to create a proposal");
        vm.stopPrank();

        // Verify Alice has enough voting power to create a proposal
        uint256 aliceVotes = token.getVotes(alice);
        assertGe(aliceVotes, proposalThreshold, "Alice should have enough votes to meet the threshold");

        // Create a proposal as Alice (should succeed)
        vm.startPrank(alice);
        uint256 newProposalId = governor.propose(targets, values, calldatas, description);
        assertGt(newProposalId, 0, "Proposal should be created successfully");
        vm.stopPrank();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DAOVoting.sol";
import "../src/GovernanceToken.sol";

contract DAOVotingTest is Test {
    DAOVoting public voting;
    GovernanceToken public token;

    address public deployer = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);
    address public charlie = address(0x4);

    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public votingPeriod = 3 days;

    function setUp() public {
        vm.startPrank(deployer);

        // Deploy governance token
        token = new GovernanceToken(deployer);

        // Distribute tokens to users
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 5000 * 10**18);
        token.transfer(charlie, 3000 * 10**18);

        // Deploy voting contract
        voting = new DAOVoting(address(token), proposalThreshold, votingPeriod);

        vm.stopPrank();

        // Stake tokens for voting
        vm.startPrank(alice);
        token.stakeForVoting(5000 * 10**18);
        vm.stopPrank();

        vm.startPrank(bob);
        token.stakeForVoting(3000 * 10**18);
        vm.stopPrank();

        vm.startPrank(charlie);
        token.stakeForVoting(2000 * 10**18);
        vm.stopPrank();
    }

    function testCreateProposal() public {
        vm.startPrank(alice);

        voting.createProposal("Test Proposal", "This is a test proposal");

        assertEq(voting.getProposalCount(), 1);

        // Check proposal details
        (uint256 id, string memory title, string memory description, , , , uint256 startTime, uint256 endTime, bool executed) = voting.getProposal(0);

        assertEq(id, 0);
        assertEq(title, "Test Proposal");
        assertEq(description, "This is a test proposal");
        assertEq(startTime, block.timestamp);
        assertEq(endTime, block.timestamp + votingPeriod);
        assertEq(executed, false);

        vm.stopPrank();
    }

    function testCreateProposalBelowThreshold() public {
        // First unstake most tokens to go below threshold
        vm.startPrank(charlie);
        token.unstakeTokens(1500 * 10**18); // Left with 500 tokens staked

        // Try to create proposal with insufficient tokens
        vm.expectRevert("DAOVoting: proposer votes below proposal threshold");
        voting.createProposal("Failed Proposal", "This should fail");

        vm.stopPrank();
    }

    function testCastVote() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Voting Test", "Proposal for testing voting");
        vm.stopPrank();

        // Bob votes FOR
        vm.startPrank(bob);
        voting.castVote(0, 1); // 1 = For

        // Check vote was recorded
        assertTrue(voting.hasVoted(0, bob));

        // Check vote receipt
        (bool hasVoted, uint8 voteType, uint256 weight) = voting.getVoteReceipt(0, bob);
        assertEq(hasVoted, true);
        assertEq(voteType, 1); // For
        assertEq(weight, 3000 * 10**18); // Bob's voting weight

        // Check proposal vote counts
        (, , , uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain, , , ) = voting.getProposal(0);
        assertEq(votesFor, 3000 * 10**18);
        assertEq(votesAgainst, 0);
        assertEq(votesAbstain, 0);

        vm.stopPrank();
    }

    function testMultipleVotes() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Multiple Votes Test", "Testing different vote types");
        voting.castVote(0, 1); // Alice votes FOR
        vm.stopPrank();

        // Bob votes AGAINST
        vm.startPrank(bob);
        voting.castVote(0, 2); // 2 = Against
        vm.stopPrank();

        // Charlie votes ABSTAIN
        vm.startPrank(charlie);
        voting.castVote(0, 3); // 3 = Abstain
        vm.stopPrank();

        // Check proposal vote counts
        (, , , uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain, , , ) = voting.getProposal(0);
        assertEq(votesFor, 5000 * 10**18); // Alice's votes
        assertEq(votesAgainst, 3000 * 10**18); // Bob's votes
        assertEq(votesAbstain, 2000 * 10**18); // Charlie's votes
    }

    function testCannotVoteTwice() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Double Vote Test", "Should prevent double voting");
        voting.castVote(0, 1); // Vote FOR

        // Try to vote again
        vm.expectRevert("DAOVoting: already voted");
        voting.castVote(0, 2); // Try to vote AGAINST now

        vm.stopPrank();
    }

    function testVotingPeriod() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Timing Test", "Testing voting period");
        vm.stopPrank();

        // Fast forward time beyond voting period
        vm.warp(block.timestamp + votingPeriod + 1);

        // Try to vote after period ended
        vm.startPrank(bob);
        vm.expectRevert("DAOVoting: voting ended");
        voting.castVote(0, 1);
        vm.stopPrank();
    }

    function testExecuteProposal() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Execution Test", "Testing proposal execution");
        vm.stopPrank();

        // Fast forward time beyond voting period
        vm.warp(block.timestamp + votingPeriod + 1);

        // Execute the proposal
        vm.startPrank(bob);
        voting.executeProposal(0);

        // Check that it was executed
        (, , , , , , , , bool executed) = voting.getProposal(0);
        assertTrue(executed);

        // Try to execute again
        vm.expectRevert("DAOVoting: proposal already executed");
        voting.executeProposal(0);

        vm.stopPrank();
    }

    function testCannotExecuteDuringVoting() public {
        // Create a proposal first
        vm.startPrank(alice);
        voting.createProposal("Early Execution Test", "Should prevent early execution");
        vm.stopPrank();

        // Try to execute before voting period ends
        vm.startPrank(bob);
        vm.expectRevert("DAOVoting: voting not ended");
        voting.executeProposal(0);
        vm.stopPrank();
    }

    function testDelegation() public {
        // Alice delegates to Bob
        vm.startPrank(alice);
        voting.delegate(bob);

        // Create a proposal
        voting.createProposal("Delegation Test", "Testing vote delegation");
        vm.stopPrank();

        // Charlie votes
        vm.startPrank(charlie);
        voting.castVote(0, 1); // Vote FOR
        vm.stopPrank();

        // Since Alice delegated to Bob, when Bob votes, he should get
        // his own voting power
        vm.startPrank(bob);
        voting.castVote(0, 2); // Vote AGAINST
        vm.stopPrank();

        // Check proposal vote counts
        (, , , uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain, , , ) = voting.getProposal(0);
        assertEq(votesFor, 2000 * 10**18); // Charlie's votes
        assertEq(votesAgainst, 3000 * 10**18); // Only Bob's votes (Alice's delegation not reflected in weight since getPastVotes is mocked)
        assertEq(votesAbstain, 0);
    }

    function testOwnerFunctions() public {
        // Test changing proposal threshold
        vm.startPrank(deployer);
        uint256 newThreshold = 2000 * 10**18;
        voting.setProposalThreshold(newThreshold);
        assertEq(voting.proposalThreshold(), newThreshold);

        // Test changing voting period
        uint256 newVotingPeriod = 7 days;
        voting.setVotingPeriod(newVotingPeriod);
        assertEq(voting.votingPeriod(), newVotingPeriod);
        vm.stopPrank();

        // Non-owner cannot call these functions
        vm.startPrank(alice);
        vm.expectRevert();
        voting.setProposalThreshold(1000 * 10**18);
        vm.stopPrank();
    }
}

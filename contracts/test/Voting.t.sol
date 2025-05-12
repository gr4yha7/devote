// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Voting.sol";

/// @notice This file maintains backward compatibility with the old Voting contract tests.
/// @dev For the updated DAOVoting tests, please refer to DAOVoting.t.sol
contract VotingTest is Test {
    DAOVoting public voting;
    GovernanceToken public token;
    address public deployer = address(0x1);
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);

    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public votingPeriod = 7 days;

    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy governance token
        token = new GovernanceToken(deployer);
        
        // Deploy voting contract
        voting = new DAOVoting(address(token), proposalThreshold, votingPeriod);
        
        // Distribute tokens to users
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 5000 * 10**18);
        
        vm.stopPrank();
        
        // Stake tokens for voting
        vm.startPrank(alice);
        token.stakeForVoting(5000 * 10**18);
    }

    function testCreateProposal() public {
        voting.createProposal("Test Proposal", "This is a test proposal");
        assertEq(voting.getProposalCount(), 1);
    }

    function testVote() public {
        // Create proposal
        voting.createProposal("Test Proposal", "This is a test proposal");

        // Vote FOR (1)
        voting.castVote(0, 1);

        // Check vote recorded
        assertTrue(voting.hasVoted(0, alice));
        
        // Get vote details
        (bool hasVoted, uint8 voteType, uint256 weight) = voting.getVoteReceipt(0, alice);
        assertEq(hasVoted, true);
        assertEq(voteType, 1); // FOR vote
        
        // Check proposal vote counts
        (, , , uint256 votesFor, , , , , ) = voting.getProposal(0);
        assertEq(votesFor, weight);
    }

    function testCannotVoteTwice() public {
        // Create proposal
        voting.createProposal("Test Proposal", "This is a test proposal");

        // First vote
        voting.castVote(0, 1);

        // Try to vote again
        vm.expectRevert("DAOVoting: already voted");
        voting.castVote(0, 2);
    }

    function testExecuteProposal() public {
        // Create proposal
        voting.createProposal("Test Proposal", "This is a test proposal");

        // Fast forward time
        vm.warp(block.timestamp + votingPeriod + 1);

        // End proposal (now called executeProposal)
        voting.executeProposal(0);

        // Try to vote after proposal ended
        vm.expectRevert("DAOVoting: voting ended");
        voting.castVote(0, 1);
        
        // Verify proposal is executed
        (, , , , , , , , bool executed) = voting.getProposal(0);
        assertTrue(executed);
    }
} 
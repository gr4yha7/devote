
// Smart Contract (Solidity) - contracts/Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOVoting is Ownable {
    // Reference to the governance token
    ERC20Votes public governanceToken;
    
    // Proposal struct with extended features
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => Vote) votes;
    }
    
    // Vote type enum
    enum Vote { None, For, Against, Abstain }
    
    // Voting receipt for weighted votes
    struct VoteReceipt {
        bool hasVoted;
        Vote vote;
        uint256 weight;
    }
    
    // Track proposals by ID
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Voting receipt tracking
    mapping(uint256 => mapping(address => VoteReceipt)) public voteReceipts;
    
    // Vote delegation
    mapping(address => address) public delegates;
    
    // Minimum token balance required to create a proposal
    uint256 public proposalThreshold;
    
    // Voting duration in seconds
    uint256 public votingPeriod;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId, 
        string title, 
        address indexed creator,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId, 
        address indexed voter, 
        Vote vote, 
        uint256 weight
    );
    
    event DelegateChanged(
        address indexed delegator, 
        address indexed fromDelegate, 
        address indexed toDelegate
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(
        address _governanceToken,
        uint256 _proposalThreshold,
        uint256 _votingPeriod
    ) {
        governanceToken = ERC20Votes(_governanceToken);
        proposalThreshold = _proposalThreshold;
        votingPeriod = _votingPeriod;
    }
    
    /**
     * Create a new proposal
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     */
    function createProposal(string memory _title, string memory _description) public {
        // Check if user has enough tokens to create a proposal
        require(
            governanceToken.getPastVotes(msg.sender, block.number - 1) >= proposalThreshold,
            "DAOVoting: proposer votes below proposal threshold"
        );
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + votingPeriod;
        
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.startTime = startTime;
        newProposal.endTime = endTime;
        
        emit ProposalCreated(proposalId, _title, msg.sender, startTime, endTime);
    }
    
    /**
     * Cast a vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _vote Vote type (1: For, 2: Against, 3: Abstain)
     */
    function castVote(uint256 _proposalId, uint8 _vote) public {
        return _castVote(msg.sender, _proposalId, Vote(_vote));
    }
    
    /**
     * Cast a vote with reason on a proposal
     * @param _proposalId ID of the proposal
     * @param _vote Vote type (1: For, 2: Against, 3: Abstain)
     * @param _reason Reason for the vote
     */
    function castVoteWithReason(uint256 _proposalId, uint8 _vote, string calldata _reason) public {
        _castVote(msg.sender, _proposalId, Vote(_vote));
        // Reason is only emitted and not stored to save gas
        // We could store it if needed for future enhancements
    }
    
    /**
     * Internal function to cast a vote
     */
    function _castVote(address _voter, uint256 _proposalId, Vote _vote) internal {
        require(_proposalId < proposalCount, "DAOVoting: invalid proposal id");
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.startTime, "DAOVoting: voting not started");
        require(block.timestamp <= proposal.endTime, "DAOVoting: voting ended");
        
        // Check if user has already voted
        require(proposal.votes[_voter] == Vote.None, "DAOVoting: already voted");
        
        // Get the effective address (delegated or self)
        address effectiveVoter = delegates[_voter] != address(0) ? delegates[_voter] : _voter;
        
        // Get the voting weight (tokens held at proposal creation block - 1)
        uint256 weight = governanceToken.getPastVotes(effectiveVoter, block.number - 1);
        require(weight > 0, "DAOVoting: no voting power");
        
        // Record the vote
        proposal.votes[_voter] = _vote;
        
        // Update vote counts based on type
        if (_vote == Vote.For) {
            proposal.votesFor += weight;
        } else if (_vote == Vote.Against) {
            proposal.votesAgainst += weight;
        } else if (_vote == Vote.Abstain) {
            proposal.votesAbstain += weight;
        }
        
        // Store the receipt
        voteReceipts[_proposalId][_voter] = VoteReceipt({
            hasVoted: true,
            vote: _vote,
            weight: weight
        });
        
        emit VoteCast(_proposalId, _voter, _vote, weight);
    }
    
    /**
     * Delegate voting power to another address
     * @param _delegatee Address to delegate voting power to
     */
    function delegate(address _delegatee) public {
        address currentDelegate = delegates[msg.sender];
        delegates[msg.sender] = _delegatee;
        
        emit DelegateChanged(msg.sender, currentDelegate, _delegatee);
    }
    
    /**
     * Execute a proposal after voting ends
     * @param _proposalId ID of the proposal
     */
    function executeProposal(uint256 _proposalId) public {
        require(_proposalId < proposalCount, "DAOVoting: invalid proposal id");
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp > proposal.endTime, "DAOVoting: voting not ended");
        require(!proposal.executed, "DAOVoting: proposal already executed");
        
        // Mark as executed
        proposal.executed = true;
        
        // In a more complex implementation, we would execute the proposal's actions here
        
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * Get proposal details
     */
    function getProposal(uint256 _proposalId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 votesAbstain,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        require(_proposalId < proposalCount, "DAOVoting: invalid proposal id");
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.votesAbstain,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
    
    /**
     * Check if an address has voted for a specific proposal
     */
    function hasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        return voteReceipts[_proposalId][_voter].hasVoted;
    }
    
    /**
     * Get the vote receipt for an address on a proposal
     */
    function getVoteReceipt(uint256 _proposalId, address _voter) public view returns (bool, uint8, uint256) {
        VoteReceipt memory receipt = voteReceipts[_proposalId][_voter];
        return (receipt.hasVoted, uint8(receipt.vote), receipt.weight);
    }
    
    /**
     * Get the number of proposals
     */
    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }
    
    /**
     * Change the proposal threshold
     */
    function setProposalThreshold(uint256 _newThreshold) public onlyOwner {
        proposalThreshold = _newThreshold;
    }
    
    /**
     * Change the voting period
     */
    function setVotingPeriod(uint256 _newVotingPeriod) public onlyOwner {
        votingPeriod = _newVotingPeriod;
    }
}

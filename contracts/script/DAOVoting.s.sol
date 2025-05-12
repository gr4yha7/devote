// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DAOVoting.sol";

contract CreateProposal is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address votingAddress = vm.envAddress("VOTING_CONTRACT_ADDRESS");
        string memory title = vm.envString("PROPOSAL_TITLE");
        string memory description = vm.envString("PROPOSAL_DESCRIPTION");

        vm.startBroadcast(deployerPrivateKey);

        DAOVoting voting = DAOVoting(votingAddress);
        voting.createProposal(title, description);
        console.log("Created proposal with title:", title);
        console.log("Current proposal count:", voting.getProposalCount());

        vm.stopBroadcast();
    }
}

contract CastVote is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address votingAddress = vm.envAddress("VOTING_CONTRACT_ADDRESS");
        uint256 proposalId = vm.envUint("PROPOSAL_ID");
        uint8 voteType = uint8(vm.envUint("VOTE_TYPE")); // 1: For, 2: Against, 3: Abstain

        vm.startBroadcast(deployerPrivateKey);

        DAOVoting voting = DAOVoting(votingAddress);
        voting.castVote(proposalId, voteType);
        
        string memory voteTypeStr;
        if (voteType == 1) voteTypeStr = "FOR";
        else if (voteType == 2) voteTypeStr = "AGAINST";
        else if (voteType == 3) voteTypeStr = "ABSTAIN";
        
        console.log("Cast vote", voteTypeStr, "for proposal ID:", proposalId);

        vm.stopBroadcast();
    }
}

contract ExecuteProposal is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address votingAddress = vm.envAddress("VOTING_CONTRACT_ADDRESS");
        uint256 proposalId = vm.envUint("PROPOSAL_ID");

        vm.startBroadcast(deployerPrivateKey);

        DAOVoting voting = DAOVoting(votingAddress);
        voting.executeProposal(proposalId);
        console.log("Executed proposal ID:", proposalId);

        vm.stopBroadcast();
    }
}

contract DelegateVotes is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address votingAddress = vm.envAddress("VOTING_CONTRACT_ADDRESS");
        address delegatee = vm.envAddress("DELEGATEE_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        DAOVoting voting = DAOVoting(votingAddress);
        voting.delegate(delegatee);
        console.log("Delegated voting power to:", delegatee);

        vm.stopBroadcast();
    }
}

contract GetProposalDetails is Script {
    function setUp() public {}

    function run() public {
        address votingAddress = vm.envAddress("VOTING_CONTRACT_ADDRESS");
        uint256 proposalId = vm.envUint("PROPOSAL_ID");

        DAOVoting voting = DAOVoting(votingAddress);
        
        (uint256 id, string memory title, string memory description, 
         uint256 votesFor, uint256 votesAgainst, uint256 votesAbstain,
         uint256 startTime, uint256 endTime, bool executed) = voting.getProposal(proposalId);

        console.log("Proposal ID:", id);
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Votes For:", votesFor);
        console.log("Votes Against:", votesAgainst);
        console.log("Votes Abstain:", votesAbstain);
        console.log("Start Time:", startTime);
        console.log("End Time:", endTime);
        console.log("Executed:", executed ? "Yes" : "No");
        
        if (block.timestamp > startTime && block.timestamp < endTime) {
            console.log("Status: Active");
        } else if (block.timestamp < startTime) {
            console.log("Status: Pending");
        } else {
            console.log("Status: Ended");
        }
    }
}
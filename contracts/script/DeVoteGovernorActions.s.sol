// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeVoteGovernor.sol";

contract CreateProposal is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address payable governorAddress = payable(vm.envAddress("GOVERNOR_ADDRESS"));

        // Proposal parameters
        address targetContract = vm.envAddress("TARGET_CONTRACT");
        uint256 value = 0; // No ETH being sent in this proposal
        string memory signature = vm.envString("FUNCTION_SIGNATURE"); // e.g., "transfer(address,uint256)"
        bytes memory callData = vm.envBytes("CALL_DATA"); // ABI encoded function parameters
        string memory description = vm.envString("PROPOSAL_DESCRIPTION");

        vm.startBroadcast(deployerPrivateKey);

        DeVoteGovernor governor = DeVoteGovernor(governorAddress);

        // Create arrays for the proposal
        address[] memory targets = new address[](1);
        targets[0] = targetContract;

        uint256[] memory values = new uint256[](1);
        values[0] = value;

        bytes[] memory calldatas = new bytes[](1);

        // If calldata is provided directly
        if (callData.length > 0) {
            calldatas[0] = callData;
        }
        // If function signature and params are provided separately
        else if (bytes(signature).length > 0) {
            // This is a simplified approach - for complex calls, prepare calldata externally
            calldatas[0] = abi.encodeWithSignature(signature);
        } else {
            revert("Either CALL_DATA or FUNCTION_SIGNATURE must be provided");
        }

        // Create the proposal
        uint256 proposalId = governor.propose(
            targets,
            values,
            calldatas,
            description
        );

        console.log("Proposal created with ID:", proposalId);
        console.log("Description:", description);

        // Get the snapshot and deadline blocks
        uint256 snapshot = governor.proposalSnapshot(proposalId);
        uint256 deadline = governor.proposalDeadline(proposalId);

        console.log("Current block:", block.number);
        console.log("Vote starts at block:", snapshot);
        console.log("Vote ends at block:", deadline);

        vm.stopBroadcast();
    }
}

contract CastVote is Script {
    enum VoteType { Against, For, Abstain }

    function setUp() public {}

    function run() public {
        uint256 voterPrivateKey = vm.envUint("PRIVATE_KEY");
        address payable governorAddress = payable(vm.envAddress("GOVERNOR_ADDRESS"));
        uint256 proposalId = vm.envUint("PROPOSAL_ID");
        uint8 support = uint8(vm.envUint("VOTE")); // 0: Against, 1: For, 2: Abstain
        string memory reason = ""; // Optional reason for the vote

        try vm.envString("VOTE_REASON") returns (string memory voteReason) {
            reason = voteReason;
        } catch {}

        vm.startBroadcast(voterPrivateKey);

        DeVoteGovernor governor = DeVoteGovernor(governorAddress);

        // If a reason is provided, cast vote with reason
        if (bytes(reason).length > 0) {
            governor.castVoteWithReason(proposalId, support, reason);
            console.log("Vote cast with reason:", reason);
        } else {
            governor.castVote(proposalId, support);
            console.log("Vote cast");
        }

        // Display the vote type
        if (support == uint8(VoteType.For)) {
            console.log("Voted: FOR");
        } else if (support == uint8(VoteType.Against)) {
            console.log("Voted: AGAINST");
        } else if (support == uint8(VoteType.Abstain)) {
            console.log("Voted: ABSTAIN");
        }

        console.log("Proposal ID:", proposalId);
        console.log("Current proposal state:", uint8(governor.state(proposalId)));

        vm.stopBroadcast();
    }
}

contract QueueProposal is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address payable governorAddress = payable(vm.envAddress("GOVERNOR_ADDRESS"));
        uint256 proposalId = vm.envUint("PROPOSAL_ID");
        string memory description = vm.envString("PROPOSAL_DESCRIPTION");

        vm.startBroadcast(deployerPrivateKey);

        DeVoteGovernor governor = DeVoteGovernor(governorAddress);

        // For queueing and executing, we need to reconstruct the proposal details
        // This would typically be stored off-chain or retrieved from events
        address[] memory targets;
        uint256[] memory values;
        bytes[] memory calldatas;

        // This is simplified - in a real scenario, you would need to retrieve the exact proposal details
        // You can retrieve them from events or store them when creating the proposal
        try vm.envAddress("TARGET_CONTRACT") returns (address target) {
            targets = new address[](1);
            targets[0] = target;

            values = new uint256[](1);
            values[0] = 0;

            calldatas = new bytes[](1);
            calldatas[0] = vm.envBytes("CALL_DATA");
        } catch {
            revert("Need TARGET_CONTRACT and CALL_DATA to queue the proposal");
        }

        // Queue the proposal
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.queue(targets, values, calldatas, descriptionHash);

        console.log("Proposal queued for execution");
        console.log("Proposal ID:", proposalId);
        console.log("Current proposal state:", uint8(governor.state(proposalId)));

        vm.stopBroadcast();
    }
}

contract ExecuteProposal is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address payable governorAddress = payable(vm.envAddress("GOVERNOR_ADDRESS"));
        uint256 proposalId = vm.envUint("PROPOSAL_ID");
        string memory description = vm.envString("PROPOSAL_DESCRIPTION");

        vm.startBroadcast(deployerPrivateKey);

        DeVoteGovernor governor = DeVoteGovernor(governorAddress);

        // For executing, we need to reconstruct the proposal details
        // This would typically be stored off-chain or retrieved from events
        address[] memory targets;
        uint256[] memory values;
        bytes[] memory calldatas;

        // This is simplified - in a real scenario, you would need to retrieve the exact proposal details
        try vm.envAddress("TARGET_CONTRACT") returns (address target) {
            targets = new address[](1);
            targets[0] = target;

            values = new uint256[](1);
            values[0] = 0;

            calldatas = new bytes[](1);
            calldatas[0] = vm.envBytes("CALL_DATA");
        } catch {
            revert("Need TARGET_CONTRACT and CALL_DATA to execute the proposal");
        }

        // Execute the proposal
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.execute(targets, values, calldatas, descriptionHash);

        console.log("Proposal executed");
        console.log("Proposal ID:", proposalId);
        console.log("Current proposal state:", uint8(governor.state(proposalId)));

        vm.stopBroadcast();
    }
}

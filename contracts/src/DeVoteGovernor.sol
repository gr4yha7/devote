// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

/**
 * @title DeVoteGovernor
 * @dev Governor contract for the decentralized voting dApp
 * Uses OpenZeppelin's Governor contract with various extensions for
 * comprehensive on-chain governance functionality
 */
contract DeVoteGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    /**
     * @dev Constructor to initialize the governor with required parameters
     * @param _token The governance token used for voting power
     * @param _timelock The timelock controller for executing proposals
     * @param _votingDelay The delay between proposal creation and voting start (in blocks)
     * @param _votingPeriod The voting period duration (in blocks)
     * @param _proposalThreshold The minimum voting power required to create a proposal
     * @param _quorumNumerator The percentage of total supply required for a quorum (1-100)
     */
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint48 _votingDelay,
        uint32 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumNumerator
    )
        Governor("DAPP Governor")
        GovernorSettings(_votingDelay, _votingPeriod, _proposalThreshold)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumNumerator)
        GovernorTimelockControl(_timelock)
    {}

    // The functions below are overrides required by Solidity

    /**
     * @dev Returns the voting delay in blocks
     */
    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    /**
     * @dev Returns the voting period in blocks
     */
    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    /**
     * @dev Returns the proposal threshold
     */
    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    /**
     * @dev Returns the state of a proposal
     * @param proposalId The ID of the proposal
     */
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view virtual override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    /**
     * @dev Determines if a proposal needs to be queued in the timelock
     * @param proposalId The ID of the proposal
     */
    function _queueOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Executes a proposal
     * @param proposalId The ID of the proposal
     * @param targets The addresses of the contracts to call
     * @param values The ether values to send
     * @param calldatas The calldata to send
     * @param descriptionHash The hash of the proposal description
     */
    function _executeOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Cancels a proposal
     * @param targets The addresses of the contracts to call
     * @param values The ether values to send
     * @param calldatas The calldata to send
     * @param descriptionHash The hash of the proposal description
     */
    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Returns the executor (timelock) address
     */
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
}

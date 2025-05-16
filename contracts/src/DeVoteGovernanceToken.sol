// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title DeVoteGovernanceToken
 * @dev Governance token for the decentralized voting dApp
 * Implements ERC20Votes for on-chain voting power tracking
 */
contract DeVoteGovernanceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    /**
     * @dev Constructor that initializes the token with a name, symbol, and mints initial supply to owner
     * @param initialOwner The address that will receive the initial token supply and ownership
     */
    constructor(address initialOwner)
        ERC20("DAPP Governance Token", "DAPPGOV")
        ERC20Permit("DAPP Governance Token")
        Ownable(initialOwner)
    {
        // Initial supply to owner - 1 million tokens
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mints new tokens. Only callable by the contract owner.
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from the caller's balance.
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Burns tokens from a specified account with allowance.
     * @param account The account to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) public virtual {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }

    /**
     * @dev Returns the balance and voting power of the specified account.
     * @param account The address to check
     */
    function getVotingPower(address account) public view returns (uint256) {
        return getVotes(account);
    }

    // The following functions are overrides required by Solidity for the ERC20Votes extension

    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

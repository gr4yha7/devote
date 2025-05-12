// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => uint256) private _votingPower;
    uint256 private _totalVotingPower;

    constructor(address initialOwner) 
        ERC20("Governance Token", "GOV") 
        Ownable(initialOwner) 
    {
        // Initial supply to owner
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mints tokens to the specified address.
     * Only owner can call this function.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Returns the voting power of the specified address.
     */
    function getVotingPower(address account) public view returns (uint256) {
        return _votingPower[account];
    }

    /**
     * @dev Returns the total voting power across all token holders.
     */
    function totalVotingPower() public view returns (uint256) {
        return _totalVotingPower;
    }

    /**
     * @dev Stakes tokens to gain voting power.
     * Each staked token gives 1 voting power.
     */
    function stakeForVoting(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens from sender to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update voting power
        _votingPower[msg.sender] += amount;
        _totalVotingPower += amount;
        
        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @dev Unstakes tokens to remove voting power.
     */
    function unstakeTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(_votingPower[msg.sender] >= amount, "Insufficient staked balance");
        
        // Update voting power
        _votingPower[msg.sender] -= amount;
        _totalVotingPower -= amount;
        
        // Transfer tokens back to sender
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }

    // Events
    event TokensStaked(address indexed account, uint256 amount);
    event TokensUnstaked(address indexed account, uint256 amount);
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GovernanceToken.sol";

contract GovernanceTokenTest is Test {
    GovernanceToken public token;
    address public deployer = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);
    
    function setUp() public {
        vm.startPrank(deployer);
        token = new GovernanceToken(deployer);
        
        // Transfer some tokens to users for testing
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 5000 * 10**18);
        vm.stopPrank();
    }
    
    function testInitialSupply() public {
        assertEq(token.totalSupply(), 1000000 * 10**18);
        assertEq(token.balanceOf(deployer), 1000000 * 10**18 - 15000 * 10**18);
        assertEq(token.balanceOf(alice), 10000 * 10**18);
        assertEq(token.balanceOf(bob), 5000 * 10**18);
    }
    
    function testMint() public {
        vm.startPrank(deployer);
        uint256 initialSupply = token.totalSupply();
        uint256 mintAmount = 5000 * 10**18;
        
        token.mint(alice, mintAmount);
        
        assertEq(token.totalSupply(), initialSupply + mintAmount);
        assertEq(token.balanceOf(alice), 10000 * 10**18 + mintAmount);
        vm.stopPrank();
    }
    
    function testMintOnlyOwner() public {
        vm.startPrank(alice);
        vm.expectRevert();
        token.mint(alice, 1000 * 10**18);
        vm.stopPrank();
    }
    
    function testStakeForVoting() public {
        vm.startPrank(alice);
        uint256 stakeAmount = 1000 * 10**18;
        uint256 initialBalance = token.balanceOf(alice);
        
        token.stakeForVoting(stakeAmount);
        
        assertEq(token.balanceOf(alice), initialBalance - stakeAmount);
        assertEq(token.balanceOf(address(token)), stakeAmount);
        assertEq(token.getVotingPower(alice), stakeAmount);
        assertEq(token.totalVotingPower(), stakeAmount);
        vm.stopPrank();
    }
    
    function testStakeInsufficientBalance() public {
        vm.startPrank(alice);
        uint256 excessiveAmount = token.balanceOf(alice) + 1;
        
        vm.expectRevert("Insufficient balance");
        token.stakeForVoting(excessiveAmount);
        vm.stopPrank();
    }
    
    function testUnstakeTokens() public {
        // First stake some tokens
        vm.startPrank(alice);
        uint256 stakeAmount = 1000 * 10**18;
        uint256 initialBalance = token.balanceOf(alice);
        token.stakeForVoting(stakeAmount);
        
        // Now unstake half of them
        uint256 unstakeAmount = 500 * 10**18;
        token.unstakeTokens(unstakeAmount);
        
        assertEq(token.balanceOf(alice), initialBalance - stakeAmount + unstakeAmount);
        assertEq(token.getVotingPower(alice), stakeAmount - unstakeAmount);
        assertEq(token.totalVotingPower(), stakeAmount - unstakeAmount);
        vm.stopPrank();
    }
    
    function testUnstakeInsufficientStakedBalance() public {
        vm.startPrank(alice);
        uint256 stakeAmount = 1000 * 10**18;
        token.stakeForVoting(stakeAmount);
        
        vm.expectRevert("Insufficient staked balance");
        token.unstakeTokens(stakeAmount + 1);
        vm.stopPrank();
    }
    
    function testMultipleUserStaking() public {
        // Alice stakes
        vm.startPrank(alice);
        uint256 aliceStakeAmount = 2000 * 10**18;
        token.stakeForVoting(aliceStakeAmount);
        vm.stopPrank();
        
        // Bob stakes
        vm.startPrank(bob);
        uint256 bobStakeAmount = 1000 * 10**18;
        token.stakeForVoting(bobStakeAmount);
        vm.stopPrank();
        
        // Check individual and total voting power
        assertEq(token.getVotingPower(alice), aliceStakeAmount);
        assertEq(token.getVotingPower(bob), bobStakeAmount);
        assertEq(token.totalVotingPower(), aliceStakeAmount + bobStakeAmount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GovernanceToken.sol";

contract MintTokens is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        address recipient = vm.envAddress("RECIPIENT_ADDRESS");
        uint256 amount = vm.envUint("MINT_AMOUNT");

        vm.startBroadcast(deployerPrivateKey);

        GovernanceToken token = GovernanceToken(tokenAddress);
        token.mint(recipient, amount);
        console.log("Minted", amount, "tokens to", recipient);
        console.log("New balance:", token.balanceOf(recipient));

        vm.stopBroadcast();
    }
}

contract StakeTokens is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        uint256 amount = vm.envUint("STAKE_AMOUNT");

        vm.startBroadcast(deployerPrivateKey);

        GovernanceToken token = GovernanceToken(tokenAddress);
        token.stakeForVoting(amount);
        console.log("Staked", amount, "tokens for voting");
        console.log("Voting power:", token.getVotingPower(vm.addr(deployerPrivateKey)));

        vm.stopBroadcast();
    }
}

contract TransferTokens is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        address recipient = vm.envAddress("RECIPIENT_ADDRESS");
        uint256 amount = vm.envUint("TRANSFER_AMOUNT");

        vm.startBroadcast(deployerPrivateKey);

        GovernanceToken token = GovernanceToken(tokenAddress);
        token.transfer(recipient, amount);
        console.log("Transferred", amount, "tokens to", recipient);
        console.log("Recipient balance:", token.balanceOf(recipient));

        vm.stopBroadcast();
    }
}
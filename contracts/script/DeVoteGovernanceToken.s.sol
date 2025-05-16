// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DeVoteGovernanceToken.sol";

contract DeployDeVoteGovernanceToken is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy governance token
        DeVoteGovernanceToken token = new DeVoteGovernanceToken(deployer);
        console.log("DeVoteGovernanceToken deployed at:", address(token));

        vm.stopBroadcast();
    }
}

contract MintTokens is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        address recipient = vm.envAddress("RECIPIENT_ADDRESS");
        uint256 amount = vm.envUint("MINT_AMOUNT");

        vm.startBroadcast(deployerPrivateKey);

        DeVoteGovernanceToken token = DeVoteGovernanceToken(tokenAddress);
        token.mint(recipient, amount);
        console.log("Minted", amount, "tokens to", recipient);
        console.log("New balance:", token.balanceOf(recipient));

        vm.stopBroadcast();
    }
}

contract DelegateVotes is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address tokenAddress = vm.envAddress("GOVERNANCE_TOKEN_ADDRESS");
        address delegatee = vm.envAddress("DELEGATEE_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        DeVoteGovernanceToken token = DeVoteGovernanceToken(tokenAddress);
        token.delegate(delegatee);
        console.log("Delegated voting power to:", delegatee);
        console.log("Delegatee voting power:", token.getVotingPower(delegatee));

        vm.stopBroadcast();
    }
}

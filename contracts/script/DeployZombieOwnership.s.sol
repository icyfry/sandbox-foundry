// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {ZombieOwnership} from "../src/cryptozombies/zombieownership.sol";

contract DeployZombieOwnership is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        ZombieOwnership zombieownership = new ZombieOwnership();
        console.log("ZombieOwnership deployed at address: ", address(zombieownership));
        vm.stopBroadcast();
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ZombieFactory} from "../src/cryptozombies/zombiefactory.sol";

contract CounterTest is Test {
    ZombieFactory public zombieFactory;

    function setUp() public {
        zombieFactory = new ZombieFactory();
    }

    function test_Create() public {
        zombieFactory.createRandomZombie("test");
        (string memory name,,,,,) = zombieFactory.zombies(0);
        assertEq(name, "test");
    }
}

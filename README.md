# Sandbox Foundry

<img src="https://img.shields.io/badge/solidity-0.8.13-005850?style=flat"> <img src="https://img.shields.io/badge/Vue.js-35495E?logo=vuedotjs&logoColor=4FC08D" /> <img src="https://img.shields.io/badge/-Ethereum-005850?style=flat&logo=Ethereum">
[![Build](https://github.com/icyfry/sandbox-foundry/actions/workflows/build.yml/badge.svg)](https://github.com/icyfry/sandbox-foundry/actions/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=icyfry_sandbox-foundry&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=icyfry_sandbox-foundry)

This repository contains source codes for experimentation with [Foundry](https://github.com/foundry-rs) and [Vue.js](https://vuejs.org/)

Courses used in the repository
* [Cryptozombies](https://cryptozombies.io/en/)
* [Cyfrin Foundry](https://updraft.cyfrin.io/courses/foundry)

`contracts` folder contain Cryptozombies smart contracts and `dapp` folder contain a Vue.js frontend

## Install and config

[Doc to install foundry](https://book.getfoundry.sh/getting-started/installation)

```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

[Creating a new foundry project](https://book.getfoundry.sh/projects/creating-a-new-project)
```
forge init
```

Install OpenZeppelin
```
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install smartcontractkit/chainlink-brownie-contracts@0.8.0 --no-commit
```

If needed, to init remappings use `forge remappings > remappings.txt`

### Add private key to foundry keystore

```bash
cast wallet import defaultKey --interactive
```

then add the password in `contracts/.password` file and `PUBLIC_KEY_LOCAL` public key in `.env`

### VSCode Configuration

* https://book.getfoundry.sh/config/vscode
* https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity

## Frontend

The frontend in `dapp` has been created with [vitejs](https://vitejs.dev/guide/) and [vitest](https://vitest.dev/guide/) for unit testing 


## Test Contracts

Run tests on contracts
```
task contracts-test
or
forge test --fork-url <URL>
```

Test call with cast for Cryptozombies
```
cast call 0x... "getZombiesByOwner(address _owner)" "0x..."
```

### Gas

Create a gas usage snapshot file `.gas-snapshot` with `forge snapshot`

## Run Contracts and Frontend

Launch a local testnet node, see [Anvil doc](https://book.getfoundry.sh/reference/anvil/)
```
anvil
```
Build and deploy contracts
```
task contracts-build contracts-deploy
```
Launch frontend
```
task frontend-build frontend-run
```

## Resources

* https://www.cyfrin.io/blog/top-web3-tools-for-developers
* https://github.com/foundry-rs/foundry
* https://book.getfoundry.sh/
* https://docs.soliditylang.org/en/v0.8.23/
* Cyfrin
    * https://updraft.cyfrin.io/courses/foundry
    * https://updraft.cyfrin.io/courses/advanced-foundry
* https://github.com/ChainSafe/web3js-example-react-app
* https://docs.web3js.org/
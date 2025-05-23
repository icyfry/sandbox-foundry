# Sandbox Foundry

<img src="https://img.shields.io/badge/solidity-0.8.13-005850?style=flat"> <img src="https://img.shields.io/badge/Vue.js-35495E?logo=vuedotjs&logoColor=4FC08D" />
[![Build](https://github.com/icyfry/sandbox-foundry/actions/workflows/build.yml/badge.svg)](https://github.com/icyfry/sandbox-foundry/actions/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=icyfry_sandbox-foundry&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=icyfry_sandbox-foundry)

This repository contains source codes for experimentation with [Foundry](https://github.com/foundry-rs) and [Vue.js](https://vuejs.org/)

Courses used in the repository
* [Cryptozombies](https://cryptozombies.io/en/)
* [Cyfrin Foundry](https://updraft.cyfrin.io/courses/foundry)

`contracts` folder contain courses smart contracts and `dapp` folder contain a Vue.js frontend to interact with the contracts

## Install and config

### VSCode Configuration

* https://book.getfoundry.sh/config/vscode

### Docker

The project use a docker image to build and deploy

Create the docker image
```bash
docker build -t sandbox-foundry .
```

Run the docker container to interact with the project with `task docker` or
```bash
docker run -it --rm -v $(pwd)/contracts:/home/node/contracts -v foundry_sandbox_lib:/home/node/contracts/lib -v /home/node/contracts/out -v /home/node/contracts/cache -v $(pwd)/dapp:/home/node/dapp -v foundry_sandbox_dapp_modules:/home/node/dapp/node_modules -v /home/node/dapp/.pnpm-store --user node sandbox-foundry bash
```

* `/home/node/dapp` contain the vue dapp
* `/home/node/contracts` contain the contracts

### Forge

Install forge libs inside docker
```bash
task contracts-install-libs
```

If needed, to init remappings use `forge remappings > remappings.txt`

#### Add private key to foundry keystore

```bash
cast wallet import defaultKey --interactive
```

then add the password in `contracts/.password` file and `PUBLIC_KEY_LOCAL` public key in `.env`

## Tests

### Test Contracts

Run tests on contracts
```bash
task contracts-test
```
or
```bash
forge test --fork-url <URL>
```

Test call with cast for Cryptozombies
```bash
cast call 0x... "getZombiesByOwner(address _owner)" "0x..."
```

Create a gas usage snapshot file `.gas-snapshot` with `forge snapshot`

### Run Contracts and Frontend

The frontend in `dapp` has been created with [vitejs](https://vitejs.dev/guide/) and [vitest](https://vitest.dev/guide/) for unit testing 

Launch a local testnet node, see [Anvil doc](https://book.getfoundry.sh/reference/anvil/)
```bash
anvil
```
Build and deploy contracts
```bash
task contracts-build contracts-deploy
```
Launch frontend
```bash
task frontend-build frontend-run
```

## Resources

* https://github.com/foundry-rs/foundry
* https://book.getfoundry.sh/
* [Install foundry](https://book.getfoundry.sh/getting-started/installation)
* https://docs.soliditylang.org/en/v0.8.23/
* Cyfrin
    * https://updraft.cyfrin.io/courses/foundry
    * https://updraft.cyfrin.io/courses/advanced-foundry
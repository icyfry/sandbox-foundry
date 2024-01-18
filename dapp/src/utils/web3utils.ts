import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3, { Contract, Web3ContractError } from 'web3';

// Foundry generated contracts and broadcasts
import cryptozombiesABI from '../../../contracts/out/zombieownership.sol/ZombieOwnership.json';
import fundmeABI from '../../../contracts/out/FundMe.sol/FundMe.json';
import fundmeBroadcastSepolia from '../../../contracts/broadcast/DeployFundMe.s.sol/11155111/run-latest.json';

// Local broadcast data (anvil)
let cryptozombiesBroadcastLocal: any
let fundmeBroadcastLocal: any;

// Log NODE_ENV
console.log("ENV:" + process.env.NODE_ENV);

export class Web3Utils {

    private web3js!: Web3;
    private ethereum!: MetaMaskInpageProvider;
    public account!: string;
    public networkId!: bigint;
    public cryptoZombiesContract!: Contract<any>;
    public fundmeContract!: Contract<any>;

    async getCryptozombiesBroadcastLocal(): Promise<any> {
        // if (process.env.NODE_ENV !== 'development') throw new Error("Not in development mode");
        cryptozombiesBroadcastLocal = {
            transactions: [
                {
                    "contractName": "ZombieOwnership",
                    "contractAddress": ""
                }
            ]
        };
        return cryptozombiesBroadcastLocal;
    }

    async getFundmeBroadcastLocal(): Promise<any> {
        // if (process.env.NODE_ENV !== 'development') throw new Error("Not in development mode");
        fundmeBroadcastLocal = {
            transactions: [
                {
                    "contractName": "FundMe",
                    "contractAddress": ""
                }
            ]
        };
        return fundmeBroadcastLocal;
    }

    // Foundry broadcast data
    private BROADCAST: { [key: number]: { cryptoZombies: Promise<any>, fundme: Promise<any> } } = {
        1: { // Mainnet
            cryptoZombies: Promise.resolve(null),
            fundme: Promise.resolve(null),
        },
        11155111: { // Sepolia
            cryptoZombies: Promise.resolve(fundmeBroadcastSepolia),
            fundme: Promise.resolve(fundmeBroadcastSepolia)
        },
        31337: { // Local
            cryptoZombies: this.getCryptozombiesBroadcastLocal(),
            fundme: this.getFundmeBroadcastLocal()
        },
    };

    constructor(ethereum: MetaMaskInpageProvider | undefined) {
        if (ethereum) {
            this.ethereum = ethereum
        }
        else {
            console.log("no window.ethereum, install Metamask");
        }
    }

    private getContractAddressInBroadcast(broadcast: any, contractName: string): string | null {
        for (const transaction of broadcast.transactions) {
            if (transaction.contractName === contractName) {
                return transaction.contractAddress;
            }
        }
        return null;
    }

    async getFundmeContractAddress(networkId: bigint): Promise<string | null> {
        if (this.BROADCAST[Number(networkId)]?.fundme == null) throw new Error("No contract found for network " + networkId);
        return this.getContractAddressInBroadcast(await this.BROADCAST[Number(networkId)].fundme, "FundMe");
    }

    async getCryptozombiesContractAddress(networkId: bigint): Promise<string | null> {
        if (this.BROADCAST[Number(networkId)]?.cryptoZombies == null) throw new Error("No contract found for network " + networkId);
        return this.getContractAddressInBroadcast(await this.BROADCAST[Number(networkId)].cryptoZombies, "ZombieOwnership");
    }

    initialize(): void {
        try {

            console.log("Initialize web 3 utils");

            if (this.ethereum == undefined) throw new Error("Provider not found");

            this.ethereum.request({ method: 'eth_requestAccounts' });
            this.web3js = new Web3(this.ethereum);

            this.web3js.eth.getAccounts().then((accounts: any[]) => {
                this.account = this.web3js.utils.toChecksumAddress(accounts[0]);
                console.log("Account: " + this.account);
            });

            this.web3js.eth.net.getId().then((id: bigint) => {
                this.networkId = id
                this.getCryptozombiesContractAddress(this.networkId).then((address) => {
                    const cryptozombiesContractAddress = address as string
                    this.cryptoZombiesContract = new this.web3js.eth.Contract(cryptozombiesABI.abi, cryptozombiesContractAddress);
                });
                this.getFundmeContractAddress(this.networkId).then((address) => {
                    const fundmeContractAddress = address as string
                    this.fundmeContract = new this.web3js.eth.Contract(fundmeABI.abi, fundmeContractAddress);
                });
            });

        } catch (error) {
            throw new Error("Error during initialize Web 3 " + this.networkId + " " + this.account);
        }
    }

    createRandomZombie(name: string) {
        // Send the tx to our contract:
        this.cryptoZombiesContract.methods.createRandomZombie(name)
            .send({ from: this.account })/*.then(() => {
                console.log("then");
            })*/
            .on("receipt", function (receipt: any) {
                console.log("Successfully created " + name + "! (" + receipt + ")");
            })
            .on("error", function (error: any) {
                console.error(error);
            });
    }

    async getZombiesForAccount(): Promise<Zombie[]> {

        if (this.cryptoZombiesContract == null) { throw new Error("Contract not initialized"); }

        const zombies: Zombie[] = [];
        console.log("getZombiesByOwner " + this.account);
        this.cryptoZombiesContract.methods.getZombiesByOwner(this.account).call().then(
            (value: any) => {
                console.log(value);
                value.forEach((id: number) => {
                    this.cryptoZombiesContract.methods.zombies(id).call().then(
                        function (zombie: any) {
                            zombies.push(zombie as Zombie);
                        })
                });
            }
        ).catch(
            function (reason: any) {
                console.error(reason);
            }
        )
        console.log("Zombies: " + zombies)
        return zombies;
    }

    zombieToOwner(id: string) {
        return this.cryptoZombiesContract.methods.zombieToOwner(id).call();
    }

    withdraw() {
        console.log(`Withdrawing...`)
        try {
            const transaction = this.fundmeContract.methods.withdraw();

            transaction.send({ from: this.account })
                .on('transactionHash', function (hash: string) {
                    console.log(hash);
                })
                .on('confirmation', function (confirmation: { confirmations: bigint, receipt: { transactionHash: string, transactionIndex: bigint, blockHash: string, blockNumber: bigint, from: string }, latestBlockHash: string }) {
                    console.log(confirmation);
                })
                .on('receipt', function (receipt: any) { // type ReceiptOutput
                    console.log(receipt);
                })
                .on('error', function (error: Web3ContractError) {
                    console.log(error);
                }).then(function (receipt: any) { // type ReceiptOutput
                    console.log(receipt)
                })
                .catch((error: any) => {
                    console.error(error);
                });

        } catch (error) {
            console.error(error)
        }
    }

    fund(ethAmount: any) {
        console.log(`Funding with ${ethAmount}`)
        try {

            const transaction = this.fundmeContract.methods.fund({
                value: this.web3js.utils.toWei(ethAmount, "ether"),
            });

            transaction.send({ from: this.account })
                .on('transactionHash', function (hash: string) {
                    console.log(hash);
                })
                .on('confirmation', function (confirmation: { confirmations: bigint, receipt: { transactionHash: string, transactionIndex: bigint, blockHash: string, blockNumber: bigint, from: string }, latestBlockHash: string }) {
                    console.log(confirmation);
                })
                .on('receipt', function (receipt: any) { // type ReceiptOutput
                    console.log(receipt);
                })
                .on('error', function (error: Web3ContractError) {
                    console.log(error);
                })
                .then(function (receipt: any) { // type ReceiptOutput
                    console.log(receipt)
                })
                .catch((error: any) => {
                    console.error(error);
                });

        } catch (error) {
            console.error(error)
        }
    }

    async getBalance(): Promise<string> {
        let res: string = "?"
        try {
            const balance = await this.web3js.eth.getBalance(String(this.fundmeContract.options.address))
            res = this.web3js.utils.fromWei(balance, "ether")
        } catch (error) {
            console.log(error)
        }
        return res;
    }



}
export interface Zombie {
    name?: string;
    dna?: number;
    level?: number;
    winCount?: number;
    lossCount?: number;
    readyTime?: number;
}
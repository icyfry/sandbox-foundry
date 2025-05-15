import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

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

    private provider!: ethers.BrowserProvider;
    private signer!: ethers.Signer;
    private ethereum!: MetaMaskInpageProvider;
    public account!: string;
    public networkId!: bigint;
    public cryptoZombiesContract!: ethers.Contract;
    public fundmeContract!: ethers.Contract;

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

            this.provider = new ethers.BrowserProvider(this.ethereum);
            this.provider.send("eth_requestAccounts", []).then(async () => {
                this.signer = await this.provider.getSigner();
                this.account = await this.signer.getAddress();
                console.log("Account: " + this.account);

                const network = await this.provider.getNetwork();
                this.networkId = BigInt(network.chainId);

                this.getCryptozombiesContractAddress(this.networkId).then((address) => {
                    const cryptozombiesContractAddress = address as string;
                    this.cryptoZombiesContract = new ethers.Contract(
                        cryptozombiesContractAddress,
                        cryptozombiesABI.abi,
                        this.signer
                    );
                });
                this.getFundmeContractAddress(this.networkId).then((address) => {
                    const fundmeContractAddress = address as string;
                    this.fundmeContract = new ethers.Contract(
                        fundmeContractAddress,
                        fundmeABI.abi,
                        this.signer
                    );
                });
            });

        } catch (error) {
            throw new Error("Error during initialize Web 3 " + this.networkId + " " + this.account);
        }
    }

    async createRandomZombie(name: string) {
        try {
            const tx = await this.cryptoZombiesContract.createRandomZombie(name);
            const receipt = await tx.wait();
            console.log("Successfully created " + name + "! (" + JSON.stringify(receipt) + ")");
        } catch (error) {
            console.error(error);
        }
    }

    async getZombiesForAccount(): Promise<Zombie[]> {

        if (!this.cryptoZombiesContract) throw new Error("Contract not initialized");

        const zombies: Zombie[] = [];
        try {
            // Appel direct de la fonction view du contrat
            const zombieIds: bigint[] = await this.cryptoZombiesContract.getZombiesByOwner(this.account);
            for (const id of zombieIds) {
                const zombie: Zombie = await this.cryptoZombiesContract.zombies(id);
                zombies.push(zombie);
            }
            console.log("Zombies:", zombies);
            return zombies;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    zombieToOwner(id: string) {
        return this.cryptoZombiesContract.zombieToOwner(id);
    }

    async withdraw() {
        console.log(`Withdrawing...`)
        try {
            const tx = await this.fundmeContract.withdraw();
            const r = await tx.wait();
            console.log(r);
        } catch (error) {
            console.error(error)
        }
    }

    async fund(ethAmount: any) {
        console.log(`Funding with ${ethAmount}`)
        try {

            const tx = await this.fundmeContract.fund({
                value: ethers.parseEther(ethAmount)
            });
            const r = await tx.wait();
            console.log(r);

        } catch (error) {
            console.error(error)
        }
    }

    async getBalance(): Promise<string> {
        let res: string = "?";
        try {
            if (!this.provider || !this.fundmeContract) throw new Error("Provider or contract not initialized");
            const address = await this.fundmeContract.getAddress();
            const balance = await this.provider.getBalance(address);
            res = ethers.formatEther(balance);
        } catch (error) {
            console.log(error);
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
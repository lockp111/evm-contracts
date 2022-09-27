import { ethers, upgrades, network } from "hardhat";
import { LedgerSigner } from "@ethersproject/hardware-wallets";
import { Signer } from "ethers";
import { SingerKey } from "./const";

let ledger: Signer;
if (network.config.accounts == 'remote') {
    console.log("new ledger sender");
    ledger = new LedgerSigner(ethers.provider);
}

export async function deployReward(signerAddr: string, nftAddr: string) {
    const Reward = await ethers.getContractFactory("Reward", ledger);
    const reward = await upgrades.deployProxy(Reward, [signerAddr, nftAddr], { initializer: 'initialize' });
    await reward.deployed();
    return reward;
}

export async function deployTinyRune() {
    const TinyRune = await ethers.getContractFactory("TinyRune");
    const tinyRune = await upgrades.deployProxy(TinyRune, [], { initializer: 'initialize' });
    await tinyRune.deployed();
    return tinyRune;
}

export async function initRewardTest() {
    const tinyRune = await deployTinyRune()
    const signer = new ethers.Wallet(SingerKey!, ethers.provider);
    const reward = await deployReward(signer.address, tinyRune.address);
    await tinyRune.mintStaminaItem(reward.address, 10000);
    return { reward, signer, tinyRune };
}

export async function upgradeReward(proxyAddr: string) {
    const Reward = await ethers.getContractFactory("Reward", ledger);
    const reward = await upgrades.upgradeProxy(proxyAddr, Reward)
    await reward.deployed();
    return reward;
}
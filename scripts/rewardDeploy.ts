import { ethers, network } from "hardhat";
import { deployReward } from "../common/init";;
import { NFTAddress, SingerKey } from '../common/const';

async function main() {
    const wallet = new ethers.Wallet(SingerKey!, ethers.provider)
    const reward = await deployReward(wallet.address, NFTAddress!);
    console.log("[%s]Reward deployed to: %s", network.name, reward.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

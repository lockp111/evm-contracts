import { network } from "hardhat";
import { upgradeReward } from "../common/init";
import { ProxyAddress } from '../common/const';

async function main() {
    const reward = await upgradeReward(ProxyAddress!);
    await reward.deployed();
    console.log("[%s]Reward upgrade success", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

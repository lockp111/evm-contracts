import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { initRewardTest } from "../common/init";
import { expect } from "chai";
import { ethers } from "hardhat";
import { arrayify } from "ethers/lib/utils";
import { Wallet } from "ethers";
import { SingerKey } from '../common/const';

describe("Reward", function () {
    it("Should set the right owner", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [owner] = await ethers.getSigners();
        expect(await reward.owner()).to.eq(owner.address);
    });

    it("Should check right signature", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [player] = await ethers.getSigners();
        const wallet = new Wallet(SingerKey!, ethers.provider)

        const hash = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player.address, 1, 2]);
        const signature = await wallet.signMessage(arrayify(hash));

        expect(await reward.connect(player).claim(2, 1, signature)).to.
            emit(reward, "Claim").
            withArgs(player.address, 2, 1, signature, await time.latest());
    });

    it("Should not change params", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [player] = await ethers.getSigners();
        const wallet = new Wallet(SingerKey!, ethers.provider)

        const hash = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player.address, 1, 2]);
        const signature = await wallet.signMessage(arrayify(hash));

        await expect(reward.connect(player).claim(3, 1, signature)).
            to.be.revertedWith("invalidSign")
    });

    it("Should not cliam repeated", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [player] = await ethers.getSigners();
        const wallet = new Wallet(SingerKey!, ethers.provider)

        const hash_1 = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player.address, 1, 2]);
        const signature_1 = await wallet.signMessage(arrayify(hash_1));
        await reward.connect(player).claim(2, 1, signature_1);


        const hash_2 = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player.address, 2, 1]);
        const signature_2 = await wallet.signMessage(arrayify(hash_2));
        await reward.connect(player).claim(1, 2, signature_2);

        await expect(reward.connect(player).claim(2, 1, signature_1)).
            to.be.revertedWith("invalidNonce")
        await expect(reward.connect(player).claim(1, 2, signature_2)).
            to.be.revertedWith("invalidNonce")
    });

    it("Should get right count", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [player1, player2] = await ethers.getSigners();
        const wallet = new Wallet(SingerKey!, ethers.provider)

        let hash = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player1.address, 1, 2]);
        let signature = await wallet.signMessage(arrayify(hash));
        await reward.connect(player1).claim(2, 1, signature);

        hash = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player2.address, 2, 5]);
        signature = await wallet.signMessage(arrayify(hash));
        await reward.connect(player2).claim(5, 2, signature);

        hash = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [player1.address, 3, 1]);
        signature = await wallet.signMessage(arrayify(hash));
        await reward.connect(player1).claim(1, 3, signature);

        expect(await reward.rewardCount(player1.address)).to.eq(3);
        expect(await reward.rewardCount(player2.address)).to.eq(5);
    });

    it("Should set signer only by owner", async function () {
        const { reward } = await loadFixture(initRewardTest);
        const [player1, player2] = await ethers.getSigners();
        // const wallet = new Wallet(SingerKey!, ethers.provider)
        
        await expect(reward.connect(player2).setSigner(player1.address)).
            to.be.revertedWith("Ownable: caller is not the owner")

        await reward.connect(player1).setSigner(player2.address)
    });

});
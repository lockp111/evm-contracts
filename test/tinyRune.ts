import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployTinyRune } from "../common/init";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TinyRune", function () {
    it("Should mint success", async function () {
        const tinyRune = await loadFixture(deployTinyRune);
        const [owner, player1] = await ethers.getSigners();
        expect(await tinyRune.connect(owner).mintStaminaItem(player1.address, 1000)).to.
            emit(tinyRune, "TransferSingle").
            withArgs(owner.address, 0, player1.address, 1, 1000);
        expect(await tinyRune.balanceOf(player1.address, 1)).to.eq(1000);
    });
});
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

contract TinyRune is ERC1155Upgradeable {
    uint256 private constant StaminaItemId = 1;

    function initialize() public initializer {
        __ERC1155_init("tinyRuneTest");
    }

    function mintStaminaItem(address to, uint256 amount) external {
        _mint(to, StaminaItemId, amount, new bytes(0));
    }
}

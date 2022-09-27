// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Reward is
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC1155ReceiverUpgradeable
{
    uint256 private constant StaminaItemId = 1;
    address private _signer;

    mapping(address => uint256) _rewardNonce;
    mapping(address => uint256) _rewardCount;

    IERC1155Upgradeable _nftRune;

    event Claim(
        address indexed to,
        uint256 indexed amount,
        uint256 indexed nonce,
        bytes signature,
        uint timestamp
    );

    function initialize(address signer, address nft) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __ERC1155Receiver_init();

        _signer = signer;
        _nftRune = IERC1155Upgradeable(nft);
    }

    function _getHash(
        address account,
        uint256 amount,
        uint256 nonce
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account, nonce, amount));
    }

    function rewardCount(address account) external view returns (uint256) {
        uint256 count = _rewardCount[account];
        return count;
    }

    function _checkSignature(
        address account,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) internal view returns (bool) {
        bytes32 _hash = _getHash(account, amount, nonce);
        bytes32 message = ECDSA.toEthSignedMessageHash(_hash);
        return ECDSA.recover(message, signature) == _signer;
    }

    function claim(
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external nonReentrant {
        require(
            _checkSignature(msg.sender, amount, nonce, signature),
            "invalidSign"
        );
        require(_rewardNonce[msg.sender] < nonce, "invalidNonce");
        _nftRune.safeTransferFrom(
            address(this),
            msg.sender,
            StaminaItemId,
            amount,
            new bytes(0)
        );

        _rewardNonce[msg.sender] = nonce;
        _rewardCount[msg.sender] += amount;
        emit Claim(msg.sender, amount, nonce, signature, block.timestamp);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155ReceiverUpgradeable.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155ReceiverUpgradeable.onERC1155BatchReceived.selector;
    }

    function setSigner(address signer) external onlyOwner {
        _signer = signer;
    }
}

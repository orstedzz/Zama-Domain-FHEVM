// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ZamaDomainRegistry is SepoliaConfig {
    struct Domain {
        address owner;
        uint256 expiresAt;
        string name;
        bytes32 txHash; // optional: lưu tx hash nếu cần
    }

    uint256 public constant PRICE_PER_YEAR = 1_000_000_000_000_000; // 0.001 ETH
    mapping(bytes32 => Domain) public domains;
    mapping(address => bytes32[]) private ownedDomains;

    event DomainRegistered(bytes32 indexed nameHash, address indexed owner, uint256 expiresAt);

    function buyDomain(string calldata name, uint256 durationInYears) external payable {
        require(durationInYears >= 1, "min 1 year");
        bytes32 nameHash = keccak256(abi.encodePacked(name));
        Domain storage d = domains[nameHash];
        require(d.expiresAt < block.timestamp, "domain already exists");

        uint256 cost = PRICE_PER_YEAR * durationInYears;
        require(msg.value >= cost, "insufficient payment");

        d.owner = msg.sender;
        d.expiresAt = block.timestamp + durationInYears * 365 days;
        d.name = name;

        ownedDomains[msg.sender].push(nameHash);

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit DomainRegistered(nameHash, msg.sender, d.expiresAt);
    }

    function isDomainAvailable(string calldata name) public view returns (bool) {
        bytes32 nameHash = keccak256(abi.encodePacked(name));
        return domains[nameHash].expiresAt < block.timestamp;
    }

    // NEW: trả về toàn bộ domains của 1 user
    function getDomainsByOwner(address user) external view returns (Domain[] memory) {
        bytes32[] storage hashes = ownedDomains[user];
        Domain[] memory result = new Domain[](hashes.length);
        for (uint256 i = 0; i < hashes.length; i++) {
            result[i] = domains[hashes[i]];
        }
        return result;
    }

    // withdraw
    address private _owner;
    modifier onlyOwner() {
        require(msg.sender == _owner, "not owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    function withdrawAll() external onlyOwner {
        payable(_owner).transfer(address(this).balance);
    }
}

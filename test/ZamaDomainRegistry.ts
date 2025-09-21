import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ZamaDomainRegistry, ZamaDomainRegistry__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory(
    "ZamaDomainRegistry"
  )) as ZamaDomainRegistry__factory;
  const registry = (await factory.deploy()) as ZamaDomainRegistry;
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  return { registry, registryAddress };
}

describe("ZamaDomainRegistry", function () {
  let signers: Signers;
  let registry: ZamaDomainRegistry;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    ({ registry } = await deployFixture());
  });

  it("new domain should be available", async function () {
    const available = await registry.isDomainAvailable("alice");
    expect(available).to.eq(true);
  });

  it("buying a domain should make it unavailable", async function () {
    const name = "alice";
    const durationInYears = 1;
    const pricePerYear = ethers.parseEther("0.001");
    const totalCost = pricePerYear * BigInt(durationInYears);

    await registry.connect(signers.alice).buyDomain(name, durationInYears, { value: totalCost });

    const available = await registry.isDomainAvailable(name);
    expect(available).to.eq(false);
  });

  it("should set correct owner and expiry", async function () {
    const name = "bob";
    const durationInYears = 2;
    const pricePerYear = ethers.parseEther("0.001");
    const totalCost = pricePerYear * BigInt(durationInYears);

    const now = (await ethers.provider.getBlock("latest"))!.timestamp;

    await registry.connect(signers.bob).buyDomain(name, durationInYears, { value: totalCost });

    const nameHash = ethers.keccak256(ethers.toUtf8Bytes(name));
    const domain = await registry.domains(nameHash);

    expect(domain.owner).to.eq(signers.bob.address);
    expect(Number(domain.expiresAt)).to.be.greaterThan(now);
  });

  it("should revert if insufficient payment", async function () {
    const name = "charlie";
    const durationInYears = 1;
    const wrongValue = ethers.parseEther("0.0005"); // insufficient

    await expect(
      registry.connect(signers.alice).buyDomain(name, durationInYears, { value: wrongValue })
    ).to.be.revertedWith("insufficient payment");
  });
});

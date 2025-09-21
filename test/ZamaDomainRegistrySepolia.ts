import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, deployments, fhevm } from "hardhat";
import { ZamaDomainRegistry } from "../types";
import { expect } from "chai";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("ZamaDomainRegistrySepolia", function () {
  let signers: Signers;
  let zamaDomainRegistryContract: ZamaDomainRegistry;
  let zamaDomainRegistryContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    // Chỉ chạy trên Sepolia, không phải mock
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const deployment = await deployments.get("ZamaDomainRegistry");
      zamaDomainRegistryContractAddress = deployment.address;
      zamaDomainRegistryContract = await ethers.getContractAt(
        "ZamaDomainRegistry",
        deployment.address
      );
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should buy a domain on Sepolia", async function () {
    steps = 5;
    this.timeout(5 * 60000); // tăng timeout do tx trên Sepolia chậm

    const domain = "alice" + Math.floor(Math.random() * 10000); // domain ngẫu nhiên
    const durationInYears = 1;
    const pricePerYear = ethers.parseEther("0.001");
    const totalCost = pricePerYear * BigInt(durationInYears);

    progress(`Checking availability of ${domain}.zama...`);
    const availableBefore = await zamaDomainRegistryContract.isDomainAvailable(domain);
    expect(availableBefore).to.eq(true);

    progress(`Buying ${domain}.zama for ${durationInYears} year(s)...`);
    const tx = await zamaDomainRegistryContract
      .connect(signers.alice)
      .buyDomain(domain, durationInYears, { value: totalCost });
    await tx.wait();

    progress(`Re-checking availability of ${domain}.zama...`);
    const availableAfter = await zamaDomainRegistryContract.isDomainAvailable(domain);
    expect(availableAfter).to.eq(false);

    progress(`Fetch domain struct...`);
    const nameHash = ethers.keccak256(ethers.toUtf8Bytes(domain));
    const d = await zamaDomainRegistryContract.domains(nameHash);

    expect(d.owner).to.eq(signers.alice.address);
    expect(Number(d.expiresAt)).to.be.greaterThan(0);
  });
});

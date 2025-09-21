import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Example usage:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 *
 *   - npx hardhat --network localhost task:is-available --name alice
 *   - npx hardhat --network sepolia task:is-available --name bob
 *
 *   - npx hardhat --network sepolia task:buy --name alice --durationInYears 2
 */

task("task:address", "Prints the ZamaDomainRegistry contract address").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const { deployments } = hre;
  const deployment = await deployments.get("ZamaDomainRegistry");
  console.log("ZamaDomainRegistry deployed at:", deployment.address);
});

task("task:is-available", "Check if a domain is available")
  .addParam("name", "The domain name (without .zama)")
  .addOptionalParam("address", "Optionally specify the ZamaDomainRegistry address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("ZamaDomainRegistry");

    const contract = await ethers.getContractAt("ZamaDomainRegistry", deployment.address);

    const available = await contract.isDomainAvailable(taskArguments.name);
    console.log(`Domain "${taskArguments.name}.zama" available:`, available);
  });

task("task:get-domain", "Get info about a domain")
  .addParam("name", "The domain name (without .zama)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const deployment = await deployments.get("ZamaDomainRegistry");
    const contract = await ethers.getContractAt("ZamaDomainRegistry", deployment.address);

    const nameHash = ethers.keccak256(ethers.toUtf8Bytes(taskArguments.name));
    const domain = await contract.domains(nameHash);

    console.log(`Domain: ${taskArguments.name}.zama`);
    console.log(`  Owner     : ${domain.owner}`);
    console.log(`  ExpiresAt : ${new Date(Number(domain.expiresAt) * 1000).toISOString()}`);
  });

task("task:buy", "Buy a domain for N durationinyears")
  .addParam("name", "The domain name (without .zama)")
  .addParam("durationinyears", "Number of years to register")
  .addOptionalParam("address", "Optionally specify the ZamaDomainRegistry address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const durationinyears = parseInt(taskArguments.durationinyears);
    if (!Number.isInteger(durationinyears) || durationinyears < 1) {
      throw new Error(`--durationinyears must be >= 1 integer`);
    }

    const deployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("ZamaDomainRegistry");

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("ZamaDomainRegistry", deployment.address);

    // 0.001 ETH per year
    const pricePerYear = ethers.parseEther("0.001");
    const totalCost = pricePerYear * BigInt(durationinyears);

    console.log(
      `Buying domain "${taskArguments.name}.zama" for ${durationinyears} durationinyears, cost = ${ethers.formatEther(totalCost)} ETH`,
    );

    const tx = await contract.connect(signer).buyDomain(taskArguments.name, durationinyears, { value: totalCost });
    console.log(`Tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Tx confirmed. Status = ${receipt?.status}`);
  });

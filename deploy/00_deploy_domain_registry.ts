import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedRegistry = await deploy("ZamaDomainRegistry", {
    from: deployer,
    log: true,
  });

  console.log(`ZamaDomainRegistry contract deployed at:`, deployedRegistry.address);
};

export default func;

// prevent re-execution
func.id = "deploy_zamaDomainRegistry";
func.tags = ["ZamaDomainRegistry"];

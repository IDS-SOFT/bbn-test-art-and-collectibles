
import { ethers } from "hardhat";

const name = "Shakuntala by Raja Ravi Verma";
const description = 
"One of Raja Ravi Varma's most famous art pieces is Shakuntala depicting the legendary character from Mahabharata."; 

const price = 100000000;

async function main() {

  const deploy_contract = await ethers.deployContract("ArtCollectibleContract", [name, description, price]);

  await deploy_contract.waitForDeployment();

  console.log("ArtCollectibleContract is deployed to : ",await deploy_contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

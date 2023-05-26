// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  TokenErc20 = await ethers.getContractFactory("erc20");

  tokenErc20 = await tokenErc20.deploy();

  TokenErc721 = await ethers.getContractFactory("nft");

  tokenErc721 = await TokenErc721.deploy();


  Main = await ethers.getContractFactory("NFTstaker");


  main = await Main.deploy(tokenErc20.address, tokenErc721.address);


  console.log("Contract deployed to address:", main.address);



  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = hre.ethers.utils.parseEther("0.001");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

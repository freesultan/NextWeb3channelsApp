// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const tokens = (n) => {
  return hre.ethers.parseUnits(n.toString(), "ether");
};
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const NAME = "channels";
  const SYMBOL = "CH";

  const ChannelsContract = await hre.ethers.getContractFactory(
    "ChannelsContract"
  );
  const channelContract = await ChannelsContract.deploy(NAME, SYMBOL);
 await channelContract.waitForDeployment();
  console.log("ChannelsContract deployed at " + channelContract.address);

  // Create 3 Channels
  const CHANNEL_NAMES = ["general", "intro", "jobs"];
  const COSTS = [tokens(1), tokens(0), tokens(0.25)];

  for (var i = 0; i < 3; i++) {
    const transaction = await channelContract
      .connect(deployer)
      .createChannel(CHANNEL_NAMES[i], COSTS[i]);
    await transaction.wait();

    console.log(`Created text channel #${CHANNEL_NAMES[i]}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { expect } = require("chai");

describe("Channesl", () => {
  let deployer, user, channelsContract;
  const NAME = "ChannelsApp";
  const SYMBOL = "CA";

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    //deploy contract
    const ChannelsContract = new ethers.getContractFactory("ChannelsContract");
    channelsContract = await ChannelsContract.deploy(NAME, SYMBOL);
    console.log("ChannelsContract deployed");

    const transaction = await channelsContract
      .connect(deployer)
      .createChannel("general channel");
    await transaction.wait();
    console.log("channel created");
  });
});

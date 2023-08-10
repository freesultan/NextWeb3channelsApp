const Channels = ({
  provider,
  account,
  channelContract,
  channels,
  currentChannel,
  setCurrentChannel,
}) => {
  const channelHandler = async (channel) => {
    
    if (!account){
        alert('please conncet your account')
        return
    }
    console.log('account: ' + JSON.stringify(account));

    const hasJoiend = await channelContract.hasJoined(channel.id, account);

    if (hasJoiend) {
      setCurrentChannel(channel);
    } else {
      console.log("not joined");
      const signer = await provider.getSigner();
      console.log('signer: ' + await signer.getAddress());
      const tx = await channelContract.connect(signer).mint(channel.id, { value: channel.cost})
      await tx.wait();
      setCurrentChannel(channel);

    }
  };

  return (
    <div className="w-full border sm:w-1/4  md:w-1/6">
      <h2 className="font-bold bg-gradient-to-bl from-slate-800 to-slate-200 text-center py-6 border-b-4 mb-2">
        Channels
      </h2>

      <ul>
        {channels.map((channel, index) => (
          <li
            className={
              currentChannel &&
              currentChannel.id.toString() === channel.id.toString()
                ? "font-bold bg-slate-900 text-slate-200 text-center rounded-r-3xl border py-4 hover:cursor-pointer hover:text-slate-300 hover:bg-green-950"
                : " text-center rounded-r-3xl border py-4 hover:cursor-pointer hover:text-slate-300 hover:bg-green-950"
            }
            key={index}
            
            onClick={() => channelHandler(channel)}
          >
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Channels;

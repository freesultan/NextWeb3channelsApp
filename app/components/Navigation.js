import { ethers } from "ethers";

const Navigation = ({ account, setAccount }) => {
  async function clickHandler() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        const account = accounts[0];
        console.log("account> " + account);
        setAccount(account);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Ethereum is not available in the browser");
    }
  }
  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-green-200 to-emerald-500  px-4 py-2  border-b-4  border-blue-950">
      <h1 className="text-xl font-bold "> Channels application</h1>
      {account ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          type="button"
        >
          logged in as {account.slice(0, 4) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          type="button"
          onClick={clickHandler}
        >
          connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;

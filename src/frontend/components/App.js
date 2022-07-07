import { useState, useEffect } from "react";
import { ethers } from "ethers";
import logo from "./logo.png";
import "./App.css";
import LandAddress from "../contractsData/Land-address.json";
import LandAbi from "../contractsData/Land.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [landContract, setLandContract] = useState(null);
  const [cost, setCost] = useState(null);
  const [buildings, setBuildings] = useState(null);

  useEffect(() => {
    web3Handler();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const web3Handler = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      loadBlockChainData(signer);
    }
  };

  const loadBlockChainData = async (signer) => {
    const landContract = new ethers.Contract(
      LandAddress.address,
      LandAbi.abi,
      signer
    );
    setLandContract(landContract);

    setCost(await landContract.cost());

    setBuildings(await landContract.getBuildings());

    setLoading(false);
  };

  return <div>Virtual land</div>;
}

export default App;

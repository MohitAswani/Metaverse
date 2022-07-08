import { Suspense, useState, useEffect } from "react";

import { ethers } from "ethers";
import "./App.css";
import LandAddress from "../contractsData/Land-address.json";
import LandAbi from "../contractsData/Land.json";

import { Canvas } from "@react-three/fiber";
import { Sky, MapControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";

import Navbar from "../components/Navbar";
import Plane from "../components/Plane";
import Plot from "../components/Plot";
import Building from "../components/Building";

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

function App() {
  const [account, setAccount] = useState(null);
  const [landContract, setLandContract] = useState(null);
  const [cost, setCost] = useState(null);
  const [buildings, setBuildings] = useState(null);

  // BUILDING PROPS
  const [landId, setLandId] = useState(null);
  const [landName, setLandName] = useState(null);
  const [landOwner, setLandOwner] = useState(null);
  const [hasOwner, setHasOwner] = useState(false);

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

    setCost(fromWei(await landContract.cost()));

    setBuildings(await landContract.getBuildings());
  };

  const buyHandler = async (_id) => {
    try {
      await (
        await landContract.mint(_id, { from: account, value: toWei(cost) })
      ).wait();

      const updatedBuildings = await landContract.getBuildings();
      setBuildings(updatedBuildings);

      setLandName(updatedBuildings[_id - 1].name);
      setLandOwner(updatedBuildings[_id - 1].owner);
      setHasOwner(true);
    } catch (error) {
      console.log(error);
      window.alert("Error occured while buying");
    }
  };

  // We import canvas which is from the threejs library.

  return (
    <div>
      <Navbar web3Handler={web3Handler} account={account} />
      <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
        <Suspense fallback={null}>
          <Sky
            distance={450000}
            sunPosition={[1, 10, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <ambientLight intensity={0.5} />

          <Physics>
            {buildings &&
              buildings.map((building, index) => {
                if (
                  building.owner ===
                  "0x0000000000000000000000000000000000000000"
                ) {
                  return (
                    <Plot
                      key={index}
                      position={[building.posX, building.posY, 0.1]}
                      size={[building.sizeX, building.sizeY]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setHasOwner={setHasOwner}
                      setLandId={setLandId}
                    ></Plot>
                  );
                } else {
                  return (
                    <Building
                      key={index}
                      position={[building.posX, building.posY, 0.1]}
                      size={[building.sizeX, building.sizeY, building.sizeZ]}
                      landId={index + 1}
                      landInfo={building}
                      setLandName={setLandName}
                      setLandOwner={setLandOwner}
                      setHasOwner={setHasOwner}
                      setLandId={setLandId}
                    ></Building>
                  );
                }
              })}

            <Plane />
          </Physics>
        </Suspense>
        <MapControls />
      </Canvas>

      {landId && (
        <div className="info">
          <h1 className="flex">{landName}</h1>

          <div className="flex-left">
            <div className="info--id">
              <h2>ID</h2>
              <p>{landId}</p>
            </div>

            <div className="info--owner">
              <h2>Owner</h2>
              <p>{landOwner}</p>
            </div>

            {!hasOwner && (
              <div className="info--owner">
                <h2>Cost</h2>
                <p>{`${cost} ETH`}</p>
              </div>
            )}
          </div>

          {!hasOwner && (
            <button
              onClick={() => buyHandler(landId)}
              className="button info--buy"
            >
              Buy Property
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

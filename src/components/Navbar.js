import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import fullLogo from "../full_logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar({ loading, setLoading }) {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function connectWebsite() {
    setLoading(true);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0xaa36a7") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        getAddress();
        window.location.replace(location.pathname);
      });

    setLoading(false);
  }

  useEffect(() => {
    if (window.ethereum == undefined) return;
    let val = window.ethereum.isConnected();
    if (val) {
      getAddress();
      toggleConnect(val);
      console.log(typeof setLoading);
      console.log(setLoading);
      setLoading(false);
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  }, []);

  return (
    <div>
      <nav className="w-full flex">
        <ul className="flex flex-1 text-gray-900 items-center justify-between px-20 py-10">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <img
                src={fullLogo}
                alt=""
                width={75}
                height={75}
                className="inline-block -mt-2"
              />
              <div className="inline-block font-bold text-xl ml-2">
                NFT Marketplace
              </div>
            </Link>
          </li>
          {location.pathname === "/" ? (
            <li className="border-b-2 hover:pb-0 p-2">
              <Link to="/">Marketplace</Link>
            </li>
          ) : (
            <li className="hover:border-b-2 hover:pb-0 p-2">
              <Link to="/">Marketplace</Link>
            </li>
          )}
          {location.pathname === "/sellNFT" ? (
            <li className="border-b-2 hover:pb-0 p-2">
              <Link to="/sellNFT">List My NFT</Link>
            </li>
          ) : (
            <li className="hover:border-b-2 hover:pb-0 p-2">
              <Link to="/sellNFT">List My NFT</Link>
            </li>
          )}
          {location.pathname === "/profile" ? (
            <li className="border-b-2 hover:pb-0 p-2">
              <Link to="/profile">Profile</Link>
            </li>
          ) : (
            <li className="hover:border-b-2 hover:pb-0 p-2">
              <Link to="/profile">Profile</Link>
            </li>
          )}
          <li>
            <button
              className={classNames(
                connected
                  ? "bg-green-600  hover:bg-green:400"
                  : "bg-blue-600  hover:bg-blue:400",
                "block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:text-gray-300"
              )}
              onClick={connectWebsite}
              disabled={loading || connected}
            >
              {loading ? "Loading" : connected ? "Connected" : "Connect Wallet"}
            </button>
          </li>
        </ul>
      </nav>
      <div className="text-dark text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view NFTs"}{" "}
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </div>
  );
}

export default Navbar;

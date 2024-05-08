import { useEffect, useState } from "react";
import { getNFTData } from "../services/nftService";
import NFTTile from "./NFTTile";
import Spinner from "./Spinner";

export default function Profile() {
  const [data, updateData] = useState([]);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNFTData()
      .then((res) => {
        const { items, addr, sumPrice } = res;
        updateData(items);
        updateAddress(addr);
        updateTotalPrice(sumPrice);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="profileClass" style={{ minHeight: "100vh" }}>
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-dark">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-dark">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Your NFTs
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((value, index) => (
            <NFTTile data={value} key={index} />
          ))}
        </div>
        <div className="mt-10 text-xl">
          {data.length == 0
            ? "Oops, No NFT data to display (Are you logged in?)"
            : ""}
        </div>
      </div>
    </div>
  );
}

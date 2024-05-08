import { useEffect, useState } from "react";
import { getAllNFTs } from "../services/nftService";
import NFTTile from "./NFTTile";
import Spinner from "./Spinner";

export default function Marketplace() {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllNFTs()
      .then((nfts) => {
        updateData(nfts);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          NFTs Available
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((value, index) => (
            <NFTTile data={value} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

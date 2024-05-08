import { Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <div key={data.data.tokenId} className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={IPFSUrl}
          alt=""
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={newTo}>
              <span aria-hidden="true" className="absolute inset-0" />
              {data.data.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{data.data.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{data.data.price} ETH</p>
      </div>
    </div>
  );
}

export default NFTTile;

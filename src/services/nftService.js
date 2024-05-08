import axios from "axios";
import MarketplaceJSON from "../Marketplace.json";
import { uploadJSONToIPFS } from "../pinata";
import { GetIpfsUrlFromPinata } from "../utils";

async function getAllNFTs() {
  const ethers = require("ethers");
  //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  //Pull the deployed contract instance
  let contract = new ethers.Contract(
    MarketplaceJSON.address,
    MarketplaceJSON.abi,
    signer
  );
  //create an NFT Token
  let transaction = await contract.getAllNFTs();

  //Fetch all the details of every NFT from the contract and display
  const items = await Promise.all(
    transaction.map(async (i) => {
      var tokenURI = await contract.tokenURI(i.tokenId);

      tokenURI = GetIpfsUrlFromPinata(tokenURI);
      let meta = await axios.get(tokenURI);
      meta = meta.data;

      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      return item;
    })
  );

  return items;
}

async function getNFTData() {
  const ethers = require("ethers");
  let sumPrice = 0;
  //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();

  //Pull the deployed contract instance
  let contract = new ethers.Contract(
    MarketplaceJSON.address,
    MarketplaceJSON.abi,
    signer
  );

  //create an NFT Token
  let transaction = await contract.getMyNFTs();

  /*
   * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
   * and creates an object of information that is to be displayed
   */

  const items = await Promise.all(
    transaction.map(async (i) => {
      const tokenURI = await contract.tokenURI(i.tokenId);
      let meta = await axios.get(tokenURI);
      meta = meta.data;

      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      sumPrice += Number(price);
      return item;
    })
  );

  return {
    items: items,
    addr: addr,
    sumPrice: sumPrice.toPrecision(3),
  };
}

//This function uploads the metadata to IPFS
async function uploadMetadataToIPFS(name, description, price, fileURL) {
  //Make sure that none of the fields are empty
  if (!name || !description || !price || !fileURL) {
    throw new Error("Please fill all the fields!");
  }

  const nftJSON = {
    name,
    description,
    price,
    image: fileURL,
  };

  try {
    //upload the metadata JSON to IPFS
    const response = await uploadJSONToIPFS(nftJSON);
    if (response.success === true) {
      return response.pinataURL;
    }
  } catch (e) {
    throw new Error("error uploading JSON metadata:", e);
  }
}

async function listNFT(name, description, price, fileURL) {
  const ethers = require("ethers");

  //Upload data to IPFS
  const metadataURL = await uploadMetadataToIPFS(
    name,
    description,
    price,
    fileURL
  );
  if (metadataURL === -1) return;
  //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  //Pull the deployed contract instance
  let contract = new ethers.Contract(
    MarketplaceJSON.address,
    MarketplaceJSON.abi,
    signer
  );

  //massage the params to be sent to the create NFT request
  const parsedPrice = ethers.utils.parseUnits(price, "ether");
  let listingPrice = await contract.getListPrice();
  listingPrice = listingPrice.toString();

  //actually create the NFT
  let transaction = await contract.createToken(metadataURL, parsedPrice, {
    value: listingPrice,
  });
  await transaction.wait();

  return transaction.address;
}

export { getAllNFTs, getNFTData, listNFT };

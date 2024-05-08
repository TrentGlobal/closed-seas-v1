import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Marketplace from "./components/Marketplace";
import Navbar from "./components/Navbar";
import NFTPage from "./components/NFTpage";
import Profile from "./components/Profile";
import SellNFT from "./components/SellNFT";

function App() {
  const [loading, setLoading] = useState(false);

  console.log(typeof setLoading)
  console.log(setLoading)

  return (
    <div className="w-screen flex justify-center">
      <div className="container">
        <header>
          <Navbar loading={loading} setLoading={setLoading} />
        </header>
        <main>
          {loading ? (
            "Loading ..."
          ) : (
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/nftPage/:tokenId" element={<NFTPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sellNFT" element={<SellNFT />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

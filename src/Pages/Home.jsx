import React, { useEffect, useState } from "react";
import { Panel } from "rsuite";
import home from "../Assets/Home.png"
import { getBlockchain } from "../Components/Blockchain";
import { toast } from "react-toastify";

const Home = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchaddress = async () => {
      try {
        const { signer } = await getBlockchain();
        setAddress(signer.address);
      } catch (error) {
        console.error("Error fetching:", error);
        toast.error("Failed to fetch.");
      }
    }
    fetchaddress();
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setAddress("");
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <Panel bordered style={{ marginTop: "2vh" }}>
      <h3 style={{ marginBottom: "2.5vh", textAlign: "right", paddingRight: "0.5%", fontWeight: "normal" }}>
        Wallet: {address ? address : ""}
      </h3>
      <img
        src={home}
        alt="Future of Freelance"
        style={{ width: "100%", height: "auto" }}
      />
    </Panel>
  );
};

export default Home;
import { ethers } from "ethers";
import GigEconomyABI from "./GigEconomy.json";

const CONTRACT_ADDRESS = "0xF4e78c66db6C1E72cDf0B3c68254C08dB2198d6a";

export const getBlockchain = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
    }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            GigEconomyABI.abi,
            signer
        );
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name, network.chainId);
        return { contract, signer };
    } catch (error) {
        console.error("Error connecting to blockchain:", error);
        throw error;
    }
};
import { ethers } from "ethers";
import GigEconomyABI from "./GigEconomy.json";

const CONTRACT_ADDRESS = "0x93D46a02B7E4b84062609067CA2Cad5D8345f863";

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
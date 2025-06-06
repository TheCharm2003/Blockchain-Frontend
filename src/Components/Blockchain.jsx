import { ethers } from "ethers";
import GigEconomyABI from "./GigEconomy.json";

const CONTRACT_ADDRESS = "0x53F3AA0f66952ae409e27399703160d7a5789efe";

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
        return { contract, signer };
    } catch (error) {
        console.error("Error connecting to blockchain:", error);
        throw error;
    }
};

export const simulateCall = async (contract, methodName, args) => {
    const callData = contract.interface.encodeFunctionData(methodName, args);
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
        await provider.call({ to: contract, data: callData });
    } catch (error) {
        if (error.data) {
            const data = "0x" + error.data.slice(10);
            const decodedReason = ethers.AbiCoder.defaultAbiCoder().decode(
                ["string"],
                ethers.getBytes(data)
            );
            throw new Error(decodedReason[0]);
        } else {
            throw new Error("Unknown Error");
        }
    }
};
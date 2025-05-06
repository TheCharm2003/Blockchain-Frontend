import React, { useState, useEffect } from "react";
import { Button, Form, Panel, Radio, RadioGroup, Col, Divider } from "rsuite";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";

const JobApplication = () => {
    const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;
    const [rating, setRating] = useState();
    const [jobId, setJobId] = useState("");
    const [role, setRole] = useState("worker");
    const [srole, setSRole] = useState();
    const [loading, setLoading] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [address, setAddress] = useState();
    const [statsrating, setStatRating] = useState();
    const [tasks, setTask] = useState();
    const [pressed, setPressed] = useState();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { contract } = await getBlockchain();
                const jobCount = Number(await contract.jobCounter());
                const jobPromises = [];
                for (let i = 1; i < jobCount; i++) {
                    jobPromises.push(contract.getJob(i));
                }
                const jobData = await Promise.all(jobPromises);
                console.log(jobData);
                const formattedJobs = jobData.map((job, index) => ({
                    id: index + 1,
                    client: job[0],
                    worker: job[1],
                    description: job[2],
                    payment: ethers.formatEther(job[3]),
                    isCompleted: job[4],
                    isPaid: job[5],
                    disputeRaised: job[6],
                    cilentRated: job[7],
                    workedRated: job[8],
                }));
                setJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Failed to fetch jobs.");
            }
        };
        fetchJobs();
    }, []);

    const stats = async () => {
        if (!srole) {
            toast.error("Please Select Role.");
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.getWorkerStats(address);
            setPressed(true);
            setStatRating(tx.averageRating);
            setTask(tx.completedJobs);
        } catch (error) {
            toast.error(`Transaction failed: ${error.reason}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel
            bordered
            shaded
            style={{
                margin: "auto",
                marginTop: "2vh",
                width: "100%",
                height: "48vh",
            }}
        >
            
        </Panel>
    );
};

export default JobApplication;
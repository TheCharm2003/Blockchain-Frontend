import React, { useState, useEffect } from "react";
import { Button, Form, Panel, Table } from "rsuite";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";
const { Column, HeaderCell, Cell } = Table;


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
                const formattedJobs = jobData.map((job, index) => {
                    const nestedData = Array.isArray(job[9]) ? job[9] : [];
                    return {
                        id: index + 1,
                        client: job[0],
                        worker: job[1],
                        description: job[2],
                        payment: ethers.formatEther(job[3]),
                        isCompleted: job[4],
                        isPaid: job[5],
                        disputeRaised: job[6],
                        clientRated: job[7],
                        workerRated: job[8],
                        applicants: nestedData.map(addr => addr.toString())
                    };
                });
                console.log(formattedJobs);
                setJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Failed to fetch jobs.");
            }
        };
        fetchJobs();
    }, []);

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
            <Table
                data={jobs}
                autoHeight
                bordered
                cellBordered
                hover
            >
                <Column width={50} align="center">
                    <HeaderCell>ID</HeaderCell>
                    <Cell>{(rowData) => rowData.id}</Cell>
                </Column>
                <Column width={380}>
                    <HeaderCell>Worker</HeaderCell>
                    <Cell>{(rowData) => rowData.worker}</Cell>
                </Column>
                <Column width={300} className="wrap-column">
                    <HeaderCell>Description</HeaderCell>
                    <Cell>{(rowData) => rowData.description}</Cell>
                </Column>
                <Column width={100} align="center">
                    <HeaderCell>Payment (ETH)</HeaderCell>
                    <Cell>{(rowData) => rowData.payment}</Cell>
                </Column>
                <Column width={90}>
                    <HeaderCell>Completed</HeaderCell>
                    <Cell>{(rowData) => (rowData.isCompleted ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={90}>
                    <HeaderCell>Paid</HeaderCell>
                    <Cell>{(rowData) => (rowData.isPaid ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={90}>
                    <HeaderCell>Disputed</HeaderCell>
                    <Cell>{(rowData) => (rowData.disputeRaised ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={380} className="wrap-column">
                    <HeaderCell>Applicants</HeaderCell>
                    <Cell>
                        {(rowData) => rowData.applicants?.join(', ') || 'N/A'}
                    </Cell>
                </Column>

            </Table>
        </Panel>
    );
};

export default JobApplication;
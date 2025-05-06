import React, { useState, useEffect } from "react";
import { Panel, Table } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";
import { ethers } from "ethers";
const { Column, HeaderCell, Cell } = Table;

const JobListings = () => {
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

    return (
        <Panel
            bordered
            shaded
            style={{
                margin: "auto",
                marginTop: "2vh",
                width: '100%',
                height: 'auto'
            }}
        >
            <h3 style={{ marginBottom: "2.5vh" }}>Job Listings</h3>
            <Table 
            data={jobs} 
            autoHeight 
            bordered
            cellBordered
            hover
            wordWrap='keep-all'
            >
                <Column width={50} align="center">
                    <HeaderCell>ID</HeaderCell>
                    <Cell>{(rowData) => rowData.id}</Cell>
                </Column>
                <Column width={400}>
                    <HeaderCell>Client</HeaderCell>
                    <Cell>{(rowData) => rowData.client}</Cell>
                </Column>
                <Column width={400}>
                    <HeaderCell>Worker</HeaderCell>
                    <Cell>{(rowData) => rowData.worker}</Cell>
                </Column>
                <Column width={260}>
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
            </Table>
        </Panel>
    );
};

export default JobListings;
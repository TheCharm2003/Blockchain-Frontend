import React, { useState, useEffect } from "react";
import { Button, Form, Panel, Table } from "rsuite";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";
const { Column, HeaderCell, Cell } = Table;


const JobApplication = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { signer, contract } = await getBlockchain();
                const address = signer.address;
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
                        applicants: nestedData.map(addr => addr.toString()),
                        workername: job[10] ? job[10] : "Not Assigned",
                    };
                });
                if (formattedJobs.length > 0) {
                    const finalJobs = formattedJobs.filter(job => job.client === address);
                    setJobs(finalJobs);
                }
            } catch (error) {
                console.error("Error fetching:", error);
                toast.error("Failed to fetch.");
            }
        }
        fetchData();

        const handleAccountsChanged = (accounts) => {
            fetchData();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
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
                wordWrap='keep-all'
            >
                <Column width={50} align="center">
                    <HeaderCell>ID</HeaderCell>
                    <Cell>{(rowData) => rowData.id}</Cell>
                </Column>
                <Column width={380}>
                    <HeaderCell>Worker Name</HeaderCell>
                    <Cell>{(rowData) => rowData.worker}</Cell>
                </Column>
                <Column width={100}>
                    <HeaderCell>Worker Name</HeaderCell>
                    <Cell>{(rowData) => rowData.workername}</Cell>
                </Column>
                <Column width={250}>
                    <HeaderCell>Description</HeaderCell>
                    <Cell>{(rowData) => rowData.description}</Cell>
                </Column>
                <Column width={100} align="center">
                    <HeaderCell>Payment (ETH)</HeaderCell>
                    <Cell>{(rowData) => rowData.payment}</Cell>
                </Column>
                <Column width={80}>
                    <HeaderCell>Completed</HeaderCell>
                    <Cell>{(rowData) => (rowData.isCompleted ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={70}>
                    <HeaderCell>Paid</HeaderCell>
                    <Cell>{(rowData) => (rowData.isPaid ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={70}>
                    <HeaderCell>Disputed</HeaderCell>
                    <Cell>{(rowData) => (rowData.disputeRaised ? 'Yes' : 'No')}</Cell>
                </Column>
                <Column width={380}>
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
import React, { useState, useEffect } from "react";
import { Button, Form, Panel, Table, toaster, Message } from "rsuite";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getBlockchain, simulateCall } from "../Components/Blockchain";
const { Column, HeaderCell, Cell } = Table;


const JobApplication = () => {
    const [jobs, setJobs] = useState([]);
    const [jobId, setJobId] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const assignJob = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            await simulateCall(contract, "selectWorker", [jobId, address]);
            const tx = await contract.selectWorker(jobId, address);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable>
                    Job Assigned Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setJobId("");
            setAddress("");
        } catch (error) {
            toaster.push(
                <Message showIcon type="success" closable>
                    Payment Released Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
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
                height: 'auto'
            }}
        >
            <h3 style={{ marginBottom: "2.5vh" }}>Assign Job</h3>
            <Form layout="inline">
                <Form.Group>
                    <Form.ControlLabel>Job ID</Form.ControlLabel>
                    <Form.Control
                        name="jobId"
                        type="number"
                        value={jobId}
                        onChange={(value) => setJobId(value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.ControlLabel>Worker Address</Form.ControlLabel>
                    <Form.Control
                        name="address"
                        value={address}
                        onChange={(value) => setAddress(value)}
                    />
                </Form.Group>

                <Button
                    appearance="primary"
                    onClick={assignJob}
                    disabled={loading}
                >
                    {loading ? "Assigning..." : "Assign Job"}
                </Button>
            </Form>

            <h3 style={{ marginBottom: "2.5vh" }}>Job Posted</h3>
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
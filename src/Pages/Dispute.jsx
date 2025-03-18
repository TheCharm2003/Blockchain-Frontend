import React, { useState } from "react";
import { Button, Form, Panel } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";

const Dispute = () => {
    const [disputeRaised, setDisputeRaised] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disputeloading, setDisputeLoading] = useState(false);
    const [resloading, setResLoading] = useState(false);
    const [jobId, setJobId] = useState("");

    const checkDisputeStatus = async () => {
        if (!jobId) {
            toast.error("Please enter a Job ID.");
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const job = await contract.getJob(jobId);
            setDisputeRaised(job.disputeRaised);
            setPressed(true);
        } catch (error) {
            toast.error("Error fetching job details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const raiseDispute = async () => {
        if (!jobId) {
            toast.error("Please enter a Job ID.");
            return;
        }
        setDisputeLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.raiseDispute(jobId);
            await tx.wait();
            toast.success("Dispute raised successfully!");
        } catch (error) {
            if (error.reason) {
                toast.error(`Error: ${error.reason}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        } finally {
            setDisputeLoading(false);
        }
    };

    const resolveDispute = async () => {
        if (!jobId) {
            toast.error("Please enter a Job ID.");
            return;
        }
        setResLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.resolveDispute(jobId);
            await tx.wait();
            toast.success("Dispute resolved successfully!");
        } catch (error) {
            if (error.reason) {
                toast.error(`Error: ${error.reason}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        } finally {
            setResLoading(false);
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
                height: "50vh",
            }}
        >
            <h3 style={{ marginBottom: "2.5vh" }}>Dispute Management</h3>
            <Form>
                <Form.Group style={{ marginBottom: "2vh" }}>
                    <Form.ControlLabel>Job ID</Form.ControlLabel>
                    <Form.Control name="jobId" value={jobId} onChange={(value) => setJobId(value)} />
                </Form.Group>
                <Form.Group style={{ marginBottom: "2vh" }}>
                    <Form.ControlLabel>
                        Dispute Status: {pressed ? (disputeRaised ? "Dispute Raised" : "No Dispute") : ""}
                    </Form.ControlLabel>
                </Form.Group>
                <Button
                    appearance="primary"
                    onClick={checkDisputeStatus}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check Status"}
                </Button>
                {!disputeRaised && pressed && (
                    <Button
                        appearance="primary"
                        onClick={raiseDispute}
                        style={{ marginLeft: '1%' }}
                        disabled={disputeloading}
                    >
                        {disputeloading ? "Raising..." : "Raise Dispute"}
                    </Button>
                )}
                {disputeRaised && pressed && (
                    <Button
                        appearance="primary"
                        onClick={resolveDispute}
                        style={{ marginLeft: '1%' }}
                        disabled={resloading}
                    >
                        {resloading ? "Resolving..." : "Resolve Dispute"}
                    </Button>
                )}
            </Form>
        </Panel>
    );
};

export default Dispute;
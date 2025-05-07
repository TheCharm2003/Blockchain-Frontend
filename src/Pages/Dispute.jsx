import React, { useState } from "react";
import { Button, Form, Panel, toaster, Message } from "rsuite";
import { getBlockchain } from "../Components/Blockchain";

const Dispute = () => {
    const [disputeRaised, setDisputeRaised] = useState(false);
    const [paid, setPaid] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disputeloading, setDisputeLoading] = useState(false);
    const [resloading, setResLoading] = useState(false);
    const [jobId, setJobId] = useState("");

    const checkDisputeStatus = async () => {
        if (!jobId) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Fill Job ID.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const job = await contract.getJob(jobId);
            setPaid(job[5]);
            setDisputeRaised(job[6]);
            setPressed(true);
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Failed to Fetch Job.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const raiseDispute = async () => {
        if (!jobId) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Fill Job ID.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
        }
        setDisputeLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.raiseDispute(jobId);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable>
                    Dispute Raised Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            checkDisputeStatus();
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Failed to Raise Dispute.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
        } finally {
            setDisputeLoading(false);
        }
    };

    const resolveDispute = async () => {
        if (!jobId) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Fill Job ID.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setResLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.resolveDispute(jobId);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable>
                    Dispute Resolved Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Failed to Reslove Dispute. Only Owner Function.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            checkDisputeStatus();
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
                height: 'auto'
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
                        Dispute Status: {
                            disputeRaised
                                ? (paid ? "Dispute Resolved" : "Dispute Raised")
                                : (paid ? "Payment Released" : "Not Disputed")
                        }
                    </Form.ControlLabel>
                </Form.Group>
                <Button
                    appearance="primary"
                    onClick={checkDisputeStatus}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check Status"}
                </Button>
                {!paid && !disputeRaised && pressed && (
                    <Button
                        appearance="primary"
                        onClick={raiseDispute}
                        style={{ marginLeft: '1%' }}
                        disabled={disputeloading}
                    >
                        {disputeloading ? "Raising..." : "Raise Dispute"}
                    </Button>
                )}

                {disputeRaised && !paid && pressed && (
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
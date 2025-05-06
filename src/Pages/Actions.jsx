import React, { useState } from "react";
import { Button, Form, Col, Panel, Divider } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";

const Actions = () => {
    const [accjobId, setAccJobId] = useState("");
    const [comjobId, setComJobId] = useState("");
    const [comloading, setComLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const applyJob = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.applyForJob(accjobId);
            await tx.wait();
            toast.success("Job Applied!");
            setAccJobId("");
        } catch (error) {
            if (error.reason) {
                toast.error(`Transaction failed: ${error.reason}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const completeJob = async () => {
        setComLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.completeJob(comjobId);
            await tx.wait();
            toast.success("Job Marked as Completed!");
            setComJobId("");
        } catch (error) {
            if (error.reason) {
                toast.error(`Transaction failed: ${error.reason}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        } finally {
            setComLoading(false);
        }
    };

    return (
        <Panel
            bordered
            shaded
            style={{
                margin: "auto",
                marginTop: "2vh",
                width: '100%',
                height: '33vh'
            }}
        >
            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Job</h3>
                <Form>
                    <Form.Group>
                        <Form.ControlLabel>ID</Form.ControlLabel>
                        <Form.Control
                            name="accjobId"
                            type="number"
                            value={accjobId}
                            onChange={(value) => setAccJobId(value)}
                        />
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={applyJob}
                        disabled={loading}
                    >
                        {loading ? "Applying..." : "Apply for Job"}
                    </Button>
                </Form>
            </Col>
            <Col style={{ width: '2%' }}>
                <Divider vertical
                    style={{ backgroundColor: "black", minHeight: "28.5vh", width: "0.84px" }} />
            </Col>
            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Job Completed</h3>
                <Form>
                    <Form.Group>
                        <Form.ControlLabel>ID</Form.ControlLabel>
                        <Form.Control
                            name="comjobId"
                            type="number"
                            value={comjobId}
                            onChange={(value) => setComJobId(value)}
                        />
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={completeJob}
                        disabled={comloading}
                    >
                        {comloading ? "Completing..." : "Mark Completed"}
                    </Button>
                </Form>
            </Col>
        </Panel>
    );
};

export default Actions;
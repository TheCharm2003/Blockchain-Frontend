import React, { useState } from "react";
import { Button, Form, Col, Panel, Divider, toaster, Message } from "rsuite";
import { getBlockchain, simulateCall } from "../Components/Blockchain";

const Actions = () => {
    const [accjobId, setAccJobId] = useState("");
    const [comjobId, setComJobId] = useState("");
    const [comloading, setComLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const applyJob = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            if (!accjobId) {
                toaster.push(
                    <Message showIcon type="error" closable>
                        Fill the Job ID.
                    </Message>,
                    { placement: 'topCenter', duration: 8000 }
                );
                return;
            }
            const tx = await contract.applyForJob(accjobId);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable>
                    Job Applied!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setAccJobId("");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Transaction Failed.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const completeJob = async () => {
        setComLoading(true);
        try {
            const { contract } = await getBlockchain();
            if (!comjobId) {
                toaster.push(
                    <Message showIcon type="error" closable>
                        Fill the Job ID.
                    </Message>,
                    { placement: 'topCenter', duration: 8000 }
                );
                return;
            }
            const tx = await contract.completeJob(comjobId);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable>
                    Job Marked as Completed!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setComJobId("");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Cannot Be Marked Completed.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
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
                height: 'auto',
                padding: "1%"
            }}
        >
            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Job Application</h3>
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
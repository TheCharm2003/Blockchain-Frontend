import React, { useState } from "react";
import { Button, Form, Panel, Rate, Radio, RadioGroup, Col, Divider, toaster, Message } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain, simulateCall } from "../Components/Blockchain";

const Rating = () => {
    const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;
    const [rating, setRating] = useState('');
    const [jobId, setJobId] = useState("");
    const [role, setRole] = useState("worker");
    const [srole, setSRole] = useState("worker");
    const [loading, setLoading] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [statsrating, setStatRating] = useState('');
    const [tasks, setTask] = useState('');
    const [pressed, setPressed] = useState('');

    const handleRateClient = async () => {
        if (!jobId || !rating) {
            toaster.push(
                <Message showIcon type="error" closable >
                    Please fill in all fields.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setRatingLoading(true);
        try {
            const { contract } = await getBlockchain();
            await simulateCall(contract, "rateClient", [rating, jobId]);
            const tx = await contract.rateClient(
                rating,
                jobId
            );
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable >
                    Client rated successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setRating("");
            setJobId("");
            setRole("worker");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    {error.message}
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setRatingLoading(false);
        }
    };

    const handleRateWorker = async () => {
        if (!jobId || !rating) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Please fill in all fields.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setRatingLoading(true);
        try {
            const { contract } = await getBlockchain();
            await simulateCall(contract, "rateWorker", [rating, jobId]);
            const tx = await contract.rateWorker(
                rating,
                jobId
            );
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable >
                    Worker rated successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setRating("");
            setJobId("");
            setRole("worker");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    {error.message}
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setRatingLoading(false);
        }
    };

    const clientstats = async () => {
        if (!address || !srole) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Please fill in all fields.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.getClientStats(address);
            setPressed(true);
            setStatRating(tx.averageRating);
        } catch (error) {
            toast.error(`Transaction failed: ${error.reason}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const workerstats = async () => {
        if (!address || !srole) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Please fill in all fields.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.getWorkerStats(address);
            setPressed(true);
            setStatRating(tx[0]);
            setTask(tx[1]);
        } catch (error) {
            if (!jobId || !rating) {
                toaster.push(
                    <Message showIcon type="error" closable>
                        Failed to Fetch.
                    </Message>,
                    { placement: 'topCenter', duration: 8000 }
                );
                return;
            }
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
            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Rate Job</h3>
                <Form>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Job ID</Form.ControlLabel>
                        <Form.Control name="jobId" value={jobId} onChange={(value) => setJobId(value)} />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Rating</Form.ControlLabel>
                        <Form.Control
                            name="rating"
                            value={rating}
                            onChange={(value) => setRating(value)}
                            accepter={Rate}
                        />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <RadioGroup name="radio-group-inline-picker-label" inline appearance="picker" value={role} onChange={setRole}>
                            <RadioLabel>Role: </RadioLabel>
                            <Radio value="worker">Worker</Radio>
                            <Radio value="client">Client</Radio>
                        </RadioGroup>
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={role === "client" ? handleRateClient : handleRateWorker}
                        disabled={ratingLoading}
                    >
                        {ratingLoading ? "Rating..." : `Rate ${role === "client" ? "Client" : "Worker"}`}
                    </Button>
                </Form>
            </Col>
            <Col style={{ width: '2%' }}>
                <Divider vertical
                    style={{ backgroundColor: "black", minHeight: "43vh", width: "0.84px" }} />
            </Col>

            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Rating Stats</h3>
                <Form>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Address</Form.ControlLabel>
                        <Form.Control
                            name="address"
                            value={address}
                            onChange={(value) => setAddress(value)}
                        />
                    </Form.Group>

                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <RadioGroup name="radio-group-inline-picker-label" inline appearance="picker" value={srole} onChange={setSRole}>
                            <RadioLabel>Role: </RadioLabel>
                            <Radio value="worker">Worker</Radio>
                            <Radio value="client">Client</Radio>
                        </RadioGroup>
                    </Form.Group>

                    <Button
                        appearance="primary"
                        onClick={srole === "client" ? clientstats : workerstats}
                        disabled={loading}
                        style={{ marginBottom: "2vh" }}
                    >
                        {loading ? "Checking..." : "Check Stats"}
                    </Button>

                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel style={{ marginBottom: "1vh" }}>
                            {srole === "worker" ? (
                                <>Number of Jobs Done:  {pressed ? (tasks ? tasks : "No Job Completed") : ""}</>
                            ) : null}
                        </Form.ControlLabel>
                        <Form.ControlLabel>
                            Average Rating:  {pressed ? (statsrating ? statsrating : "No Rating") : ""}
                        </Form.ControlLabel>
                    </Form.Group>
                </Form>
            </Col>
        </Panel>
    );
};

export default Rating;
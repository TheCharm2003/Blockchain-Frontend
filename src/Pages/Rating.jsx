import React, { useState } from "react";
import { Button, Form, Panel, Rate, Radio, RadioGroup, Col, Divider, toaster, Message } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain, simulateCall } from "../Components/Blockchain";

const Rating = () => {
    const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;
    const [rating, setRating] = useState(0);
    const [jobId, setJobId] = useState("");
    const [role, setRole] = useState("worker");
    const [srole, setSRole] = useState("worker");
    const [loading, setLoading] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [statsrating, setStatRating] = useState(0);
    const [tasks, setTask] = useState(0);
    const [pressed, setPressed] = useState(false);

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
            const tx = await contract.rateClient(
                rating,
                jobId
            );
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable >
                    Client Rated Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setRating(0);
            setJobId("");
            setRole("worker");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Cannot Rate.
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
            const tx = await contract.rateWorker(
                rating,
                jobId
            );
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable >
                    Worker Rated successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setRating(0);
            setJobId("");
            setRole("worker");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Cannot Rate.
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
            setStatRating(tx[0]);
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Failed to Fetch.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
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
            setTask(tx[0]);
            setStatRating(tx[1]);
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable>
                    Failed to Fetch.
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value) => {
        setSRole(value);
        setStatRating(0);
        setTask(0);
        setPressed(false);
    }

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
                        <RadioGroup name="radio-group-inline-picker-label" inline appearance="picker" value={srole} onChange={handleChange}>
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
                                <>Number of Jobs Done:  {pressed ? (tasks ? parseFloat(tasks) : "No Job Completed") : ""}</>
                            ) : null}
                        </Form.ControlLabel>
                        <Form.ControlLabel>
                            Average Rating:  {pressed ? (statsrating ? parseFloat(statsrating) : "No Rating") : ""}
                        </Form.ControlLabel>
                    </Form.Group>
                </Form>
            </Col>
        </Panel>
    );
};

export default Rating;
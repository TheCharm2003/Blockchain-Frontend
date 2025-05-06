import React, { useState } from "react";
import { Button, Form, Panel, Rate, Radio, RadioGroup, Col, Divider } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";

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

    const handleRateClient = async () => {
        if (!jobId || !rating) {
            toast.error("Please fill in all fields.");
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
            toast.success("Client rated successfully!");
        } catch (error) {
            toast.error(`Error: ${error.reason}`);
            console.error(error);
        } finally {
            setRatingLoading(false);
        }
    };

    const handleRateWorker = async () => {
        if (!jobId || !rating) {
            toast.error("Please fill in all fields.");
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
            toast.success("Worker rated successfully!");
        } catch (error) {
            toast.error(`Error: ${error.reason}`);
            console.error(error);
        } finally {
            setRatingLoading(false);
        }
    };

    const stats = async () => {
        if (!srole) {
            toast.error("Please Select Role.");
            return;
        }
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.getWorkerStats(address);
            setPressed(true);
            setStatRating(tx.averageRating);
            setTask(tx.completedJobs);
        } catch (error) {
            toast.error(`Transaction failed: ${error.reason}`);
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

            </Col>

            <Col style={{ width: '2%' }}>
                <Divider vertical
                    style={{ backgroundColor: "black", minHeight: "43vh", width: "0.84px" }} />
            </Col>
            <Col style={{ width: '48%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Stats</h3>
                <Form>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Address</Form.ControlLabel>
                        <Form.Control name="address" value={address} onChange={(value) => setAddress(value)} />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <RadioGroup name="radio-group-inline-picker-label" inline appearance="picker" value={srole} onChange={setSRole}>
                            <RadioLabel>Role: </RadioLabel>
                            <Radio value="worker">Worker</Radio>
                            {/* <Radio value="client">Client</Radio> */}
                        </RadioGroup>
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={stats}
                        disabled={loading}
                        style={{ marginBottom: "2vh" }}
                    >
                        {loading ? "Checking..." : "Check Stats"}
                    </Button>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel style={{ marginBottom: "1vh" }}>
                            Number of Jobs Done: {pressed ? (tasks ? tasks : "No Job Completed") : ""}
                        </Form.ControlLabel>
                        <Form.ControlLabel>
                            Average Rating: {pressed ? (statsrating ? statsrating : "No Rating") : ""}
                        </Form.ControlLabel>
                    </Form.Group>
                </Form>
            </Col>
        </Panel>
    );
};

export default JobApplication;
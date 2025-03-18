import React, { useState } from "react";
import { Button, Form, Panel, Rate, Radio, RadioGroup } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";

const Rating = () => {
    const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;
    const [rating, setRating] = useState();
    const [jobId, setJobId] = useState("");
    const [role, setRole] = useState("worker");
    const [loading, setLoading] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);

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
        </Panel>
    );
};

export default Rating;

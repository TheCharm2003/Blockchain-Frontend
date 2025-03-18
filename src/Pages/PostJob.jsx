import React, { useState } from "react";
import { Button, Form, Panel, Col, Divider } from "rsuite";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { getBlockchain } from "../Components/Blockchain";

const PostJob = () => {
    const [description, setDescription] = useState("");
    const [payment, setPayment] = useState("");
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState("");
    const [payloading, setPayLoading] = useState(false);

    const postJob = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.postJob(description, ethers.parseEther(payment), {
                value: ethers.parseEther(payment),
            });
            await tx.wait();
            toast.success("Job Posted Successfully!");
            setDescription("");
            setPayment("");
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

    const releasePayment = async () => {
        setPayLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.releasePayment(jobId);
            await tx.wait();
            toast.success("Payment Released Successfully!");
            setJobId("");
        } catch (error) {
            if (error.reason) {
                toast.error(`Transaction failed: ${error.reason}`);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        } finally {
            setPayLoading(false);
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
                height: '45vh'
            }}
        >
            <Col style={{ width: '48%' }}>
            <h3 style={{ marginBottom: "2.5vh" }}>Job Details</h3>
                <Form>
                    <Form.Group>
                        <Form.ControlLabel>Description</Form.ControlLabel>
                        <Form.Control
                            name="description"
                            value={description}
                            onChange={(value) => setDescription(value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Payment (ETH)</Form.ControlLabel>
                        <Form.Control
                            name="payment"
                            type="number"
                            value={payment}
                            onChange={(value) => setPayment(value)}
                        />
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={postJob}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Job"}
                    </Button>
                </Form>
            </Col>
            <Col style={{ width: '2%' }}>
                <Divider vertical
                    style={{ backgroundColor: "black", minHeight: "40vh", width: "0.84px" }} />
            </Col>
            <Col style={{ width: '48%' }}>
            <h3 style={{ marginBottom: "2.5vh" }}>Release Payment</h3>
                <Form>
                    <Form.Group>
                        <Form.ControlLabel>ID</Form.ControlLabel>
                        <Form.Control
                            name="jobId"
                            type="number"
                            value={jobId}
                            onChange={(value) => setJobId(value)}
                        />
                    </Form.Group>
                    <Button
                        appearance="primary"
                        onClick={releasePayment}
                        disabled={payloading}
                    >
                        {payloading ? "Paying..." : "Pay"}
                    </Button>
                </Form>
            </Col>
        </Panel>
    );
};

export default PostJob;
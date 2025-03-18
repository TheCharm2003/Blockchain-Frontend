import React, { useState } from "react";
import { Button, Form, Panel, Divider, Col } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";
import Register from "../Assets/Register.jpg"

const RegisterWorker = () => {
    const [name, setName] = useState("");
    const [skill, setSkill] = useState("");
    const [loading, setLoading] = useState(false);

    const registerWorker = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            const tx = await contract.registerWorker(name, skill);
            await tx.wait();
            toast.success("Worker Registered Successfully!");
            setName("");
            setSkill("");
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

    return (
        <Panel
            bordered
            shaded
            style={{
                margin: "auto",
                marginTop: "2vh",
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                height: "85vh"
            }}
        >
            <Col style={{ width: '40%' }}>
                <img
                    src={Register}
                    alt="Registration"
                    style={{ width: "95%", alignItems: 'center' }}
                />
            </Col>
            <Col style={{ width: '3%' }}>
                <Divider vertical
                    style={{ backgroundColor: "black", minHeight: "80vh", width: "0.84px" }} />
            </Col>

            <Col style={{ width: '57%' }}>
                <h3 style={{ marginBottom: "2.5vh" }}>Registration</h3>
                <Form>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Name</Form.ControlLabel>
                        <Form.Control name="name" value={name} onChange={(value) => setName(value)} />
                    </Form.Group>
                    <Form.Group style={{ marginBottom: "2vh" }}>
                        <Form.ControlLabel>Skill</Form.ControlLabel>
                        <Form.Control name="skill" value={skill} onChange={(value) => setSkill(value)} />
                    </Form.Group>
                    <Button appearance="primary" onClick={registerWorker} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </Form>
            </Col>
        </Panel>
    );
};

export default RegisterWorker;
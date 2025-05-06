import React, { useState } from "react";
import { Button, Form, Panel, Divider, Col, toaster, Message } from "rsuite";
import { getBlockchain, simulateCall } from "../Components/Blockchain";
import Register from "../Assets/Register.jpg"

const RegisterWorker = () => {
    const [name, setName] = useState("");
    const [skill, setSkill] = useState("");
    const [loading, setLoading] = useState(false);

    const registerWorker = async () => {
        setLoading(true);
        try {
            const { contract } = await getBlockchain();
            await simulateCall(contract, "registerWorker", [name, skill]);
            const tx = await contract.registerWorker(name, skill);
            await tx.wait();
            toaster.push(
                <Message showIcon type="success" closable >
                    Worker Registered Successfully!
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
            setName("");
            setSkill("");
        } catch (error) {
            toaster.push(
                <Message showIcon type="error" closable >
                    Cannot Connect to Metamask
                </Message>,
                { placement: 'topCenter', duration: 8000 }
            );
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
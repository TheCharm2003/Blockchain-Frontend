import React, { useState, useEffect } from "react";
import { Container, Panel, Row, Col } from "rsuite";
import { toast } from "react-toastify";
import { getBlockchain } from "../Components/Blockchain";
import { ethers } from "ethers";

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const { contract } = await getBlockchain();
                const jobCount = Number(await contract.jobCounter());

                const jobPromises = [];
                for (let i = 1; i < jobCount; i++) {
                    jobPromises.push(contract.getJob(i));
                }

                const jobData = await Promise.all(jobPromises);

                const formattedJobs = jobData.map((job, index) => ({
                    id: index + 1,
                    client: job[0],
                    worker: job[1],
                    description: job[2],
                    payment: ethers.formatEther(job[3]),
                    isCompleted: job[4],
                    isPaid: job[5],
                }));

                setJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Failed to fetch jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();

        const listenForJobPosts = async () => {
            try {
                const { contract } = await getBlockchain();

                contract.on("JobPosted", (jobId, client, description, payment) => {
                    toast.info(`New job posted: ${description}`);
                    fetchJobs();
                });

                return () => {
                    contract.off("JobPosted");
                };
            } catch (error) {
                console.error("Error setting up event listener:", error);
            }
        };

        listenForJobPosts();

    }, []);

    if (loading) {
        return <Container>Loading jobs...</Container>;
    }

    if (loading) {
        return <Container>Loading jobs...</Container>;
    }

    return (
        <Container>
            <Panel bordered header="Job Listings">
                {jobs.map((job, index) => (
                    <Panel key={index} bordered style={{ marginBottom: "10px", padding: "15px" }}>
                        <Row style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                            <Col style={{ flex: "1 1 150px" }}>
                                <strong>ID:</strong> {job.id}
                            </Col>
                            <Col style={{ flex: "1 1 200px" }}>
                                <strong>Client:</strong> {job.client}
                            </Col>
                            <Col style={{ flex: "1 1 200px" }}>
                                <strong>Worker:</strong> {job.worker}
                            </Col>
                            <Col style={{ flex: "2 1 300px" }}>
                                <strong>Description:</strong> {job.description}
                            </Col>
                            <Col style={{ flex: "1 1 120px" }}>
                                <strong>Payment (ETH):</strong> {job.payment}
                            </Col>
                            <Col style={{ flex: "1 1 100px" }}>
                                <strong>Completed:</strong> {job.isCompleted ? "Yes" : "No"}
                            </Col>
                            <Col style={{ flex: "1 1 100px" }}>
                                <strong>Paid:</strong> {job.isPaid ? "Yes" : "No"}
                            </Col>
                        </Row>
                    </Panel>
                ))}
            </Panel>
        </Container>
    );
};

export default JobListings;

import React from "react";
import { Nav, Navbar } from "rsuite";
import { Link } from "react-router-dom";

const navStyle = {
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2), 0px -4px 4px rgba(0, 0, 0, 0.1)",
  padding: "3px 4px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderRadius:"1vh"
};

const linkStyle = {
  textDecoration: "none",
  color: "black",
  margin: "0 10px",
};

const Navigation = () => {
  return (
    <Navbar style={navStyle}>
      <Nav>
        <Nav.Item as={Link} to="/" style={linkStyle}>Home</Nav.Item>
        <Nav.Item as={Link} to="/Register" style={linkStyle}>Register</Nav.Item>
        <Nav.Item as={Link} to="/Listings" style={linkStyle}>Listings</Nav.Item>
        <Nav.Item as={Link} to="/Post" style={linkStyle}>Job Posting</Nav.Item>
        <Nav.Item as={Link} to="/Assign" style={linkStyle}>Assign Job</Nav.Item>
        <Nav.Item as={Link} to="/Actions" style={linkStyle}>Job Actions</Nav.Item>
        <Nav.Item as={Link} to="/Dispute" style={linkStyle}>Dispute</Nav.Item>
        <Nav.Item as={Link} to="/Rate" style={linkStyle}>Ratings</Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default Navigation;

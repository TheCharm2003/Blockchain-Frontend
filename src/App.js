import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import "rsuite/dist/rsuite-no-reset.min.css";
import Navigation from "./Components/Navbar";
import Home from "./Pages/Home";
import RegisterWorker from "./Pages/RegisterWorker";
import PostJob from "./Pages/PostJob";
import Actions from "./Pages/Actions";
import JobListings from "./Pages/JobListings";
import Dispute from "./Pages/Dispute";
import Rating from "./Pages/Rating";
import JobApplication from "./Pages/JobApplication";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Register" element={<RegisterWorker/>}/>
        <Route path="/Post" element={<PostJob/>}/>
        <Route path="/Actions" element={<Actions/>}/>
        <Route path="/Listings" element={<JobListings/>}/>
        <Route path="/Dispute" element={<Dispute/>}/>
        <Route path="/Rate" element={<Rating/>}/>
        <Route path="/Assign" element={<JobApplication/>}/>
      </Routes>
    </Router>
  );
};

export default App;
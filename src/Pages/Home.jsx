import React from "react";
import { Panel } from "rsuite";
import home from "../Assets/Home.png"

const Home = () => {
  return (
      <Panel bordered style={{ marginTop:"2vh"}}>
         <img 
        src={home}
        alt="Future of Freelance" 
        style={{ width: "100%", height: "auto" }}
      />
      </Panel>
  );
};

export default Home;
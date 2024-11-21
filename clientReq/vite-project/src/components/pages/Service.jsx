import React from "react";
import NavBar from "../NavBar";
import DeployForm from "./DeployForm";
import Footer from "../Footer";

const Service = () => {
    return (
        <>
            <div>
                <NavBar />
            </div>

            <div style={{ marginTop: "70px" }}> {/* Adjust based on NavBar height */}
                {/* <DeployForm /> */}  we will go at this form after deploy buttin on projects page now make projects page
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default Service;

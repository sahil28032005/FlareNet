import React, { useState,useEffect } from 'react';
import NavBar from '../NavBar';
import HeroSection from '../HeroSection';
import FeaturesSection from '../FeaturesSection';
import Footer from '../Footer';
import { jwtDecode } from "jwt-decode";
const LandingPage = () => {
  const [username, setUsername] = useState(null);

    // Check if the user is logged in
    useEffect(() => {
    
      const token = localStorage.getItem("authTokenLogin");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (Date.now() < decodedToken.exp * 1000) {
            setUsername(decodedToken.username || "User");
          } else {
            localStorage.removeItem("authTokenLogin");
          }
        } catch (error) {
          console.error("Invalid token:", error.message);
          localStorage.removeItem("authTokenLogin");
        }
      }
    }, []);
  return (
    <>
      <div className="">
      <NavBar username={username} setUsername={setUsername} />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </>


  )
}

export default LandingPage
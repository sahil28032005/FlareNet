import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {jwtDecode} from "jwt-decode";

const generateBubbles = () => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 20, // Bubble size between 20 and 100px
    x: Math.random() * 100, // Random x position
    y: Math.random() * 100, // Random y position
    delay: Math.random() * 5, // Random delay
  }));
};

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const [message, setMessage] = useState(null); // For success/error messages
  const [bubbles, setBubbles] = useState(generateBubbles());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/auth";

  useEffect(() => {
    window.addEventListener("resize", () => setBubbles(generateBubbles()));
    return () => window.removeEventListener("resize", () => setBubbles(generateBubbles()));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    const url = `${API_BASE_URL}/${endpoint}`;
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await axios.post(url, payload);
      setMessage({ type: "success", text: response.data.message });

      // Redirect to the dashboard on successful login
      if (isLogin && response.status === 200) {
        const { token } = response.data;

        //store token in localstorage
        localStorage.setItem("authTokenLogin", token);

        //decode token to get its expiry
        const decodedToken = jwtDecode(token);
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds

        //set timeout to clear token after expiry
        setTimeout(() => {
          localStorage.removeItem("authTokenLogin");
          console.log("Token expired and removed.");
        }, expiryTime - Date.now());

        navigate("/"); // Redirect to the main dashboard
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE_URL}/oauth/${provider}`;
  };

  return (
    <div
      id="bubbles-container"
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden"
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="bubble absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500 glow opacity-70"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            top: `${bubble.y}%`,
            left: `${bubble.x}%`,
            zIndex: 0,
          }}
          data-speed={bubble.size / 50}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 2, delay: bubble.delay, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}

      <motion.div
        className="z-10 w-full sm:w-[400px] p-8 rounded-xl shadow-2xl relative bg-gradient-to-br from-[#1e293b] to-[#334155] backdrop-blur-lg border border-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {isLogin ? "Welcome Back" : "Join Us"}
        </motion.h2>

        {message && (
          <div
            className={`text-center p-2 mb-4 rounded-lg ${message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {message.text}
          </div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 p-4 rounded-lg bg-gray-800 text-white focus:ring-4 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-4 rounded-lg bg-gray-800 text-white focus:ring-4 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-4 rounded-lg bg-gray-800 text-white focus:ring-4 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-500"
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </motion.form>

        <div className="mt-6 text-center">
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </motion.p>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-400">Or login with</p>
          <div className="flex justify-center space-x-3">
            <Button
              onClick={() => handleOAuth("google")}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2"
            >
              Google
            </Button>
            <Button
              onClick={() => handleOAuth("github")}
              className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-4 py-2"
            >
              GitHub
            </Button>
            <Button
              onClick={() => handleOAuth("bitbucket")}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
            >
              Bitbucket
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

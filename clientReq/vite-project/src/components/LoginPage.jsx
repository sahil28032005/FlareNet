import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/userContext";
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const { setUserData } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    const url = `${API_BASE_URL}/${endpoint}`;
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await axios.post(url, payload);
      setMessage({ type: "success", text: response.data.message });

      if (isLogin && response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("authTokenLogin", token);
        const decodedToken = jwtDecode(token);

        const userData = {
          id: decodedToken.userId,
          email: decodedToken.email,
          role: decodedToken.role,
        };
        setUserData(userData);
        const expiryTime = new Date(decodedToken.exp * 1000);

        setTimeout(() => {
          localStorage.removeItem("authTokenLogin");
          setUserData(null);
        }, expiryTime - Date.now());

        navigate("/");
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
    <div className="relative flex min-h-screen">
      {/* Left side image */}
      <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: 'url(/assects/images/LoginPage_asset.png)', height: '80vh' }}></div>

      {/* Right side form */}
      <div className="flex-1 bg-gradient-to-r from-black via-transparent to-black flex items-center justify-center px-6 py-8">
        <motion.div
          className="w-full sm:w-[400px] p-8 rounded-lg shadow-lg bg-gray-800 text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.h2
            className="text-4xl font-bold text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </motion.h2>

          {message && (
            <div
              className={`text-center p-2 mb-4 rounded-lg ${message.type === "success" ? "bg-green-500 text-black" : "bg-red-600 text-white"}`}
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
                <Label htmlFor="name" className="text-lg font-medium">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 p-4 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-lg font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-4 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-lg font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 p-4 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </motion.form>

          <div className="mt-6 text-center">
            <motion.p
              className="text-lg text-indigo-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="cursor-pointer text-indigo-400 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </motion.p>
          </div>

          <div className="mt-6 text-center space-y-3">
            <p className="text-indigo-400">Or login with</p>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => handleOAuth("google")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2"
              >
                Google
              </Button>
              <Button
                onClick={() => handleOAuth("github")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2"
              >
                GitHub
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

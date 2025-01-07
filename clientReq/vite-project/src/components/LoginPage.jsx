import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bubbles, setBubbles] = useState(generateBubbles());

  const handleMouseMove = (e) => {
    const bubblesContainer = document.getElementById("bubbles-container");
    const rect = bubblesContainer.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width;
    const offsetY = (e.clientY - rect.top) / rect.height;

    document.querySelectorAll(".bubble").forEach((bubble) => {
      const speed = bubble.dataset.speed;
      bubble.style.transform = `translate(${offsetX * speed}px, ${offsetY * speed}px)`;
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => setBubbles(generateBubbles()));
    return () => window.removeEventListener("resize", () => setBubbles(generateBubbles()));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mode = isLogin ? "Login" : "Register";
    console.log(`${mode} with:`, { email, password });
  };

  return (
    <div
      id="bubbles-container"
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Bubbles */}
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
          data-speed={bubble.size / 50} // Speed varies based on size
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 2, delay: bubble.delay, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}

      {/* Card */}
      <motion.div
        className="z-10 w-full sm:w-[400px] p-8 rounded-xl shadow-2xl relative bg-gradient-to-br from-[#1e293b] to-[#334155] backdrop-blur-lg border border-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Title */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {isLogin ? "Welcome Back" : "Join Us"}
        </motion.h2>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
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

        {/* Social Login */}
        <div className="mt-6 space-y-4">
          <Button className="w-full bg-white text-black hover:bg-gray-100">Continue with Google</Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800">Continue with GitHub</Button>
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Continue with GitLab</Button>
        </div>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

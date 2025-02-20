import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
import { SpiderMan } from './chatAssistance/SpiderMan'
import { ChatInterface } from "./chatAssistance/ChaatInterface";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="w-full min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white relative overflow-hidden pt-24"
      >
        {/* Flaming Rocket Animation */}
        <div className="rocket-container absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="rocket-body absolute w-8 h-24 bg-gray-100 rounded-lg transform -rotate-45 origin-bottom">
            <div className="flames absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="flame"></div>
              <div className="flame"></div>
              <div className="flame"></div>
            </div>
          </div>
        </div>
        {/* New Glowing Tech Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9InJnYmEoMjU1LDE5MiwwLDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjxsaW5lIHgxPSIxMDAlIiB5MT0iMCIgeDI9IjAiIHkyPSIxMDAlIiBzdHJva2U9InJnYmEoMjU1LDE5MiwwLDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20" />

          {/* Glowing Lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute glowing-line"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}

          {/* Circuit Nodes */}
          <div className="circuit-lines">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="circuit-node"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Original Headline Section */}
        <div className="max-w-4xl px-4 md:px-12 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 glowing-headline">
            <span className="text-yellow-400">Single-Click</span> Deploy with{" "}
            <span className="tech-text">FlareNet</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 neon-text">
            Deploy your applications instantly with world-class performance, scalability, and security.
          </p>
          <Button
            onClick={() => navigate("/new")}
            className="cyber-button bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-3 text-lg rounded-md shadow-lg transform hover:scale-105 transition-transform"
          >
            <span className="glow-text">Start Deploying Now</span>
          </Button>
        </div>

        {/* Original 3D Cards with Holographic Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-7xl px-4 md:px-8">
          {[
            {
              title: "Single-Click Deploy",
              description: "No complex setups. Deploy your app with a single click, saving you time and effort.",
            }, {
              title: "24/7 Uptime",
              description: "Guaranteed uptime for your applications with advanced monitoring and redundancy.",
            }, {
              title: "Scalable Architecture",
              description: "Easily handle traffic spikes with our highly scalable deployment solutions.",
            }, {
              title: "Free Hosting Tier",
              description: "Get started with our free tier that includes hosting for one website.",
            }, {
              title: "Real-Time Insights",
              description: "Track deployments, monitor traffic, and gain actionable insights.",
            }, {
              title: "Concurrency Deployment",
              description: "Deploy multiple versions simultaneously with ease.",
            }
            // ... (keep all your original card objects)
          ].map((feature, index) => (
            <div
              key={index}
              className="holographic-card p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-yellow-400 neon-title">
                {feature.title}
              </h2>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Original Floating Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full filter blur-xl animate-pulse opacity-50 animate-move"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full filter blur-2xl animate-pulse opacity-50 animate-move-slow"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse opacity-40 animate-move-fast"></div>
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/3 w-48 h-48 bg-green-500 rounded-full filter blur-xl animate-rotate opacity-30"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl animate-rotate opacity-40"></div>
        </div>
      </section>

      {/* Original Advertising Section with Effects */}
      <section className="advertising-section w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-black to-gray-900 text-white relative px-4 md:px-12 overflow-hidden">
        {/* Glowing Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute glowing-line"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-7xl relative z-10">
          <div className="text-content">
            <h2 className="text-4xl md:text-5xl font-bold glowing-headline mb-6">
              Seamless Integration for Your Customers
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Empower your applications with cutting-edge deployment, real-time analytics, and unparalleled scalability.
              Join thousands of businesses who trust FlareNet to deliver world-class performance.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li>✅ Easy customer onboarding</li>
              <li>✅ Seamless integration with third-party tools</li>
              <li>✅ Advanced analytics for better decision-making</li>
              <li>✅ 24/7 support for you and your customers</li>
            </ul>
          </div>

          <div className="image-container relative">
            <img
              src="/assects/images/heroSectionInsights.png"
              alt="Integration Illustration"
              className="holographic-card w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-r from-yellow-500 to-purple-500 opacity-20 blur-xl z-[-1]"></div>
          </div>
        </div>
      </section>
  
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '100px',
        width: '600px',
        height: '400px',
        zIndex: 1000,
        pointerEvents: 'none',
        overflow: 'hidden', // Crucial for containment
        border: '2px solid red' // Temporary for debugging
      }}>
        <Canvas
          style={{ background: 'transparent' }}
          camera={{
            position: [0, 1.5, 3], // Adjusted camera position
            fov: 45,               // Narrower field of view
            near: 0.1,
            far: 1000
          }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 5, 2]} intensity={1.5} />
          <SpiderMan />
          <Environment preset="sunset" />
        </Canvas>
      </div>
      <ChatInterface

      />
    </>
  );
};

export default HeroSection;
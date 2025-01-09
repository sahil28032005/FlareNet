import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [headline, setHeadline] = useState("");
  const fullHeadline = "Single-Click Deploy with FlareNet";

  // Typing effect for headline
  useEffect(() => {
    let index = -1;
    const interval = setInterval(() => {
      if (index < fullHeadline.length - 1) {
        setHeadline((prev) => prev + fullHeadline[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white relative overflow-hidden"
    >
      {/* Headline Section */}
      <div className="max-w-4xl px-4 md:px-12 relative z-10">
        <h1
          className={`text-5xl md:text-6xl font-bold mb-6 glowing-text transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          {headline}
        </h1>
        <p
          className={`text-lg md:text-xl mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          Deploy your applications instantly with world-class performance, scalability, and security.
        </p>
        <Button
          onClick={() => {
            navigate("/new");
          }}
          className="bg-yellow-400 text-black hover:bg-gray-200 px-6 py-3 text-lg rounded-md shadow-lg transform hover:scale-105 transition-transform"
        >
          Start Deploying Now
        </Button>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-7xl px-4 md:px-8">
        {[
          {
            title: "Single-Click Deploy",
            description:
              "No complex setups. Deploy your app with a single click, saving you time and effort.",
          },
          {
            title: "24/7 Uptime",
            description:
              "Guaranteed uptime for your applications with advanced monitoring and redundancy.",
          },
          {
            title: "Scalable Architecture",
            description:
              "Easily handle traffic spikes with our highly scalable deployment solutions.",
          },
          {
            title: "Free Hosting Tier",
            description:
              "Get started with our free tier that includes hosting for one website.",
          },
          {
            title: "Real-Time Insights",
            description:
              "Track deployments, monitor traffic, and gain actionable insights.",
          },
          {
            title: "Concurrency Deployment",
            description:
              "Deploy multiple versions simultaneously with ease.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg bg-gray-800 text-white shadow-md transform transition-all duration-1000 ${
              isVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-10"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              {feature.title}
            </h2>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full filter blur-xl animate-pulse opacity-50"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full filter blur-2xl animate-pulse opacity-50"
          style={{ animationDuration: "5s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse opacity-40"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;

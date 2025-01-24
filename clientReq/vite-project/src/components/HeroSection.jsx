import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [headline, setHeadline] = useState('');

  const fullHeadline = "Single-Click Deploy with FlareNet....";

  // Typing effect for headline
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (index < fullHeadline.length) { 
        setHeadline((prev) => prev + fullHeadline[index]);
        index++;
      }
    }, 150);

    let index = 0; 

    return () => clearInterval(intervalId); 
  }, []);

  // Scroll-triggered animations
// Scroll-triggered animations
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
        {/* Headline Section */}
        <div className="max-w-4xl px-4 md:px-12 relative z-10">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-4 glowing-text transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
          >
            {headline}
          </h1>
          <p
            className={`text-lg md:text-xl mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
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

        {/* 3D Stacked and Flipping Cards with Advanced Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-7xl px-4 md:px-8">
          {[{
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
          }].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg bg-gray-800 text-white shadow-lg transform transition-all duration-1000 ${isVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-10"
                } hover:scale-105 hover:shadow-xl hover:rotate-[15deg] hover:translate-z-[40px] transform-gpu perspective-[1000px]`}
            >
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                {feature.title}
              </h2>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>



        {/* Advanced Dynamic 3D Animation with Floating Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full filter blur-xl animate-pulse opacity-50 animate-move"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full filter blur-2xl animate-pulse opacity-50 animate-move-slow"
            style={{ animationDuration: "5s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse opacity-40 animate-move-fast"
            style={{ animationDuration: "6s" }}
          ></div>
          {/* Additional 3D and 4D Effects */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/3 w-48 h-48 bg-green-500 rounded-full filter blur-xl animate-rotate opacity-30"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl animate-rotate opacity-40"></div>
        </div>

      </section>
      {/* another advertising section */}
      <section
        ref={sectionRef}
        className="advertising-section w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-black to-gray-900 text-white relative px-4 md:px-12 overflow-hidden"
      >
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-7xl">
          {/* Text Section */}
          <div
            className={`text-content transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold glowing-text mb-6">
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

          {/* Image Section */}
          <div
            className={`image-container relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <img
              src="/assects/images/heroSectionInsights.png"
              alt="Integration Illustration"
              className="fancy-image w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            />
            {/* Floating Glow */}
            <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-r from-yellow-500 to-purple-500 opacity-20 blur-xl z-[-1]"></div>
          </div>
        </div>
      </section>
    </>

  );
};

export default HeroSection;

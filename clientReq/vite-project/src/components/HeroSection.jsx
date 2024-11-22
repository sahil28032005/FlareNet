import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import selected0 from "@/assets/selected0.jpg";
import selected1 from "@/assets/selected1.jpg";
import middleImage1 from "@/assets/middleImage1.jpg"; // Add your image path
import middleImage2 from "@/assets/middleImage2.jpg"; // Add your image path
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [headline, setHeadline] = useState("");
  const fullHeadline = "Host Your Website with FlareNet"; // Typing effect headline text

  // Typing effect
  useEffect(() => {
    let index = -1;
    const interval = setInterval(() => {
      if (index < fullHeadline.length-1) {
        setHeadline((prev) => prev + fullHeadline[index]);
        index++;
      } else {
        clearInterval(interval); // Stop the interval once the text is fully displayed
      }
    }, 100); // Adjust speed here
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

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
      className="w-full h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white relative overflow-hidden"
    >
      <div className="max-w-4xl px-4 md:px-12 relative z-10">
        {/* Main Content */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 glowing-text">
          {headline}
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Reliable, scalable, and secure hosting solutions for modern websites.
        </p>
        <Button
          onClick={() => {
            navigate("/projects");
          }}
          className="bg-yellow-400 text-black hover:bg-gray-200 px-6 py-3 text-lg rounded-md shadow-lg"
        >
          Get Started
        </Button>
      </div>

      {/* Image Decorations */}
      {/* Right Image */}
      <div
        className={`absolute bottom-[-40px] right-[-30px] md:bottom-[-10px] md:right-[140px] transform rotate-12 shadow-lg p-4 rounded-lg glowing-border transition-transform duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-[50%] opacity-0"
        }`}
        style={{ width: "300px", height: "300px" }}
      >
        <img
          src={selected0}
          alt="Right Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Left Image */}
      <div
        className={`absolute top-[-30px] left-[-30px] md:top-[50px] md:left-[90px] transform -rotate-12 shadow-lg p-4 rounded-lg glowing-border transition-transform duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-[50%] opacity-0"
        }`}
        style={{ width: "300px", height: "300px" }}
      >
        <img
          src={selected1}
          alt="Left Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Middle Top Image */}
      <div
        className={`absolute top-[150px] left-[50%] transform -translate-x-[-100%] rotate-6 shadow-lg p-4 rounded-lg glowing-border-red transition-transform duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-y-[-50%] opacity-0"
        }`}
        style={{ width: "250px", height: "250px" }}
      >
        <img
          src={middleImage1}
          alt="Middle Top Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Middle Bottom Image */}
      <div
        className={`absolute bottom-[150px] left-[50%] transform -translate-x-[200%] -rotate-6 shadow-lg p-4 rounded-lg glowing-border-red transition-transform duration-1000 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-y-[50%] opacity-0"
        }`}
        style={{ width: "250px", height: "250px" }}
      >
        <img
          src={middleImage2}
          alt="Middle Bottom Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;

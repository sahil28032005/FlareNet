import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import selected0 from "@/assets/selected0.jpg";
import selected1 from "@/assets/selected1.jpg";
import "./HeroSection.css";

const HeroSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 } // Trigger when at least 50% of the section is visible
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
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Host Your Website with Ease
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Reliable, scalable, and secure hosting solutions for modern websites.
        </p>
        <Button className="bg-yellow-400 text-black hover:bg-gray-200 px-6 py-3 text-lg rounded-md shadow-lg">
          Get Started
        </Button>
      </div>

      {/* Right Image Section */}
      <div
        className={`absolute bottom-[-40px] right-[-30px] md:bottom-[-10px] md:right-[140px] transform rotate-12 shadow-lg p-4 rounded-lg glowing-border transition-transform duration-1000 ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[50%] opacity-0"
        }`}
        style={{ width: "300px", height: "300px" }}
      >
        <img
          src={selected0}
          alt="Right Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Left Image Section */}
      <div
        className={`absolute top-[-30px] left-[-30px] md:top-[50px] md:left-[90px] transform -rotate-12 shadow-lg p-4 rounded-lg glowing-border transition-transform duration-1000 ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-[50%] opacity-0"
        }`}
        style={{ width: "300px", height: "300px" }}
      >
        <img
          src={selected1}
          alt="Left Decoration"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;

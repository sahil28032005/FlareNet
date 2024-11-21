import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import "./DeploymentProgress.css";

const DeploymentProgress = () => {
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating deployment progress with log updates
    const interval = setInterval(() => {
      setLogs(prevLogs => [
        ...prevLogs,
        `Log Entry ${prevLogs.length + 1}: Deployment is in progress...`
      ]);
    }, 2000); // Add logs every 2 seconds

    if (logs.length > 10) {
      clearInterval(interval);
      setIsDeploying(false);
    }

    return () => clearInterval(interval);
  }, [logs]);

  const handleCancel = () => {
    setIsDeploying(false);
    navigate("/service");  // Navigate back to the service page
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(145deg, #000000, #1a1a1a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        className="deploy-progress-container bg-gray-900 text-white p-8 rounded-lg shadow-xl w-full max-w-4xl"
        style={{
          animation: 'glowAnimation 2s ease-in-out infinite',
          boxShadow: '0 0 30px rgba(0, 123, 255, 0.8)',
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-500">
          Deployment Progress
        </h2>
        <div
          className="log-area bg-black rounded-lg p-4 max-h-[300px] overflow-auto shadow-lg"
          style={{
            animation: 'glowEffect 2s ease-in-out infinite',
            border: '2px solid #fffa',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          }}
        >
          <Label className="text-lg text-white">Logs</Label>
          <Textarea
            className="mt-2 w-full h-[200px] text-white bg-transparent border-0 outline-none"
            value={logs.join("\n")}
            readOnly
            style={{
              color: '#dcdcdc',
              fontFamily: 'Courier New, monospace',
              fontSize: '14px',
              letterSpacing: '1px',
              lineHeight: '1.5',
            }}
          />
        </div>
        
        {isDeploying ? (
          <div className="mt-6 flex justify-between items-center">
            <Button
              onClick={handleCancel}
              className="bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-lg transition-all"
              style={{
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                animation: 'glowRed 2s ease-in-out infinite',
              }}
            >
              Cancel Deployment
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-lg transition-all"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                animation: 'glowGreen 2s ease-in-out infinite',
              }}
            >
              View Dashboard
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-all"
            >
              Go Back Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentProgress;

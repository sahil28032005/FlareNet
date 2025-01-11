import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import "./DeploymentProgress.css";
import NavBar from '../NavBar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; // For graph visualization

const DeploymentProgress = () => {
  const [logs, setLogs] = useState([]); // Logs state
  const [isDeploying, setIsDeploying] = useState(true);
  const [progress, setProgress] = useState(0); // Deployment progress state
  const [deploymentStats, setDeploymentStats] = useState({ success: 70, failure: 30, total: 100 }); // Demo stats
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you pass deployment ID via URL params

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getLogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          const newLogs = data.logs.map(log => `Log Entry ${log.event_id}: ${log.log}`);
          setLogs(prevLogs => [...prevLogs, ...newLogs]); // Append new logs
          setProgress(data.progress || progress); // Update progress if provided
          setDeploymentStats(data.stats || deploymentStats); // Update analytics
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error.message);
      }
    };

    // Polling every 2 seconds
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    // Clear interval when logs are completed or component unmounts
    return () => clearInterval(interval);
  }, [id, progress, deploymentStats]);

  const handleCancel = () => {
    setIsDeploying(false);
    navigate("/service"); // Navigate back to the service page
  };

  const COLORS = ['#00FF00', '#FF4D4D'];

  return (
    <>
      <NavBar />
      <div className="deploy-progress-container">
        <div className="progress-header">
          <h2 className="text-5xl font-bold text-cyan-400 animate-glow">Deployment Progress</h2>
          <p className="text-lg text-gray-300">Live deployment logs, real-time analytics, and more...</p>
        </div>

        <div className="progress-body">
          {/* Analytics Section with Circular Progress */}
          <div className="analytics-section">
            <div className="stats-card">
              <h3 className="text-xl text-cyan-400">Total Deployments</h3>
              <p className="text-4xl">{deploymentStats.total}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-xl text-cyan-400">Success Rate</h3>
              <div className="circular-progress">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Success', value: deploymentStats.success },
                        { name: 'Failure', value: deploymentStats.failure }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value" // This ensures the correct value is displayed
                    >
                      {['#00FF00', '#FF4D4D'].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="stats-card">
              <h3 className="text-xl text-cyan-400">Failure Rate</h3>
              <div className="circular-progress">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Failure', value: deploymentStats.failure },
                        { name: 'Success', value: deploymentStats.success }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value" // This ensures the correct value is displayed
                    >
                      {['#FF4D4D', '#00FF00'].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Log Area */}
          <div className="log-area">
            <Label className="text-white">Logs</Label>
            <Textarea
              className="log-textarea"
              value={logs.join("\n")}
              readOnly
              style={{
                color: '#dcdcdc',
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                letterSpacing: '1px',
                wordWrap: 'break-word',
              }}
            />
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Action Buttons */}
          {isDeploying ? (
            <div className="action-buttons">
              <Button onClick={handleCancel} className="btn-cancel">Cancel Deployment</Button>
              <Button onClick={() => navigate("/dashboard")} className="btn-dashboard">View Dashboard</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/")} className="btn-home">Go Back Home</Button>
          )}
        </div>

        {/* Advertisements Section */}
        <div className="advertisement-section">
          <div className="advertisement-card">
            <h4>🚀 Try Our Cloud Services Today!</h4>
            <p>Experience seamless deployments with low latency and high performance. Sign up now and get 20% off your first 3 months!</p>
            <Button onClick={() => navigate("/cloud-services")} className="btn-signup">Sign Up</Button>
          </div>
          <div className="advertisement-card">
            <h4>🔒 Secure Your Applications</h4>
            <p>Ensure your deployment is always safe and secure. Learn how our service protects you from threats.</p>
            <Button onClick={() => navigate("/security")} className="btn-signup">Learn More</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeploymentProgress;

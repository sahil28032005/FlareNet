import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./DeploymentProgress.css";
import NavBar from "../NavBar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

const DeploymentProgress = () => {
  const location = useLocation();
  const { autoDeploy, gitUrl } = location.state || {};
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [deploymentStats, setDeploymentStats] = useState({ success: 70, failure: 30, total: 100 });
  const navigate = useNavigate();
  const { id } = useParams();

  const COLORS = ["#00FF00", "#FF4D4D"];

  const createWebhook = async () => {
    if (!gitUrl) {
      alert("Git URL is required to create a webhook.");
      return;
    }

    const gitUrlPattern = /^(?:https?:\/\/|git@)github\.com[:/](?<owner>[^/]+)\/(?<repo>[^.]+)(?:\.git)?$/;
    const match = gitUrl.match(gitUrlPattern);
    const oAuthToken = localStorage.getItem("github_token");

    if (!oAuthToken || !match?.groups) {
      alert("Invalid Git URL or missing OAuth token.");
      return;
    }

    const { owner, repo } = match.groups;
    const requestBody = { repo, oauthToken: oAuthToken, owner };

    try {
      const webhookCreated = localStorage.getItem("webhookCreated");
      if (webhookCreated) return;

      await axios.post("http://localhost:5000/api/github/create-webhook", requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("webhookCreated", "true");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (autoDeploy) createWebhook();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getLogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLogs((prevLogs) =>
            Array.from(new Set([...prevLogs, ...data.logs.map((log) => `Log ${log.event_id}: ${log.log}`)]))
          );
          setProgress(data.progress || progress);
          setDeploymentStats(data.stats || deploymentStats);
        }
      } catch (error) {
        console.error("Error fetching logs:", error.message);
      }
    };

    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [id, progress, deploymentStats]);

  const handleCancel = () => {
    setIsDeploying(false);
    navigate("/service");
  };

  return (
    <div className="deploy-progress-container">
      <NavBar />

      <div className="progress-header">
        <h2 className="text-5xl font-bold text-cyan-400 animate-glow">Deployment Progress</h2>
        <p className="text-lg text-gray-300">Live deployment logs and real-time analytics.</p>
      </div>

      <div className="progress-body">
        <div className="analytics-section">
          {["Total Deployments", "Success Rate", "Failure Rate"].map((label, index) => (
            <div className="stats-card" key={index}>
              <h3 className="text-xl text-cyan-400">{label}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Success", value: deploymentStats.success },
                      { name: "Failure", value: deploymentStats.failure },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, idx) => (
                      <Cell key={idx} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <div className="log-area">
          <div className="terminal">
            <div className="terminal-live-badge">LIVE</div>
            {logs.map((log, index) => (
              <div key={index} className={`log-line log-level-${index % 2 === 0 ? "success" : "error"}`}>
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="action-buttons">
          {isDeploying ? (
            <>
              <Button onClick={handleCancel} className="btn-cancel">
                Cancel Deployment
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="btn-dashboard">
                View Dashboard
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/")} className="btn-home">
              Go Back Home
            </Button>
          )}
        </div>
      </div>

      <div className="advertisement-section">
        {["/assects/images/photoShowcase.png", "/assects/images/showCase.png"].map((img, idx) => (
          <div
            className={`advertisement-card floating-${idx % 2 === 0 ? "right" : "left"}`}
            key={idx}
          >
            <img src={img} alt="Ad" className="ad-image" />
            <h4 className="ad-title">{idx === 0 ? "🚀 Try Our Cloud Services!" : "🔒 Secure Your Applications!"}</h4>
            <p className="ad-description">
              {idx === 0
                ? "Experience seamless deployments. Sign up now for 20% off!"
                : "Ensure your applications stay secure. Learn more."}
            </p>
            <Button className="btn-signup">{idx === 0 ? "Sign Up" : "Learn More"}</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentProgress;

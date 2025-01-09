import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";
import "./ProjectsPage.css";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [ownerId, setOwnerId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", gitUrl: "", description: "", ownerId: 1 });
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [userRepos, setUserRepos] = useState([]);
    const [expanded, setExpanded] = useState(false);

    // Add this inside a `useEffect` in your `ProjectsPage` component to handle the canvas animation:

    useEffect(() => {
        const canvas = document.getElementById('animated-canvas');
        const ctx = canvas.getContext('2d');
        const circles = [];
        const maxCircles = 10;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight; // Use the full height of the viewport
        };


        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Circle {
            constructor(x, y, radius, speed, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.speed = speed;
                this.color = color;
            }

            update() {
                this.x += Math.cos(this.speed) * 2;
                this.y += Math.sin(this.speed) * 2;

                if (this.x > canvas.width) this.x = 0;
                if (this.y > canvas.height) this.y = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
        }

        const createCircles = () => {
            for (let i = 0; i < maxCircles; i++) {
                const radius = Math.random() * 20 + 10;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const speed = Math.random() * Math.PI * 2;
                const color = `hsl(${Math.random() * 360}, 100%, 75%)`;
                circles.push(new Circle(x, y, radius, speed, color));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circles.forEach((circle) => {
                circle.update();
                circle.draw();
            });
            requestAnimationFrame(animate);
        };

        createCircles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    // Fetch user's previous projects
    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:5000/projects/${ownerId}`);
    //             if (response.data.success) {
    //                 setProjects(response.data.data);
    //             }
    //         } catch (e) {
    //             console.error("Error fetching projects:", e.message);
    //         }
    //     };
    //     fetchProjects();
    // }, [ownerId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = document.querySelectorAll(".modern-card");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);


    // Fetch user info and repos if access token is available
    useEffect(() => {
        const accessToken = localStorage.getItem('github_token');
        if (accessToken) {
            const fetchUserInfo = async () => {
                try {
                    const userInfoResponse = await axios.get(`http://localhost:5000/api/github/user-info?accessToken=${accessToken}`);
                    if (userInfoResponse.data) {
                        setUserInfo(userInfoResponse.data);
                    }
                    const userReposResponse = await axios.get(`http://localhost:5000/api/github/user-repos?accessToken=${accessToken}`);
                    if (userReposResponse.data) {
                        setUserRepos(userReposResponse.data);
                    }
                } catch (err) {
                    console.error("Error fetching user info", err.message);
                }
            };
            fetchUserInfo();
        }
    }, []);

    //handle github authorization here
    useEffect(() => {
        const fetchAccessToken = async (code) => {
            try {
                const response = await axios.post(`http://localhost:5000/api/github/token?code=${code}`);
                if (response.data.success) {
                    const token = response.data.accessToken;
                    localStorage.setItem('github_token', token); // Store token in localStorage
                    alert("github authorization successful!");
                    //optionally save response,data to localstoragr or context
                }
                else {
                    alert("github authorization failed!");
                }
            }
            catch (e) {
                console.error("Error fetching access token: " + e.message);
            }
        }

        //check weather code is present in query parameter
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (code) {
            fetchAccessToken(code);
        }
    }, [location.search]);

    const handleCreateProject = async () => {
        if (newProject.name && newProject.gitUrl && newProject.description) {
            try {
                setIsLoading(true);
                const response = await axios.post("http://localhost:5000/create-project", newProject);
                if (response.data.success) {
                    setProjects([...projects, newProject]);
                    setNewProject({ name: "", gitUrl: "", description: "", ownerId: newProject.ownerId });
                    alert(response.data.message);
                } else {
                    alert("Failed to create project");
                }
            } catch (e) {
                alert("Error: " + e.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please fill in all fields!");
        }
    };

    const handleAuthorizationWithGithub = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/github/auth-url");
            if (response.data.success && response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                alert("Failed to fetch authorization URL");
            }
        } catch (e) {
            console.error("Error initiating GitHub authorization", e.message);
        }
    };

    return (
        <div className="projects-page">
            <div className="projects-container">
                <h2 className="title">Welcome to Your Projects</h2>

                <div className="authorize-container">
                    <button onClick={handleAuthorizationWithGithub} className="authorize-button">
                        <FaGithub className="github-icon" />
                        Authorize with GitHub
                    </button>
                </div>

                {/* User Information Section */}
                {userInfo && (
                    <Card className="user-info-card modern-card">
                        <CardHeader>
                            <div className="user-info-header modern-header">
                                <div className="avatar-container">
                                    <Avatar className="modern-avatar">
                                        <AvatarImage src={userInfo.avatar_url} alt={userInfo.name} />
                                    </Avatar>
                                </div>
                                <div className="user-details">
                                    <h3 className="user-name">{userInfo.name}</h3>
                                    <p className="user-login">@{userInfo.login}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="user-bio">{userInfo.bio || "No bio available"}</p>
                            <div className="stats-container">
                                <div className="stat">
                                    <p className="stat-value">{userInfo.public_repos}</p>
                                    <p className="stat-label">Repositories</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-value">{userInfo.followers}</p>
                                    <p className="stat-label">Followers</p>
                                </div>
                                <div className="stat">
                                    <p className="stat-value">{userInfo.following}</p>
                                    <p className="stat-label">Following</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}


                {/* User Repositories Section */}
                {userRepos.length > 0 && (
                    <div className="user-repos-section modern-scroll">
                        <h3 className="subtitle">Your GitHub Repositories</h3>
                        <div className="repo-list modern-grid">
                            {userRepos.slice(0, expanded ? userRepos.length : 4).map((repo, index) => (
                                <Card
                                    key={repo.id}
                                    className="repo-card modern-card"
                                    style={{
                                        animationDelay: `${index * 0.15}s`,
                                    }}
                                >
                                    <CardHeader className="repo-card-header">
                                        <h3 className="repo-name">{repo.name}</h3>
                                    </CardHeader>
                                    <CardContent className="repo-card-content">
                                        <p className="repo-description">
                                            {repo.description || "No description available"}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="repo-card-footer">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="repo-link"
                                        >
                                            View on GitHub
                                        </a>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="repo-link"
                                        >
                                            Import
                                        </a>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        {userRepos.length > 4 && !expanded && (
                            <Button
                                onClick={() => setExpanded(true)}
                                className="expand-button modern-button"
                            >
                                View More Repositories
                            </Button>
                        )}
                        {expanded && (
                            <Button
                                onClick={() => setExpanded(false)}
                                className="expand-button modern-button"
                            >
                                View Less
                            </Button>
                        )}
                    </div>
                )}


                {/* <div className="projects-list">
                    <h3 className="subtitle">Your Projects</h3>
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <h3 className="project-title">{project.name}</h3>
                            <p className="project-description">{project.description}</p>
                            <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                View on GitHub <FaGithub />
                            </a>
                            <button onClick={() => navigate(`/service/${project.id}`)} className="project-deploy-button">
                                Deploy Service
                            </button>
                        </div>
                    ))}
                </div> */}

                <div className="create-project-form">
                    <h3 className="form-title">Create a New Project</h3>
                    <Label className="form-label">Project Name</Label>
                    <Input
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="input-field"
                    />
                    <Label className="form-label">Git URL</Label>
                    <Input
                        placeholder="Enter GitHub URL"
                        value={newProject.gitUrl}
                        onChange={(e) => setNewProject({ ...newProject, gitUrl: e.target.value })}
                        className="input-field"
                    />
                    <Label className="form-label">Description</Label>
                    <Textarea
                        placeholder="Describe the project"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="textarea-field"
                    />
                    <div className="form-actions">
                        <Button onClick={handleCreateProject} className="create-button">
                            Create Project
                        </Button>
                        <Button onClick={() => navigate("/")} className="back-button">
                            Go Back Home
                        </Button>
                    </div>
                </div>
            </div>

            {/* Animated Circles Canvas */}
            <div className="canvas-container">
                <canvas id="animated-canvas" />
            </div>
        </div>
    );
};

export default ProjectsPage;

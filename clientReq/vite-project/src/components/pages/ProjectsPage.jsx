import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaGithub } from "react-icons/fa";
import "./ProjectsPage.css";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [ownerId, setOwnerId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", gitUrl: "", description: "", ownerId: 1 });
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(null); // User info state
    const [userRepos, setUserRepos] = useState([]); // User repositories state

    // Fetch user's previous projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/projects/${ownerId}`);
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (e) {
                console.error("Error fetching projects:", e.message);
            }
        };
        fetchProjects();
    }, [ownerId]);

    //fetch user info and repos if access token is avaliable
    useEffect(() => {
        const accessToken = localStorage.getItem('github_token');
        if (accessToken) {
            console.log("Access token found in localStorage:", accessToken);
            const fetchUserInfo = async () => {
                try {
                    const userInfoResponse = await axios.get(`http://localhost:5000/api/github/user-info?accessToken=${accessToken}`);
                    console.log("uresponse", userInfoResponse);
                    if (userInfoResponse.data) {
                        console.log("inside if");
                        setUserInfo(userInfoResponse.data);
                    }

                    const userReposResponse = await axios.get(`http://localhost:5000/api/github/user-repos?accessToken=${accessToken}`);
                    if (userReposResponse.data) {
                        setUserRepos(userReposResponse.data);
                    }
                }
                catch (err) {
                    console.error("Error fetching user info", err.message);
                }
            }
            fetchUserInfo();
        }


    }, []);

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
    //after authorize button click
    const handleAuthorizationWithGithub = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/github/auth-url");
            if (response.data.success && response.data.authUrl) {
                window.location.href = response.data.authUrl; // Redirect to GitHub authorization page
            }
            else {
                alert("failed to fetch authorization url");
            }
        }
        catch (e) {
            console.error("Error initiating github authorization", e.message);
        }

    }

    return (
        <div className="projects-page">
            {console.log("userInfo", userInfo)}
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
                    <Card className="user-info-card">
                        <CardHeader>
                            <div className="user-info-header">
                                {/* <img src={userInfo.avatar_url} alt={userInfo.name} /> */}
                                <Avatar>
                                    <AvatarImage src={userInfo.avatar_url} alt={userInfo.name} />
                                    {/* <AvatarFallback>{userName ? userName.charAt(0) : 'U'}</AvatarFallback> */}
                                </Avatar>
                                {/* <Avatar src={userInfo.avatar_url} alt={userInfo.name} /> */}
                                <div>
                                    <h3>{userInfo.name}</h3>
                                    <p>@{userInfo.login}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{userInfo.bio || "No bio available"}</p>
                            <p>Public Repositories: {userInfo.public_repos}</p>
                            <p>Followers: {userInfo.followers}</p>
                            <p>Following: {userInfo.following}</p>
                        </CardContent>
                    </Card>
                )}

                {/* User Repositories Section */}
                {userRepos.length > 0 && (
                    <div className="user-repos-section">
                        <h3 className="subtitle">Your GitHub Repositories</h3>
                        {userRepos.map((repo) => (
                            <Card key={repo.id} className="repo-card">
                                <CardHeader>
                                    <h3>{repo.name}</h3>
                                </CardHeader>
                                <CardContent>
                                    <p>{repo.description || "No description available"}</p>
                                </CardContent>
                                <CardFooter>
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                        View on GitHub
                                    </a>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="projects-list">
                    <h3 className="subtitle">Your Projects</h3>
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <h3 className="project-title">{project.name}</h3>
                            <p className="project-description">{project.description}</p>
                            <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                View on GitHub <FaGithub />
                            </a>
                            <button
                                onClick={() => navigate(`/service/${project.id}`)}
                                className="project-deploy-button"
                            >
                                Deploy Service
                            </button>
                        </div>
                    ))}
                </div>

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
        </div>
    );
};

export default ProjectsPage;

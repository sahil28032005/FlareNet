import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectsPage.css";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [ownerId, setOwnerId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", gitUrl: "", description: "", ownerId: 1 });
    const navigate = useNavigate();

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

    return (
        <div className="projects-page">
            <div className="projects-container">
                <h2 className="title">Previous Projects</h2>
                <div className="projects-list">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <h3 className="project-title">{project.name}</h3>
                            <p className="project-description">{project.description}</p>
                            <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                View on GitHub
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
                    <h3 className="form-title">Create New Project</h3>
                    <Label>Project Name</Label>
                    <Input
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <Label>Git URL</Label>
                    <Input
                        placeholder="Enter GitHub URL"
                        value={newProject.gitUrl}
                        onChange={(e) => setNewProject({ ...newProject, gitUrl: e.target.value })}
                    />
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Describe the project"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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

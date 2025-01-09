import React from "react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import './projectLister.css';
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectLister = () => {
    const [ownerId, setOwnerId] = useState(1);
    const [projects, setProjects] = useState([]);

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
    return (
        <div className="project-lister-page">
            <header className="page-header">
                <h1 className="page-title">Your Projects</h1>
                <p className="page-subtitle">
                    A collection of all the projects you've worked on. Manage, update, or share them with ease.
                </p>
            </header>
            <div className="projects-list">
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
            </div>
        </div>
    );
};

const handleView = (project) => {
    console.log(`Viewing project: ${project.name}`);
    // Add custom view logic here
};

const handleEdit = (project) => {
    console.log(`Editing project: ${project.name}`);
    // Add custom edit logic here
};

export default ProjectLister;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import "./projectLister.css";
import NavBar from "../NavBar";
import Footer from "../Footer";

const ProjectLister = () => {
    const [ownerId] = useState(1);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    // Fetch user's projects
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
        <>
            <NavBar />
            <div className="project-lister-page">
                <motion.header
                    className="page-header"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="page-title">Your Projects</h1>
                    <p className="page-subtitle">Manage and explore your projects with ease.</p>
                </motion.header>

                <motion.div
                    className="projects-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="project-card"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className="project-card-header">
                                <h3 className="project-name">{project.name}</h3>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-card-footer">
                                <a
                                    href={project.gitUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-action-button view-button"
                                >
                                    View on GitHub <FaGithub />
                                </a>
                                <button
                                    onClick={() => navigate(`/service/${project.id}`)}
                                    className="project-action-button deploy-button"
                                >
                                    Deploy
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <Footer/>
            </>
    );
};

export default ProjectLister;

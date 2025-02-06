import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import "./projectLister.css";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { useUser } from "../../context/userContext";

const ProjectLister = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const { user } = useUser();  // Access user from context

    // Fetch user's projects
    useEffect(() => {
        if (!user?.id) {
            console.log("No user is logged in!");
            navigate("/login");
            return;
        }
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/projects/${user.id}`);
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (e) {
                console.error("Error fetching projects:", e.message);
            }
        };
        fetchProjects();
    }, [user, navigate]);

    return (
        <>
            {/* <NavBar /> */}
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
                                <button
                                    onClick={()=>{navigate('/projectDetails/${project.id}')}}   //navigate to project description page which is already created or deployed on this page plan to show users previous deployents,rollbaack,commmit,etc features in future scope and showw current depployement triggerd throuugh webHook worker
                                    className="project-action-button view-button"
                                >
                                    View on GitHub <FaGithub />
                                </button>
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
        </>
    );
};

export default ProjectLister;

import React, { useState, useEffect } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiTerminal, FiGitBranch } from "react-icons/fi";

const DeployForm = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [gitUrl, setGitUrl] = useState("");
    const [projectName, setProjectName] = useState("");
    const [envVariables, setEnvVariables] = useState([{ key: "", value: "" }]);
    const [framework, setFramework] = useState("");
    const [autoDeploy, setAutoDeploy] = useState(false);
    const [isReactProject, setIsReactProject] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [detectedFramework, setDetectedFramework] = useState("");
    const [customBuildCommand, setCustomBuildCommand] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (detectedFramework.buildCommand) {
            setCustomBuildCommand(detectedFramework.buildCommand);
        }
    }, [detectedFramework]);

    const handleAddEnvVariable = () => {
        setEnvVariables([...envVariables, { key: "", value: "" }]);
    };

    const handleEnvVariableChange = (index, field, value) => {
        const updatedEnvVariables = [...envVariables];
        updatedEnvVariables[index][field] = value;
        setEnvVariables(updatedEnvVariables);
    };

    const handleFrameworkChange = (value) => {
        setFramework(value);
    };

    const handleAutoDeployChange = () => {
        setAutoDeploy(!autoDeploy);
    };

    const fetchProjectDetails = async () => {
        try {
            if (!gitUrl) return;

            const match = gitUrl.match(/github\.com\/([^/]+)\/([^/.]+)(?:\.git)?/);
            const owner = match ? match[1] : null;
            const repo = match ? match[2] : null;

            const githubToken = localStorage.getItem('github_token');
            if (!githubToken) {
                throw new Error('GitHub token not found in localStorage');
            }

            const response = await axios.get("http://localhost:5000/api/validdeployment/validate-react", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${githubToken}`
                },
                params: { owner, repo }
            });

            if (response.data.message === "Valid React project") {
                setIsReactProject(true);
                setDetectedFramework(response.data.framework);
                setValidationError("");
            } else {
                setIsReactProject(false);
                setValidationError(response.data.message);
            }
        }
        catch (error) {
            console.error("Error validating project:", error);
            setValidationError("Error validating project. Please check the Git URL and token.");
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [gitUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id) {
            alert("Project ID is missing. Cannot deploy.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: id,
                    gitUrl,
                    framework,
                    autoDeploy,
                    envVariables,
                    buildCommand: customBuildCommand,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                navigate(`/progress/${responseData.data.deploymentId}`, {
                    state: { autoDeploy, gitUrl },
                });
            } else {
                const errorData = await response.json();
                alert(`Deployment failed: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            alert("An error occurred while deploying the project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/project/${id}`);
                const project = await response.json();
                if (response.ok) {
                    setGitUrl(project.gitUrl || "");
                    setProjectName(project.name || "");
                    setEnvVariables(project.envVariables || [{ key: "", value: "" }]);
                    setFramework(project.framework || "");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        if (id) fetchProject();
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-900 to-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-xl"
            >
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent text-center">
                    Deploy Your Project
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {validationError && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 p-3 bg-red-900/50 rounded-lg border border-red-400/30"
                            >
                                <FiXCircle className="flex-shrink-0 text-red-400" />
                                <span className="text-red-200 text-sm">{validationError}</span>
                            </motion.div>
                        )}

                        {isReactProject && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-green-900/20 rounded-lg border border-green-400/30"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <FiCheckCircle className="text-green-400" />
                                    <span className="font-semibold text-green-200">
                                        Valid {detectedFramework.framework} Project
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm text-green-100">Build Command</Label>
                                    <div className="flex gap-2 items-center">
                                        <FiTerminal className="text-green-400" />
                                        <Input
                                            value={customBuildCommand}
                                            onChange={(e) => setCustomBuildCommand(e.target.value)}
                                            className="font-mono bg-gray-800 border-gray-700 hover:border-green-400/50 focus:border-green-400"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-gray-300">Git Repository URL</Label>
                            <div className="flex items-center gap-2">
                                <FiGitBranch className="text-gray-400" />
                                <Input
                                    value={gitUrl}
                                    onChange={(e) => setGitUrl(e.target.value)}
                                    placeholder="https://github.com/username/repository"
                                    className="bg-gray-800 border-gray-700 hover:border-green-400/50 focus:border-green-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Project Name</Label>
                            <Input
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="bg-gray-800 border-gray-700 hover:border-green-400/50 focus:border-green-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Framework</Label>
                            <Select onValueChange={handleFrameworkChange}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 hover:border-green-400/50">
                                    <SelectValue placeholder="Select framework" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {["react", "nextjs", "angular", "vue"].map((fw) => (
                                        <SelectItem
                                            key={fw}
                                            value={fw}
                                            className="hover:bg-gray-700 focus:bg-gray-700 capitalize"
                                        >
                                            {fw}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Environment Variables</Label>
                            <div className="space-y-3">
                                {envVariables.map((env, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3"
                                    >
                                        <Input
                                            placeholder="Key"
                                            value={env.key}
                                            onChange={(e) => handleEnvVariableChange(index, "key", e.target.value)}
                                            className="bg-gray-800 border-gray-700"
                                        />
                                        <Input
                                            placeholder="Value"
                                            value={env.value}
                                            onChange={(e) => handleEnvVariableChange(index, "value", e.target.value)}
                                            className="bg-gray-800 border-gray-700"
                                        />
                                    </motion.div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={handleAddEnvVariable}
                                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/30"
                                >
                                    Add Variable +
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoDeploy}
                                    onChange={handleAutoDeployChange}
                                    className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${autoDeploy ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform transform ${autoDeploy ? 'translate-x-5 bg-white' : 'bg-gray-200'}`} />
                                </div>
                            </label>
                            <span className="text-gray-300">Enable Auto Deployment</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isReactProject || isSubmitting}
                        className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 border border-green-400/30 transition-all"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                                Deploying...
                            </div>
                        ) : (
                            "Deploy Project"
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default DeployForm;
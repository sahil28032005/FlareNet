import React, { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../ui/select";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import "./DeployForm.css";

const DeployForm = () => {
    const navigate = useNavigate();
    const [gitUrl, setGitUrl] = useState("");
    const [projectName, setProjectName] = useState("");
    const [envVariables, setEnvVariables] = useState([{ key: "", value: "" }]);
    const [framework, setFramework] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            gitUrl,
            projectName,
            envVariables,
            framework,
        };
        console.log("Form Data:", formData);
    };

    return (
        <div
            style={{
                width: "100vw",
                background: "linear-gradient(145deg, #111111, #1c1c1c)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "inset 0 0 50px rgba(255, 255, 255, 0.1)",
                paddingTop: "50px", // Add padding to create space from the top
                paddingBottom: "50px", // Add padding to create space from the bottom
            }}
        >
            <div
                className="deploy-form-container bg-gray-900 text-white p-10 rounded-lg shadow-2xl"
                style={{
                    maxWidth: "600px",
                    width: "90%",
                    boxShadow: "0 0 20px rgba(0, 255, 85, 0.6)",
                    background:
                        "linear-gradient(145deg, rgba(0,0,0,1) 0%, rgba(34,34,34,1) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    marginTop: "20px", // Create extra breathing space
                }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Deploy Your Project
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Label htmlFor="git-url" className="text-sm font-semibold">
                            Git Repository URL
                        </Label>
                        <Input
                            id="git-url"
                            type="text"
                            placeholder="Enter your Git URL"
                            value={gitUrl}
                            onChange={(e) => setGitUrl(e.target.value)}
                            className="mt-2 w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="project-name" className="text-sm font-semibold">
                            Project Name
                        </Label>
                        <Input
                            id="project-name"
                            type="text"
                            placeholder="Enter your project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="mt-2 w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="framework" className="text-sm font-semibold">
                            Framework
                        </Label>
                        <Select onValueChange={handleFrameworkChange}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Select a framework" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="react">React</SelectItem>
                                <SelectItem value="nextjs">Next.js</SelectItem>
                                <SelectItem value="angular">Angular</SelectItem>
                                <SelectItem value="vue">Vue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-6">
                        <Label className="text-sm font-semibold">
                            Environment Variables
                        </Label>
                        {envVariables.map((env, index) => (
                            <div key={index} className="flex gap-4 mt-4">
                                <Input
                                    type="text"
                                    placeholder="Key"
                                    value={env.key}
                                    onChange={(e) =>
                                        handleEnvVariableChange(index, "key", e.target.value)
                                    }
                                    className="flex-1"
                                />
                                <Input
                                    type="text"
                                    placeholder="Value"
                                    value={env.value}
                                    onChange={(e) =>
                                        handleEnvVariableChange(index, "value", e.target.value)
                                    }
                                    className="flex-1"
                                />
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={handleAddEnvVariable}
                            className="mt-4 bg-yellow-500 text-black hover:bg-yellow-600"
                        >
                            Add Variable
                        </Button>
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="project-info" className="text-sm font-semibold">
                            Project Information
                        </Label>
                        <Textarea
                            id="project-info"
                            placeholder="Enter basic information about your project"
                            className="mt-2 w-full"
                        />
                    </div>

                    <Button
                        onClick={() => { navigate("/progress") }}
                        type="submit"
                        className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                    >
                        Deploy Project
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default DeployForm;

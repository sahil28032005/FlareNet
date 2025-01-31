const axios = require('axios');
const { Octokit } = require("@octokit/core"); // Import Octokit
//use octakit as github officials siuggest that
const validateReactProject = async (req, res) => {
    const { owner, repo } = req.query;  // Get repo details from query params
    const githubToken = req.headers.authorization; // Extract token from headers

    if (!githubToken) {
        return res.status(401).json({ message: "GitHub token is required!" });
    }
    if (!owner || !repo) {
        return res.status(400).json({ message: "Owner and repo are required!" });
    }
    try {
        const packageJson = await getPackageJson(owner, repo, githubToken);
        console.log("packageJson", packageJson);
        if (!packageJson) {
            return res.status(404).json({ message: "package.json not found" });
        }

        const isReact = packageJson.dependencies?.react || packageJson.devDependencies?.react;
        const framework = detectReactFramework(packageJson);

        if (!isReact) {
            return res.status(400).json({ message: "This is not a React project!" });
        }

        res.json({ message: "Valid React project", framework });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
//detect as subSection of which type of react project is this vie/next/create-react/etc.
const detectReactFramework = (packageJson) => {
    if (packageJson.dependencies?.vite || packageJson.devDependencies?.vite) {
        return "vite";
    } else if (packageJson.dependencies?.["react-scripts"]) {
        return "create-react-app";
    } else if (packageJson.dependencies?.next) {
        return "next.js";
    } else if (packageJson.dependencies?.gatsby) {
        return "gatsby";
    } else {
        return "unknown";
    }
};

//helper methodsfo github api and shnnc with auth tookens
const getPackageJson = async (owner, repo, githubToken) => {
    try {
        //creating octakit instance here usng token
        const octokit = new Octokit({
            auth: githubToken // Replace with your token
        });

        console.log('Getting package json method');
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,   // Your GitHub username
            repo: repo, // Your repository
            path: 'package.json',     // Path to package.json file
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        // Decode base64 content
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return JSON.parse(content);
        console.log(JSON.parse(content)); // Parsed package.json
    } catch (error) {
        console.error("Error fetching package.json:", error);
        return null;
    }
};
module.exports = {
    validateReactProject
};
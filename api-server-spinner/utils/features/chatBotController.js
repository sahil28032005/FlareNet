const { llm, memory } = require("../langchainConfig");
const { createAgent } = require("../langchainConfig");
const { prisma } = require("../prismaClient");

const userSessions = {}; // Store user progress (Consider Redis for scalability)

const chatbotController = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!userId) return res.status(400).json({ message: "User ID is required." });

        if (!userSessions[userId]) userSessions[userId] = {};
        let session = userSessions[userId];

        console.log(`👤 User ${userId} Session:`, session);

        // Construct a prompt dynamically based on missing information
        let missingParams = [];
        if (!session.name) missingParams.push("project name");
        if (!session.gitUrl) missingParams.push("Git URL");
        if (!session.description) missingParams.push("project description");
        if (!session.ownerId) missingParams.push("owner ID");

        let aiPrompt;
        if (missingParams.length > 0) {
            aiPrompt = `The user has provided some details but is missing ${missingParams.join(", ")}. 
            Ask for the missing details in a **funny and conversational** way. Keep responses short, engaging, and natural.`;
        } else {
            aiPrompt = `Summarize the collected project details and ask the user to confirm before proceeding. Make it sound witty and engaging.`;
        }

        // Create LLM agent and generate a response
        const agent = await createAgent(llm, memory);
        const result = await agent.invoke({ input: `${aiPrompt}\nUser Input: ${message}` });

        console.log("📝 LLM Output:", result.output);
        
        // Extract any provided details
        const extractedParams = extractParams(result.output);
        Object.assign(session, extractedParams); // Update session with new info

        // If everything is collected, confirm before deployment
        if (!session.confirmed && !missingParams.length) {
            session.confirmed = true;
            return res.json({
                reply: `🔥 Here's what we've got:\n- **Project Name:** ${session.name}\n- **Git URL:** ${session.gitUrl}\n- **Description:** ${session.description}\n- **Owner ID:** ${session.ownerId}\n\nLooks good? Type **"confirm"** to start deployment 🚀!`,
            });
        }

        // If user confirms, proceed with deployment
        if (message.toLowerCase() === "confirm") {
            const createdProject = await prisma.project.create({
                data: {
                    name: session.name,
                    gitUrl: session.gitUrl,
                    description: session.description,
                    ownerId: parseInt(session.ownerId),
                },
            });

            console.log("✅ Project Created:", createdProject);

            session.completed = true; // Reset session

            return res.json({
                reply: `🎉 Boom! Project **"${createdProject.name}"** is now live. Time to build greatness! 💪`,
                projectId: createdProject.id,
            });
        }

        // Continue the conversation
        return res.json({ reply: result.output });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function to extract parameters dynamically
const extractParams = (text) => {
    const params = {};
    const patterns = {
        name: /project name:\s*([^\n]+)/i,
        gitUrl: /Git URL:\s*<?\s*(https?:\/\/[^\s>]+)\s*>?/i,
        description: /project description:\s*([^\n]+)/i,
        ownerId: /owner ID:\s*(\d+)/i
    };

    Object.entries(patterns).forEach(([key, regex]) => {
        const match = text.match(regex);
        if (match) params[key] = match[1].trim();
    });

    return params;
};

module.exports = { chatbotController };

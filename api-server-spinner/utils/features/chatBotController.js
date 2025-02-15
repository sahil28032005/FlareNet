const { llm, memory } = require("../langchainConfig");
const { createAgent } = require("../langchainConfig");
const { runDeploymentWorkflow } = require("./langGraphController");

// Add parameter collection prompt to existing setup
const DEPLOYMENT_PROMPT = `Your role: Collect deployment parameters:
- name: Ask for project name first
- gitUrl: Request Git URL next
- description: Ask for description
- ownerId: Finally request owner ID

When all parameters are provided, confirm deployment.`;

const chatbotController = async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        // 1. Maintain your existing permission check
        // const user = await verifyUserPermissions(userId);
        
        // 2. Keep your original agent creation
        console.log("🔍 Creating LLM Agent...");
        const agent = await createAgent(llm, memory);
        
        // 3. Add parameter collection through prompt engineering
        const processedMessage = `${DEPLOYMENT_PROMPT}\nUser Input: ${message}`;
        
        // 4. Maintain your original invocation format
        const result = await agent.invoke({
            input: processedMessage // Keep single input key
        });

        // 5. Add parameter extraction from response
        const deploymentParams = extractParams(result.output);
        console.log("Extracted Parameters:", deploymentParams);
        
        // 6. Your existing workflow integration
        if (1) {
            console.log("🚀 Running Deployment Workflow...");
            const workflowResult = await runDeploymentWorkflow(
                { id: 1 }, 
                {
                  name: 'test',
                  gitUrl: 'https://github.com/valid/repo',
                  ownerId: '123'
                }
            );
            return res.json({
                reply: `Deployment ${workflowResult.deployment_status}`,
                aiReply: result.output
            });
        }

        console.log("Not found necessary parameters");

        // 7. Maintain original response format
        res.json({
            reply: result.output,
            chatHistory: await memory.loadMemoryVariables({})
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to extract parameters
const extractParams = (text) => {
    const params = {};
    const patterns = {
        name: /project name:\s*([^\n<]+)/i,
        gitUrl:/git\s*(?:URL|url):\s*<?\s*(https?:\/\/(?:www\.)?github\.com\/[^\s\/>]+\/[^\s\/>]+(?:\.git)?)\/*>\s*>?/i,
        description: /description:\s*([^\n<]+)/i,
        ownerId: /owner (?:ID|id):\s*(\d+)/i
    };
    
    Object.entries(patterns).forEach(([key, regex]) => {
        const match = text.match(regex);
        if (match) params[key] = match[1].trim();
    });
    
    console.log("Extracted Parameters:", params); // Add debug logging
    return params;
};

module.exports = { chatbotController };
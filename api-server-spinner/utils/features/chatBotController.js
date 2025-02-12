const { llm, memory } = require("../langchainConfig");
const { createAgent } = require("../langchainConfig");
const { runDeploymentWorkflow } = require("./langGraphController");

//in this file before creating deployment verifit user has necessary permsiions to create deployments and halt user heree itself instde of going further setup

const chatbotController = async (req, res) => {
    try {
        const { message, userId } = req.body;
        // const user = await verifyUserPermissions(userId);

        // Load previous chat history to check if messages are stored
        const prevChatHistory = await memory.loadMemoryVariables({});
        console.log("Chat History Before:", prevChatHistory);

        console.log("🔍 Creating LLM Agent...");
        const agent = await createAgent(llm, memory);
        console.log("agent created", agent);

        console.log("🧠 Processing User Input...");
        const result = await agent.invoke({
            input: message,  // Process user message
        });

        console.log("💬 LLM Response:", result.output);

        // return;
        // Load memory after message processing
        const updatedChatHistory = await memory.loadMemoryVariables({});
        console.log("Chat History After:", updatedChatHistory);

        // Simulate user permissions (fetch from DB in real case)
        const user = { id: userId, hasDeploymentAccess: true };

        console.log("going to workflow....");
        // Run the LangGraph Workflow with LLM response
        const workflowResult = await runDeploymentWorkflow(user, result.output);

        console.log("sorkflow executed successfully...");

        res.json({
            reply: `Deployment ${workflowResult.deployment_status}`,
            chatHistory: workflowResult.chat_history,
            aiReply: result.output
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { chatbotController };



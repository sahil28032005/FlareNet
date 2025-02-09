const { llm, memory } = require("../langchainConfig");
const { createAgent } = require("../langchainConfig");

const chatbotController = async (req, res) => {
    try {
        const { message, userId } = req.body;
        // const user = await verifyUserPermissions(userId);

        // Load previous chat history to check if messages are stored
        const prevChatHistory = await memory.loadMemoryVariables({});
        console.log("Chat History Before:", prevChatHistory);

        console.log("creating agent");
        const agent = await createAgent(llm, memory);
        console.log("agent created", agent);
        const result = await agent.invoke({
            input: message,
            // userContext: {
            //     projects: user.projects,
            //     permissions: user.accessLevel
            // }
        });
        
        // Load memory after message processing
        const updatedChatHistory = await memory.loadMemoryVariables({});
        console.log("Chat History After:", updatedChatHistory);

        res.json({
            reply: result.output,
            actions: result.intermediateSteps
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { chatbotController };



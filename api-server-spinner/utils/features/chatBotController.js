const { llm } = require("../langchainConfig");
const { createAgent } = require("../langchainConfig");

const chatbotController = async (req, res) => {
    try {
        const { message, userId } = req.body;
        // const user = await verifyUserPermissions(userId);

        const agent = await createAgent();
        const result = await agent.invoke({
            input: message,
            // userContext: {
            //     projects: user.projects,
            //     permissions: user.accessLevel
            // }
        });

        res.json({
            reply: result.output,
            actions: result.intermediateSteps
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { chatbotController };



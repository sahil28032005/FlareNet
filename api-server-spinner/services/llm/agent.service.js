const { tool } = require("@langchain/core/tools");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { deploymentTool } = require("../chat/tools/deployment.tool");

const createAdvancedAgent = async (llm, memory) => {
    if (!llm || !memory) {
        throw new Error("LLM or Memory is not properly initialized.");
    }

    const tools = [
        deploymentTool,
        // Add other tools here
    ];

    // Updated prompt setup
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are an advanced deployment assistant...`],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
    ]);

    // Create agent using the new OpenAI function-based approach
    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools,
        prompt,
    });

    return new AgentExecutor({
        agent,
        tools,
        memory,
        returnIntermediateSteps: true,
    });
};

module.exports = { createAdvancedAgent };

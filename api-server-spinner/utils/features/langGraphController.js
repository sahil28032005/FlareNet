const { StateGraph } = require("@langchain/langgraph");
const { MemorySaver } = require("@langchain/langgraph");
const { createAgent, llm, memory } = require("../langchainConfig");

// Create memorySaver instance
const memorySaver = new MemorySaver();  

// ✅ Debugging Log
// console.log("Creating StateGraph with:", WorkflowState, memorySaver);

// ✅ Correct StateGraph Instantiation
// ✅ Correct StateGraph Configuration
const graph = new StateGraph({
    channels: {
      chat_history: {
        value: [],
        reducer: (prev, next) => [...prev, ...next],
        // aggregate: "append"
      },
      deployment_status: { value: "pending" },
      ai_response: { value: "" },
      user_message: { value: "" },
      user: { value: null }
    },
    memory: new MemorySaver()
  });
// ✅ Add MessagesAnnotation (before compiling)
// graph.addAnnotation(new MessagesAnnotation({ path: "chat_history" }));

// ✅ Step 1: LLM Processes the User Message
graph.addNode("processInputWithLLM", async (state) => {
    console.log("🔍 Creating LLM Agent...");
    const agent = await createAgent(llm, memory);

    console.log("🧠 LLM Processing User Input...");
    const result = await agent.invoke({
        input: state.user_message,  
    });

    console.log("💬 LLM Response:", result.output);
    return { ai_response: result.output };
});

// ✅ Step 2: Check User Permissions
graph.addNode("checkPermissions", async (state) => {
    if (!state.user || !state.user.hasDeploymentAccess) {
        throw new Error("User does not have permission to deploy.");
    }
    return { deployment_status: "approved" };
});

// // ✅ Step 3: Trigger Deployment
// graph.addNode("triggerDeployment", async (state) => {
//     console.log("🚀 Deploying app...");
//     return { deployment_status: "in_progress" };
// });

// // ✅ Step 4: Validate Deployment
// graph.addNode("validateDeployment", async (state) => {
//     const success = Math.random() > 0.2;
//     return { deployment_status: success ? "successful" : "failed" };
// });

// // ✅ Step 5: Store Chat History
// graph.addNode("logConversation", async (state) => {
//     return {
//         chat_history: [...state.chat_history, `Deployment status: ${state.deployment_status}`, `AI said: ${state.ai_response}`],
//     };
// });

// ✅ Define Workflow Execution Flow
graph.addEdge("processInputWithLLM", "checkPermissions");
// graph.addEdge("checkPermissions", "triggerDeployment");
// graph.addEdge("triggerDeployment", "validateDeployment");
// graph.addEdge("validateDeployment", "logConversation");

// ✅ After adding all nodes and edges, set the entry point
graph.setEntryPoint("processInputWithLLM");
// graph.setFinishPoint("logConversation"); // Add this line

// ✅ Compile the graph into a runnable function
const workflow = graph.compile();

// ✅ Function to Run the Workflow

// ✅ Fixed Workflow Runner Function
const runDeploymentWorkflow = async (user, userMessage) => {
    // Create initial state matching schema
    const initialState = {
      chat_history: [],
      deployment_status: "pending",
      ai_response: "",
      user_message: userMessage,
      user: user
    };
  
    const finalState = await workflow.invoke(initialState);
    console.log("Final Deployment Status:", finalState.deployment_status);
    console.log("Chat History:", finalState.chat_history);
    return finalState;
  };

module.exports = { runDeploymentWorkflow };

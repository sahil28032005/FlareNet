const { StateGraph } = require("@langchain/langgraph");
const { createAgent, llm, memory } = require("../langchainConfig");

// 1. Define State Structure using proper schema
const workflowState = {
  messages: {
    value: (x) => x || [], // Initializer function
    merge: (a, b) => [...a, ...b], // Merge strategy
    default: () => [] // Default value
  },
  deployment_status: {
    value: (x) => x || "pending",
    default: () => "pending"
  },
  user: {
    value: (x) => x,
    default: () => null
  }
};

// 2. Create Node Functions (keep existing implementations)
const processInput = async (state) => { /* ... */ };
const checkPermissions = async (state) => { /* ... */ };

// 3. Build State Graph with proper initialization
const workflow = new StateGraph({ channels: workflowState })
  .addNode("process_input", processInput)
  .addNode("check_permissions", checkPermissions)
  .addEdge("__start__", "check_permissions")
  .addConditionalEdges(
    "check_permissions",
    (state) => state.deployment_status === "approved" ? "process_input" : "__end__"
  )
  .addEdge("process_input", "__end__");

// 4. Compile and Export
const app = workflow.compile();

const runDeploymentWorkflow = async (user, message) => {
  return app.invoke({
    messages: [{ role: "user", content: "hello" }],
    user: user
  });
};

module.exports = { runDeploymentWorkflow };
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { createAgent, llm, memory } = require("../langchainConfig");
const { HumanMessage } = require("@langchain/core/messages");
const axios = require("axios");


const processMessage = async (state) => {
  try {
    // Stringify state for debugging
    const stringifiedState = JSON.stringify(state, null, 2);
    console.log("DEBUG: Process Message - Stringified State:", stringifiedState);

    // Parse the stringified state back to an object
    const parsedState = JSON.parse(stringifiedState);

    // Ensure messages exist in parsed state
    if (
      !parsedState.messages ||
      !Array.isArray(parsedState.messages) ||
      parsedState.messages.length === 0
    ) {
      throw new Error("Invalid state: messages array missing or empty.");
    }

    console.log(
      "Actual first message:",
      JSON.stringify(parsedState.messages[0], null, 2)
    );

    // Find the first message that contains required params (checking from parsed object)
    const messageWithParams = parsedState.messages.find(
      (msg) =>
        JSON.stringify(msg).includes('"kwargs"') &&
        JSON.stringify(msg).includes('"params"') &&
        JSON.stringify(msg).includes('"gitUrl"') &&
        JSON.stringify(msg).includes('"ownerId"') &&
        JSON.stringify(msg).includes('"name"') &&
        msg.kwargs &&
        msg.kwargs.params &&
        msg.kwargs.params.gitUrl &&
        msg.kwargs.params.ownerId &&
        msg.kwargs.params.name
    );

    console.log(
      "Filtered message with required params:",
      JSON.stringify(messageWithParams, null, 2)
    );

    if (!messageWithParams) {
      throw new Error("Missing required parameters (gitUrl, ownerId, name).");
    }

    // Extract necessary fields
    const { gitUrl, ownerId, name } = messageWithParams.kwargs.params;

    console.log("Extracted gitUrl:", gitUrl);
    console.log("Extracted ownerId:", ownerId);
    console.log("Extracted Project Name:", name);

    return {
      ...parsedState,
      gitUrl,
      ownerId,
      name,
      validated: true, // Indicate successful validation
    };
  } catch (error) {
    console.error("Process error:", error.message);
    return {
      ...state,
      error: error.message,
      validated: false, // Indicate validation failure
    };
  }
};


// Validate Project ID
const checkProjectId = async (state) => {
  if (!state.projectId) {
    return { ...state, error: "Invalid projectId." };
  }
  console.log(`returning form node chkProjectid/......`);
  return state;
};

// Deploy Project by Adding to Queue
const deployProject = async (state) => {
  try {
    // await buildQueue.add("deploy", { projectId: state.projectId, gitUri: state.gitUri });
    return state;
  } catch (error) {
    console.error("Failed to enqueue deployment:", error.message);
    return { ...state, error: "Deployment queue error." };
  }
};

// Monitor Deployment Logs
const monitorLogs = async (state) => {
  try {
    // const response = await axios.get(`http://localhost:5000/projects/${state.projectId}/status`);
    return {
      ...state,
      deployment_status:"pending",
      logs:"Deployment in progress...",
    };
  } catch (error) {
    console.error("Log monitoring failed:", error.message);
    return { ...state, error: "Error retrieving deployment status." };
  }
};

// ✅ LangGraph Workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("validateParams", async (state) => {
    console.log("DEBUG: Validate Params - State:", JSON.stringify(state));
    return { ...state };
  })
  .addEdge("__start__", "validateParams")

  .addNode("processMessage", processMessage)
  .addEdge("validateParams", "processMessage")

  .addNode("processDeployment", async (state) => {
    console.log("DEBUG: Process Deployment - State:", JSON.stringify(state));
    return {
      ...state,
      deployment_status: "processing",
      messages: [...state.messages, { role: "system", content: "Deployment started..." }],
    };
  })
  .addEdge("processMessage", "processDeployment")

  .addNode("deployProject", deployProject)
  .addEdge("processDeployment", "deployProject")

  .addNode("monitorLogs", monitorLogs)
  .addEdge("deployProject", "monitorLogs")

  .addNode("agent", async (state) => {
    console.log("DEBUG: Agent Node - State:", JSON.stringify(state));
    return { ...state, messages: [...state.messages, { role: "assistant", content: "Deployment complete!" }] };
  })
  .addEdge("monitorLogs", "agent")

  .addConditionalEdges("agent", (state) => {
    console.log("DEBUG: Should Continue? - State:", JSON.stringify(state));
    return shouldContinue(state);
  });

const app = workflow.compile();


// Modify runDeploymentWorkflow function
// Modified runDeploymentWorkflow function
const runDeploymentWorkflow = async (user, params) => {
  console.log("Running with params:", params);

  // Create initial state
  const initialState = {
    params: params,
    user: user,
    deployment_status: "started",
    messages: [],
    projectId: null,
    gitUri: null,
    error: null
  };

  console.log("Initial State:", JSON.stringify(initialState, null, 2));

  // Wrap initialState inside `messages`
  return await app.invoke({ messages: [new HumanMessage(initialState)] });
};


module.exports = { runDeploymentWorkflow };

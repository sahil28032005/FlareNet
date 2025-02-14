const { StateGraph } = require("@langchain/langgraph");
const { createAgent, llm, memory } = require("../langchainConfig");
const axios = require("axios");
// const { Queue } = require("bullmq");



// Define State Schema
const workflowState = {
  messages: {
    value: (x) => x || [],
    merge: (a, b) => [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])],
    default: () => [],
  },
  deployment_status: {
    value: (x) => x || "pending",
    default: () => "pending",
  },
  projectId: {
    value: (x) => x,
    default: () => null,
  },
  gitUri: {
    value: (x) => x,
    default: () => null,
  },
  error: {
    value: (x) => x || null,
    default: () => null,
  },
};

// Process User Message and Extract Git URL
const processMessage = async (state) => {
  console.log("Full state:", JSON.stringify(state, null, 2)); // Better debugging
  const rawContent = state.messages[0]?.content;
  console.log("Raw content:", rawContent);
  // Try to parse as JSON first
  let params = {};
  try {
    const jsonMatch = rawContent.match(/{.*}/s);
    if (jsonMatch) {
      params = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If JSON parsing fails, fall back to regex extraction
    params = {
      name: messageContent.match(/(?:name|project name):\s*["']?([^"'\n]+)/i)?.[1]?.trim(),
      gitUrl: messageContent.match(/(?:gitUrl|git URI|repository):\s*<?([^\s>]+)>?/i)?.[1]?.trim(),
      description: messageContent.match(/(?:description):\s*["']?([^"'\n]+)/i)?.[1]?.trim(),
      ownerId: messageContent.match(/(?:ownerId|owner ID):\s*["']?(\d+)/i)?.[1]?.trim()
    };
  }

  console.log("Extracted Parameters:", params);

  // Validate required parameters
  const errors = [];
  if (!params.gitUrl) errors.push("Git URL is required");
  if (!params.name) errors.push("Project name is required");
  if (!params.ownerId) errors.push("Owner ID is required");

  if (errors.length > 0) {
    console.error("Validation errors:", errors);
    return { ...state, error: errors.join(", ") };
  }

  try {
    const response = await axios.post("http://localhost:5000/projects", {
      name: params.name,
      gitUrl: params.gitUrl,
      description: params.description || "No description provided",
      ownerId: params.ownerId
    });

    if (!response.data.success) {
      console.error("Project creation failed:", response.data);
      return { ...state, error: "Failed to create project" };
    }
    else{
      console.log("Project created successfully:", response.data);
    }

    return {
      ...state,
      gitUri: params.gitUrl,  // Maintain consistent naming
      projectId: response.data.projectId,
      name: params.name,
      ownerId: params.ownerId
    };

  } catch (error) {
    console.error("API request failed:", error.message);
    return { ...state, error: "Server error during project creation" };
  }
};

// Validate Project ID
const checkProjectId = async (state) => {
  if (!state.projectId) {
    return { ...state, error: "Invalid projectId." };
  }
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
    const response = await axios.get(`http://localhost:5000/projects/${state.projectId}/status`);
    return {
      ...state,
      deployment_status: response.data.status || "pending",
      logs: response.data.logs
    };
  } catch (error) {
    console.error("Log monitoring failed:", error.message);
    return { ...state, error: "Error retrieving deployment status." };
  }
};

// Build the LangGraph Workflow
const workflow = new StateGraph({ channels: workflowState })
  .addNode("process_message", processMessage)
  .addNode("check_project_id", checkProjectId)
  .addNode("deploy_project", deployProject)
  .addNode("monitor_logs", monitorLogs)
  .addEdge("__start__", "process_message")
  .addEdge("process_message", "check_project_id")
  .addEdge("check_project_id", "deploy_project")
  .addEdge("deploy_project", "monitor_logs")
  .addEdge("monitor_logs", "__end__");

// Compile and Export
const app = workflow.compile();

const runDeploymentWorkflow = async (user, message) => {
  console.log("Running deployment workflow with message:", message);
  return app.invoke({
    messages: [{ role: "user", content: message }], // Ensure `message` is raw
    user: user,
  });

};

module.exports = { runDeploymentWorkflow };

//this will orchestrate overall workflow or flow of steps as main orcehstra
const workflows = require('./workflows.json');
const webHookQueue = require('../queues/webHookQueue');
async function runWorkflow(workflowName, context,deploymentId) {
  const workflow = workflows[workflowName];

  if (!workflow) {
    throw new Error(`Workflow ${workflowName} not found`);
  }
  console.log(`Adding workflow "${workflowName}" as a single job with context:`, context);
  //process workflow in predefined manner
  try {
    await webHookQueue.add(workflowName, { workflow, context ,deploymentId});
    console.log(`Workflow "${workflowName}" added to the queue.`);
  }
  catch (error) {
    console.error(`Failed to add workflow "${workflowName}" to the queue:`, error.message);
    throw error;
  }

}

module.exports = {
  runWorkflow
};
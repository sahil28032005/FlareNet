//this will orchestrate overall workflow or flow of steps as main orcehstra

async function runWorkflow(workflowName,context){
  const workflow=require('./workflows.json')[workflowName];

  if(!workflow){
    throw new Error(`Workflow ${workflowName} not found`);
  }

  //process workflow in predefined manner

}

module.exports = {
    runWorkflow
  };
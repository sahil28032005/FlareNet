const buildQueue = require('../queues/buildQueue');
module.exports = async function triggerBuild({ deploymentId, projectId, environment, gitUrl, version }) {
    console.log(`Triggering build for deploymentId: ${deploymentId}, projectId: ${projectId}, environment: ${environment}`);
    //add job to build queue it will buld by queue worker and hosted live as an update from user
    try {
       //this will do actual deployment task and building task with the help of orchestrated container
       
    }
    catch (error) {
        console.error('Error triggering build:', error.message);
        throw error;
    }
}
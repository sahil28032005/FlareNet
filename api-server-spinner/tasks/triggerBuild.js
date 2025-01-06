const buildQueue = require('../queues/buildQueue');
module.exports = async function triggerBuild({ deploymentId, projectId, gitUrl }) {
    console.log(`Triggering build for deploymentId: ${deploymentId}, projectId: ${projectId}, environment: ${environment}`);
    //add job to build queue it will buld by queue worker and hosted live as an update from user
    try {
       //current idea is to push jpb inside main build queue from here as per decided architrrcture
       
    }
    catch (error) {
        console.error('Error triggering build:', error.message);
        throw error;
    }
}
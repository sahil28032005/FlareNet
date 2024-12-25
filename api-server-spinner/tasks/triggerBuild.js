const buildQueue = require('../queues/buildQueue');
module.exports = async function triggerBuild({ deploymentId, projectId, environment, gitUrl, version }) {
    console.log(`Triggering build for deploymentId: ${deploymentId}, projectId: ${projectId}, environment: ${environment}`);
    //add job to build queue it will buld by queue worker and hosted live as an update from user
    try {
        await buildQueue.add('user_commit_update', {
            deploymentId,
            projectId,
            environment,
            gitUrl,
            version: version || 'v1.0.0', // Default version if not provided});
        });
        console.log(`Build job for deploymentId: ${deploymentId} triggered successfully.`);
    }
    catch (error) {
        console.error('Error triggering build:', error.message);
        throw error;
    }
}
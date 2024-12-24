const { worker } = require('bullmq');
const { prisma } = require('../utils/prismaClient');

const failedQueueWorker = new Worker('failedBuildQueue', async (job) => {
    const { deploymentId, projectId, gitUrl,error } = job.data;

    console.log(`processing failed jobbs in hthe form of dead letter queue for deployment id ${deploymetId}`);
    
    //categorize the failure
    let action='DISCARD';
    if(error.includes('network')){
        action='RETRY';
    }
    else if(error.includes('validation')){
      action='ESCALATE';
    }

    //CASES FOR PERFORMING NECESSARY ACTIONS
    
    //log failures to the database if necessary for auditing.

    //optinal notify teams or other services if necessary
    console.log(`Failed job logged for Deployment ID: ${deploymentId}`);

}, {
    connection: { host: 'localhost', port: 6379 },
});

failedQueueWorker.on('ready', () => {
    console.log('Failed queue worker is ready to process jobs.');
});

failedQueueWorker.on('failed', (job, err) => {
    console.error(`Failed to process job in DLQ: ${job.id}, Error: ${err.message}`);
});

module.exports = failedQueueWorker;
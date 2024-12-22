const { Worker } = require('bullmq');
const { RunTaskCommand } = require('@aws-sdk/client-ecs');
const { client } = require('../utils/awsClient');
const { prisma } = require('../utils/prismaClient');

//define worker to process jobs
const deploymentWorkeer = new Worker('deploymentQueue', async (job) => {
    const { deploymentId, projectId, environment, gitUrl, version } = job.data;
    try {
        console.log(`Processing deployment for ${projectId} - Deployment ID: ${deploymentId}`);
        //mark deployment status as active in  prisma database
        await prisma.deployment.update({
            where: { id: deploymentId },
            data: { status: 'ACTIVE' },
        });

        //deployment status marked as active time to trigger ecs fargate task for container spinning and builder servive to work
        

    }
    catch (err) {
        console.error(`Error for processing deployment job: ${err.message}`);
    }
});
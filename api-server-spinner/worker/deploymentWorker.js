const { Worker } = require('bullmq');
const { RunTaskCommand } = require('@aws-sdk/client-ecs');
const { client } = require('../utils/awsClient');
const { prisma } = require('../utils/prismaClient');

//cluster/aws configs object
const config = {
    CLUSTER: process.env.AWS_CLUSTER_NAME,
    TASK: 'git_project_cloner_task:4'
}
//define worker to process jobs
const deploymentWorker = new Worker('deploymentQueue', async (job) => {
    const { deploymentId, projectId, environment, gitUrl, version } = job.data;
    try {
        console.log(`Processing deployment for ${projectId} - Deployment ID: ${deploymentId}`);
        //mark deployment status as active in  prisma database
        await prisma.deployment.update({
            where: { id: deploymentId },
            data: { status: 'ACTIVE' },
        });

        //deployment status marked as active time to trigger ecs fargate task for container spinning and builder servive to work
        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: ['subnet-0e0c97b6f83bfc538', 'subnet-08a60214836f38b79', 'subnet-0c4be927b2f4c3790'],
                    securityGroups: ['sg-0bf9e7e682e1bed1a']
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'task_cloner_image',
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitUrl },
                            { name: 'PROJECT_ID', value: projectId },
                            { name: 'DEPLOYMENT_ID', value: deploymentId },
                        ]
                    }
                ]
            }

        });

        //send final command to task executor
        await client.send(command);
        //after processng container task mark deloyment as completed
        await prisma.deployment.update({
            where: { id: deploymentId },
            data: { status: 'COMPLETED' },
        });

    }
    catch (err) {
        console.error(`Error for processing deployment job: ${err.message}`);

    } await prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: 'FAILED' },
    });

    throw err;
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});
deploymentWorker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
});

deploymentWorker.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err.message}`);
});
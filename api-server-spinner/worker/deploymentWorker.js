const { Worker } = require('bullmq');
const { RunTaskCommand } = require('@aws-sdk/client-ecs');
const { client } = require('../utils/awsClient');
const { prisma } = require('../utils/prismaClient');
const failedQueue = require('../queues/failedQueue');
require('dotenv').config({ path: '../.env' });
//cluster/aws configs object
const config = {
    CLUSTER: process.env.AWS_CLUSTER_NAME,
    TASK: 'git_project_cloner_task:15'
}

//define worker to process jobs
const deploymentWorker = new Worker('buildQueue', async (job) => {
    const { deploymentId, projectId, environment = "DEVELOPMENT", gitUrl, version = "v1.0.0", buildCommand, envVars } = job.data;
    try {
        console.log(`Worker is Processing deployment for ${projectId} - Deployment ID: ${deploymentId}`);
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
                            { name: 'GIT_URI', value: gitUrl },
                            { name: 'PROJECT_ID', value: projectId },
                            { name: 'DEPLOYMENT_ID', value: deploymentId },
                            { name: 'BUILD_COMMAND', value: buildCommand || "npm install && npm run build" }, // Send build command
                            ...envVars // Add custom environment variables her
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
            data: { status: 'ACTIVE' },
        });

    }
    catch (err) {
        console.error(`Error for processing deployment job: ${err.message}`);
        throw err;

    } await prisma.deployment.update({
        where: { id: deploymentId },
        data: { status: 'FAILED' },
    });


}, {
    connection: {
        url: process.env.REDIS_HOST, // Use environment variable or fallback
    }
});
deploymentWorker.on('ready', () => {
    console.log('deployment Worker is ready to process jobs.');
});

deploymentWorker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
});

deploymentWorker.on('failed', async (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err.message}`);

    // Add the failed job to a dead letter queue (DLQ)
    await failedQueue.add('failedJob', {
        ...job.data, // Include the original job data
        failedAt: new Date().toISOString(), // Timestamp for when the job failed
        error: err.message // Include the error message for debugging
    });

    //maek hib as state oenf=ding review and annother or store in databse if necessary
    await UpdateServicePrimaryTaskSetCommand.failedJob.create({
        data: {
            queueName: 'buildQueue',
            jobId: job.id,
            deploymentId: job.data.deploymentId || null,
            projectId: job.data.projectId || null,
            errorMessage: err.message,
            failedAt: new Date(),
            status: 'PENDING',
        }
    });

    // Optionally update the deployment status
    if (job.data.deploymentId) {
        await prisma.deployment.update({
            where: { id: job.data.deploymentId },
            data: { status: 'FAILED' },
        });
    }
});



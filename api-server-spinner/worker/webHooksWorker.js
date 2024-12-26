const { Worker } = require('bullmq');
const triggerBuild = require('../tasks/triggerBuild');
const runTests = require('../tasks/runTests');
const sendNotification = require('../tasks/sendNotifications');


//task handeler mapping
const taskHandelers = {
    triggerBuild,
    runTests,
    sendNotification
}

const webHookTaskBuilder = new Worker('webHookQueue', async (job) => {
    const { deploymentId, workflow, context } = job.data;

    try {
        // Process build (you can add logic to actually build the project)
        console.log(`Building project for ${gitUrl}, version ${version}`);

        //try to iterate on workflow steps and process appropriate tasks attached with it
        console.log('workflow steps:', workflow);

        for (const taskName of workflow) {
            console.log(`processing task: ${taskName}`);

            const taskHandler = taskHandelers[taskName];
            if (!taskHandler) {
                console.error(`No handler found for task: ${taskName}`);
                throw new Error(`Task "${taskName}" does not have a handler`);
            }

            //execute task via providing context
            await taskHandler(context);
            console.log(`task ${taskName} completed`);

        }
        //write same code as buildqueue worker does just done queue seperations
    }
    catch (err) {
        console.error(`Error in processing build job for deploymentId ${deploymentId}: ${error.message}`);
        throw error; // Re-throw the error to mark the job as failed
    }
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

// Listen for job completion or failure
webHookTaskBuilder.on('completed', (job) => {
    console.log(`Build job ${job.id} completed successfully.`);
});

webHookTaskBuilder.on('failed', (job, err) => {
    console.error(`Build job ${job.id} failed with error: ${err.message}`);
});

module.exports = webHookTaskBuilder;
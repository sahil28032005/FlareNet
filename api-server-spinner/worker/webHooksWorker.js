const { Worker } = require('bullmq');

const webHookTaskBuilder = new Worker('webHookQueue', async (job) => {
    const { deploymentId, projectId, gitUrl, version } = job.data;

    try {
        // Process build (you can add logic to actually build the project)
        console.log(`Building project for ${gitUrl}, version ${version}`);

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
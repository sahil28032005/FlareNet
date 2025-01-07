const { Queue } = require('bullmq');

const webHookQueue = new Queue('webHookQueue', {
    connection: {
        host: 'localhost', // Replace with your Redis host
        port: 6379, // Replace with your Redis port
    }
});

module.exports = webHookQueue;
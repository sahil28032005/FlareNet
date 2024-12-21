const { Queue } = require('bullmq');

const buildQueue = new Queue('buildQueue', {
    connection: {
        host: 'localhost', // Replace with your Redis host
        port: 6379, // Replace with your Redis port
    },
});

module.exports = buildQueue;
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
require('dotenv').config();
const { Kafka } = require('kafkajs');

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}

// S3 client configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    }
});

// Environment variables
const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;

// Kafka configuration
const kafka = new Kafka({
    clientId: `docker-build-server-${DEPLOYMENT_ID}`,
    brokers: [`${process.env.KAFKA_BROKER}`],
    ssl: {
        rejectUnauthorized: false, // Use true for strict verification
        ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')],
        cert: fs.readFileSync(path.join(__dirname, 'service.cert'), 'utf-8'),
        key: fs.readFileSync(path.join(__dirname, 'service.key'), 'utf-8'),
    },
});

// Kafka producer setup
const producer = kafka.producer();

// Log publisher function
async function publishLog(log, logLevel = 'info', fileDetails = {}) {
    const logMessage = {
        PROJECT_ID,
        DEPLOYMENT_ID,
        log,
        logLevel: logLevel,  // Ensure log level is passed properly
        ...fileDetails, // Spread fileDetails into the log message
    };

    await producer.send({
        topic: 'builder-logs',
        messages: [{
            key: 'log',
            value: JSON.stringify(logMessage)
        }]
    });
}


// Main function
async function init() {
    await producer.connect();
    console.log("Producer connection successful, will be able to publish logs.");
    console.log("Executing script.js...");
    publishLog('Build Started...', 'info');

    const projectDir = path.join(__dirname, 'output');

    // Create process instance
    const processInstance = exec(`cd ${projectDir} && npm install && npm run build`);

    processInstance.on('data', function (data) {
        console.log(data.toString());
        publishLog(data.toString(), 'info');
    });

    processInstance.on('error', function (data) {
        console.log('Error: ' + data.toString());
        publishLog(`Error: ${data.toString()}`, 'error');
    });

    processInstance.on('close', async function () {
        console.log("Build completed successfully!");
        publishLog('Build Complete', 'success');

        // Upload built files to S3
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        publishLog('Starting to upload files...', 'info');

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;
            const fileSize = fs.statSync(filePath).size;
            const readableFileSize = formatFileSize(fileSize);
            const startTime = Date.now();

            console.log('Uploading', filePath);
            publishLog(`Uploading ${file}`, 'PROCESSING', {
                fileName: file,
                fileSize: readableFileSize,
                fileSizeInBytes: fileSize,
            });



            const command = new PutObjectCommand({
                Bucket: 'user-build-codes',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            });

            try {
                await s3Client.send(command);
                const endTime = Date.now();
                const timeTaken = (endTime - startTime) / 1000;

                console.log('Uploaded', file);
                // publishLog(`Uploaded ${file}`, 'success', {
                //     file_name: file,
                //     file_size: readableFileSize,
                //     file_size_in_bytes: fileSize,
                //     time_taken: timeTaken,
                // });

                const logMessage = {
                    timestamp: new Date().toISOString(),
                    eventType: 'upload_completed',
                    fileName: file,
                    fileSize: readableFileSize,
                    fileSizeInBytes: fileSize,
                    timeTaken: timeTaken,
                    status: 'success',
                    message: `File uploaded successfully to S3`
                };

                publishLog('actual data', 'info', logMessage);
            } catch (error) {
                console.log('Error uploading file:', error.message);
                publishLog(`Error uploading ${file}: ${error.message}`, 'error');
            }
        }

        console.log('All files uploaded!');
        publishLog('All files uploaded!', 'success');
        process.exit(0);
    });
}

init();

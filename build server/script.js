const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');
require('dotenv').config();

const publisher = new Redis(process.env.REDDIS_HOST);


//acknowledgement

publisher.ping()
    .then((result) => {
        console.log('Redis connection successful:', result); // Should print 'PONG'
    })
    .catch((err) => {
        console.error('Redis connection failed:', err);
    });

publisher.on('error', (err) => {
    console.log('Redis connection failed:', err);
})

// make s3cliient connetion code here
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    }
});

//supposed to be come from environment
const PROJECT_ID = process.env.PROJECT_ID

//log publisher function
function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify(log));
}

//change directory to where project is located as we are currenlty in workdir as /app
async function init() {

    console.log("Executing script.js...");
    publishLog('Build Started...');
    const projectDir = path.join(__dirname, 'output');

    //create process instance
    const processInstance = exec(`cd ${projectDir} && npm install && npm run build`);

    processInstance.on('data', function (data) {
        console.log(data.toString());
        //here also ogs published to reddis or kafka for system designs
        publishLog(data.toString());
    });

    processInstance.on('error', function (data) {
        console.log('Error: ' + data.toString());
        publishLog(`error: ${data.toString()}`)
    });

    processInstance.on('close', async function () {
        console.log("Build completed successfully!");
        publishLog(`Build Complete`);

        //now push that builded code to s3 in the statical form
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true }); //this will give all paths in the form of array for further use

        //distfolderContents wil be array pt these values:
        // path assets
        // path index.html
        // path vite.svg
        // path assets / index - BSn - hgr8.js
        // path assets / index - DLYYcElR.css
        publishLog(`Starting to upload....`);
        for (const file of distFolderContents) {
            // console.log("path",file);
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue; //skip file as a path as this will not occur in this case as we have each filr path with file presence

            console.log('uploading', filePath);
            publishLog(`uploading ${file}`);

            const command = new PutObjectCommand({
                Bucket: 'user-build-codes',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            });

            //send data 
            await s3Client.send(command);
            console.log('uploaded', file);
            publishLog(`uploaded ${file}`);

        }
        console.log('done all files upload!');
        publishLog(`Done`);

    });
}

init();

//another implementation using spwan from child_process

// const projectDir = './output';

// //run builder command for node applications
// const buildProcess = spawn('npm', ['run', 'build'], { cwd: projectDir });

// //log stdout and stderr use events for loggers

// buildProcess.stdout.on('data', function (data) {
//     console.log(`stdout: ${data}`);
// });

// buildProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
// });

// buildProcess.on('close', (code) => {
//     if (code === 0) {
//         console.log('Build completed successfully!');
//     } else {
//         console.error(`Build process exited with code ${code}`);
//     }
// });

// // Handle any errors while starting the process
// buildProcess.on('error', (error) => {
//     console.error(`Error starting build process: ${error.message}`);
// });
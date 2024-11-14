const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

//change directory to where project is located as we are currenlty in workdir as /app
async function init() {
    console.log("Executing script.js...");
    const projectDir = path.join(__dirname, 'output');

    //create process instance
    const processInstance = exec(`cd ${projectDir} && npm install && npm run build`);

    processInstance.on('data', function (data) {
        console.log(data.toString());
        //here also ogs published to reddis or kafka for system designs
    });

    processInstance.on('error', function (data) {
        console.log('Error: ' + data.toString());
    });

    processInstance.on('close', function () {
        console.log("Build completed successfully!");
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
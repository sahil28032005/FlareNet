const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const Redis = require('ioredis');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

const PORT = 5000;

//create new socket srever for logs subscribing and pushing
const io = new Server({ cors: '*' }); // listens all origins

io.on('connection', (socket) => {
    socket.on('suscribe', function (channel) {
        socket.join(channel);
        socket.emit('message', `joined for ${channel}`);
    });
});
const suscriber = new Redis(process.env.REDDIS_HOST);

//function which suscribes to logs and send user specific logs to their own data
async function emitMessages() {
    console.log("Suscribed to logs....");
    //her we will suscribe all logs whic are in format logs:* as we have published that using this as channel name
    suscriber.psubscribe('logs:*');
    console.log("Suscribed to pattern logs:*");
    suscriber.on('pmessage',(pattern,channel,message)=>{
        console.log("chname: " + channel);
        io.to(channel).emit('message',message);
    })
}

io.listen(9001, () => console.log("listening on port 9002"));


app.use(express.json());

//inttialize ecs client here
const client = new ECSClient({
    region:process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    }
});
//make con=figuration object for task and cluster
const config = {
    CLUSTER: process.env.AWS_CLUSTER_NAME,
    TASK: 'git_project_cloner_task:3'
}

//my subnets
// subnet-0e0c97b6f83bfc538
// subnet-08a60214836f38b79
// subnet-0c4be927b2f4c3790



//requwst of user project for making their deployment
app.post('/create-project', async function (req, res) {
    const { gitUrl, slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    //spin container as docker task
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-0e0c97b6f83bfc538', 'subnet-08a60214836f38b79', 'subnet-0c4be927b2f4c3790'],
                securityGroups: ['sg-0bf9e7e682e1bed1a ']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'task_cloner_image',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitUrl },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    })

    await client.send(command);
    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:9000` } });
});
emitMessages();  //manager kogs emitting service from redddis pub sub

app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
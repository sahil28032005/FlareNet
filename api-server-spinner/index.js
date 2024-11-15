const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");

const app = express();

const PORT = 5000;

app.use(express.json());

//inttialize ecs client here
const client = new ECSClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});
//make con=figuration object for task and cluster
const config = {
    CLUSTER: 'git_cloner_cluster',
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
                subnets: ['', '', ''],
                securityGroups: ['']
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

app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
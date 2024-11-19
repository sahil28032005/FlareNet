const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const Redis = require('ioredis');
const { Server } = require('socket.io');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { z } = require("zod");

const app = express();

const PORT = 5000;

//create new socket srever for logs subscribing and pushing
const io = new Server({ cors: '*' }); // listens all origins
const prisma = new PrismaClient();

async function main() {
    // Log to indicate the connection attempt
    console.log('Attempting to connect to the database...');

    try {
        // Run a simple query to test the connection
        const users = await prisma.user.findMany();

        // Log successful query result
        console.log('Successfully connected to the database and fetched users:', users);
    } catch (error) {
        // Log any error that happens during the query
        console.error('Error connecting to the database or fetching users:', error);
    }
}

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
    suscriber.on('pmessage', (pattern, channel, message) => {
        console.log("chname: " + channel);
        io.to(channel).emit('message', message);
    })
}

io.listen(9001, () => console.log("listening on port 9002"));


app.use(express.json());

//inttialize ecs client here
const client = new ECSClient({
    region: process.env.AWS_REGION,
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

//for creating project this route wil be used
app.post('/create-project', async function (req, res) {
    try {
        //validate using zod

        //created validator schema
        const createProjectSchema = z.object({
            name: z.string().min(1, "project name is required"),
            gitUrl: z.string().url("Invalid git url"),
            description: z.string().optional(),
            ownerId: z.number().int().positive("invallid ownerid"),
        });

        //parse check body as it is according to schema
        const isValidated = createProjectSchema.parse(req.body);
        if (isValidated.error) return res.status(404).json({ error: isValidated.error });

        //after proper validation insert that data into database
        const newProject = await prisma.project.create({
            data: {
                name: isValidated.name,
                gitUrl: isValidated.gitUrl,
                description: isValidated.description || null,
                owner: {
                    connect: { id: isValidated.ownerId }, // Ensure `newUser.id` exists in the database
                }
            },
        });

        //respond with project creation siccess
        res.status(200).send({
            success: true,
            message: 'Project created successfully!',
            project: isValidated.ownerId
        });
    }
    catch (e) {
        res.status(401).send({
            succsee: false,
            message: 'problem for creating project',
            error: e.message
        });
    }
});

//tester functin for creating user
async function createUser() {
    try {
        //creation query 
        const newUser = await prisma.user.create({
            data: {
                email: "example@example.com", // Replace with the user's email
                name: "John Doe", // Optional, can be `null`
                role: "USER", // Replace if you have other roles like ADMIN
            },
        });

        console.log('Created User:', newUser);

    }
    catch (e) {
       console.log('Error creating user internal error:', e.message);
    }
}


//main deployer actual

app.post('/deploy', async (req, res) => {
    try {
        //make zod schema for deployment validation
        const deploymentSchema = z.object({
            projectId: z.string().uuid("Invalid project ID"), // Ensure it matches UUID format
            environment: z.enum(["DEV", "STAGING", "PROD"], "Invalid environment"),
            status: z.enum(["INACTIVE", "ACTIVE", "FAILED"]).optional().default("INACTIVE"),
            url: z.string().url("Invalid deployment URL").optional(),
            version: z.string().optional(), // Optional version or tag
        });

        // Step 1: Validate input
        const validatedData = deploymentSchema.parse(req.body);

        //generate url if user provided custom uri handle logic for it otherwiswe make use of default name
        const generatedUri = validatedData.url || `http://${validatedData.projectId}.localhost:9000`;

        // Step 2: Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: validatedData.projectId },
        });

        if (!project) {
            return res.status(404).send({
                success: false,
                message: "Project not found",
            });
        }
        //first check there is nor running deployment


        //mark tht deploymenr entry in the database
        const newDeployment = await prisma.deployment.create({
            data: {
                projectId: validatedData.projectId,
                environment: validatedData.environment,
                status: validatedData.status,
                url: generatedUri,
                version: validatedData.version || "v1.0.0", // Provide a default version
            },
            //this include is just like populate() in mongodb or fetch_assoc() in php and readRecursive() in ruby as an powerful tree of tech stacks 
            include: {
                project: true, // Fetch related project data
            },
        });

        //spin docker cntainer as task to manage automated things
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
                            { name: 'GIT_REPOSITORY__URL', value: newDeployment.project.gitUrl },
                            { name: 'PROJECT_ID', value: newDeployment.project.id },
                            { name: 'DEPLOYMENT_ID', value: newDeployment.id },
                        ]
                    }
                ]
            }
        })

        await client.send(command);

        //send user url of the deployment with status
        return res.json({ status: 'queued', data: { deploymentId: newDeployment.id, domain: newDeployment.url } })

    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'internal service error for building deployment',
            error: e.message
        });
    }
});

//this will make deployment of the project
app.post('/deploy-project', async function (req, res) {
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

//prisma caller
main()
    .catch(e => {
        // Log error if the async main function fails
        console.error('An unexpected error occurred in the main function:', e);
    })
    .finally(async () => {
        // Ensure disconnection
        console.log('Disconnecting from the database...');
        await prisma.$disconnect();
        console.log('Disconnected from the database.');
    });
app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
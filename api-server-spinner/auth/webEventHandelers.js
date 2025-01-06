const { prisma } = require('../utils/prismaClient');
const { runWorkflow } = require('../workflows/workFlowEngine');
async function handlePushEvent(event) {
    const { repository, ref } = event.body;

    console.log(`Push event detected`);
    console.log("Event object:", event.body);

    // Extract context from the event
    const context = {
        gitUrl: repository.clone_url,        // Repository's clone URL
        branch: ref.split('/').pop(),        // Extract branch name from ref (e.g., refs/heads/main -> main)
        repositoryName: repository.name,     // Repository name
    }

    console.log("Extracted context:", context);
    // //mark tht deploymenr entry in the database by finding users project through gutUrl
    const project = await prisma.project.findUnique({
        where: { gitUrl: context.gitUrl },
    });

    if (!project) {
        return resizeBy.status(404).send({
            success: false,
            message: 'project not found'
        });
    }

    //mark deployment record and then send to workflow engine for again broadcast workflows events
    const deployment = await prisma.deployment.create({
        data: {
            projectId: project.id,
        }
    });
    //here idea is to trigger workflow via the workflow engine by provideing deployment id to him
    // deploymentWorkflow workflow name
    await runWorkflow('deploymentWorkflow', deployment.id, project.id, project.gitUrl);
    console.log(`Push event handled successfully vial following workflow steps`);


}

module.exports = { handlePushEvent }
//this file will contain test cases in future
const axios = require('axios');

async function runTests({ deploymentId, projectId, deploymentUri }) {
    console.log(`Running tests for deploymentId: ${deploymentId}, projectId: ${projectId}`);

    //grouping tests together using jest's describe block
    describe('Deployment URI Tests', () => {
        //Test 1: Check if the deployment uri returns status 200
        it('should return a 200 status for the deoloyment uri', async () => {
            const response = await axios.get(deploymentUri);
            expect(response.status).toBe(200);
        });

        //Test 2: Check if response body is valid
        
    });
}
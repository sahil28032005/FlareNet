//this file will contain test cases in future
const axios = require('axios');
const { response } = require('express');

module.exports = async function runTests({ deploymentId, projectId, deploymentUri }) {
    console.log(`Running tests for deploymentId: ${deploymentId}, projectId: ${projectId}`);

    //grouping tests together using jest's describe block
    describe('Deployment URI Tests', () => {
        //Test 1: Check if the deployment uri returns status 200
        it('should return a 200 status for the deoloyment uri', async () => {
            const response = await axios.get(deploymentUri);
            expect(response.status).toBe(200);
        });

        //Test 2: Check if response body is valid
        it('should return valid response body', async () => {
            const response = await axios.get(deploymentUri);
            expect(response.data).toBeDefined();
            expect(response.status).toHavePproperty('status', 'success');
        });

        //Test 3: Check if deployment URI returns non-200 status (should fail)
        it('should fail if deployment uri returns non-200 status', async () => {
            const response = await axios.get(deploymentUri);
            expect(response.status).not.toBe(200);
        });

        //Test 4: Handle network errors (unreachable uri)
        it('should fail if deployment uri is unreachable', async () => {
            try {
                await axios.get(deploymentUri);
            }
            catch (e) {
                expect(e).toBeDefined();
                expect(response.response).toBeUndefined(); //make sure its not an aaxios response error
            }
        });

        it('should not return empty response body', async () => {
            const response = await axios.get(deploymentUri);
            expect(response.data).not.toBeNull();
        });
    });
}
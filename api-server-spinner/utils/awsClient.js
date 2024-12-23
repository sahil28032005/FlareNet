require('dotenv').config({ path: '../.env' });
const { ECSClient } = require('@aws-sdk/client-ecs');
console.log("AWS Access Key:", process.env.AWS_ACCESSKEY);
console.log("AWS Secret Key:", process.env.AWS_SECRETACCESSKEY);
console.log("AWS Region:", process.env.AWS_REGION);

const client = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    }
});

module.exports = { client };
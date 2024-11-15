const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const PORT = 9000;

const base_s3_path = "https://user-build-codes.s3.ap-south-1.amazonaws.com/__outputs";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0]; //this will take our project id

    //try writing logic for custom domains

    const resolver = `${base_s3_path}/${subdomain}`;  //it is like https://user-build-codes.s3.ap-south-1.amazonaws.com/__outputs/345

    return proxy.web(req, res, { target: resolver, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))
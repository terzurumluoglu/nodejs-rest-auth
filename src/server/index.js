const express = require('express');
const dotenv = require('dotenv');
const { basePath, environments } = require('../constants');

const server = express();

let environmentPath = `${basePath}environment.env`;

if (process.env.ENVIRONMENT === environments.production) {
    environmentPath = `${basePath}environment.prod.env`;
}

dotenv.config({ path: environmentPath });

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(process.env.MESSAGE);
});

module.exports = { server };
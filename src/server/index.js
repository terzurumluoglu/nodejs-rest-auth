const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { basePath, environments } = require('../constants');
const { connectDatabase } = require('../config/db');

const server = express();

let environmentPath = `${basePath}environment.env`;

if (process.env.ENVIRONMENT === environments.production) {
    environmentPath = `${basePath}environment.prod.env`;
}

dotenv.config({ path: environmentPath });

connectDatabase();

const PORT = process.env.PORT;

server.use(express.json());
server.use(cookieParser());

server.listen(PORT, () => {
    const message = process.env.MESSAGE.split('{{PORT}}').join(PORT);
    console.log(message);
});

module.exports = { server };
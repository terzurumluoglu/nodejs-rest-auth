const express = require('express');
const dotenv = require('dotenv');
const { basePath, environments } = require('./src/constants')

const app = express();

let environmentPath = `${basePath}environment.env`;

if (process.env.ENVIRONMENT === environments.production) {
    environmentPath = `${basePath}environment.prod.env`;
}

dotenv.config({ path: environmentPath });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(process.env.MESSAGE);
});

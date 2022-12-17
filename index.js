const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: './src/config/config.env' });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
})
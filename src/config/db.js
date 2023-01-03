const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const connectDatabase = async () => {

    const name = process.env.DB_NAME;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;

    const connectionString = process.env.CONNECTION_STRING
        .replace('{{USERNAME}}', username)
        .replace('{{PASSWORD}}', password)
        .replace('{{NAME}}', name);

    const con = await mongoose.connect(connectionString);
    console.log(`db connection was creaated successfully! Database: ${con.connection.name}`);
}

module.exports = { connectDatabase };

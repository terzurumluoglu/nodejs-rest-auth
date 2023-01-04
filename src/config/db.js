const { MongoClient } = require('mongodb');
const ErrorResponse = require('../api/utils/ErrorResponse');

let _database;

const connectDatabase = async () => {
    const databaseName = process.env.DB_NAME;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;

    const connectionString = process.env.CONNECTION_STRING
        .replace('{{USERNAME}}', username)
        .replace('{{PASSWORD}}', password)
        .replace('{{NAME}}', databaseName);

    const client = new MongoClient(connectionString);
    _database = client.db();

    const connection = await client.connect();
    console.log(`db connection was creaated successfully! Database: ${connection.options.dbName}`);
}

const getDatabase = () => {
    if (_database) {
        return _database;
    }
    return new ErrorResponse('No Database Found', 500);
}

module.exports = { connectDatabase, getDatabase };

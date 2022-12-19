const { server } = require('./src/server');

server.get('/', (req, res, next) => {
    const data = {
        message: 'Hello World!',
    }
    res.status(200).send(data);
});
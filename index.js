const { server } = require('./src/server');
const authRoute = require('./src/api/routes/auth.route');
const { errorHandler } = require('./src/api/middleware/errorHandler');

server.get('/', (req, res, next) => {
    const result = {
        message: 'Hello World!',
    }
    res.status(200).send(result);
});

server.use('/auth', authRoute);
server.use(errorHandler);

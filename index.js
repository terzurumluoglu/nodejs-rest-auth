const { server } = require('./src/server');
const { userRoute, authRoute } = require('./src/api/routes');
const { errorHandler } = require('./src/api/middleware/errorHandler');

server.get('/', (req, res, next) => {
    const data = {
        message: 'Hello World!',
    }
    res.status(200).send(data);
});

server.use('/users', userRoute);
server.use('/auth', authRoute);
server.use(errorHandler);

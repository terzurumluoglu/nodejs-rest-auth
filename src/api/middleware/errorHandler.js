const { ErrorResponse } = require("../utils");

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.name = err.name;

    if (err.code === 11000) {
        const message = 'Duplicete field value entered';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = { errorHandler };

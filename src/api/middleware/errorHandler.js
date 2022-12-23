exports.errorHandler = (err, req, res, next) => {

    const validationError = 'ValidationError';

    const error = { ...err };
    error.name = err.name;

    // Mongoose validation error
    if (error.name === validationError) {
        error.message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
}
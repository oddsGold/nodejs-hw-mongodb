import { HttpError } from 'http-errors';

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
};
const errorServerHandler = (err, req, res, next) => {
    if(err instanceof HttpError) {
        return res.status(err.status).json({status: err.status, message: err.name, data: err})
    }
    const {status = 500, message = "Something went wrong"} = err;
    return res.status(status).json({status,  message, data: err.message})
}

export { notFoundHandler, errorServerHandler };

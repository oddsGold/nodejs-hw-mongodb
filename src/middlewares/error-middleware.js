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
    return res.status(500).json({status: 500,  message: "Something went wrong", data: err})
}

export { notFoundHandler, errorServerHandler };

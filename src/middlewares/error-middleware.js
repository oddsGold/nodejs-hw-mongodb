import ApiError from "../exeptions/api-error.js";

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Page not found',
    });
};
const errorServerHandler = (err, req, res, next) => {
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, err: err.errors})
    }
    return res.status(500).json({message: "Server error"})
}

export { notFoundHandler, errorServerHandler };

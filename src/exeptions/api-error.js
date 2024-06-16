class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static NotFoundError(message, errors = []) {
        return new ApiError(404, message, errors);
    }

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }
    static InternalServerError(message, errors = []) {
        return new ApiError(500, message, errors);
    }
}

export default ApiError;

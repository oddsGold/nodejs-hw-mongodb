class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        if (errors.length > 0) {
            this.errors = errors;
        }
    }

    static NotFoundError(message) {
        return new ApiError(404, message);
    }

    static BadRequestError(message) {
        return new ApiError(400, message);
    }
    static InternalServerError(message, errors = []) {
        return new ApiError(500, message, errors);
    }
}

export default ApiError;

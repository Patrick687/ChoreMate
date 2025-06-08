export class BadRequestError extends Error {
    public code = 400;
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends Error {
    public code = 401;
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ConflictError extends Error {
    public code = 409;
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}

export class NotFoundError extends Error {
    public code = 404;
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class InternalServerError extends Error {
    public code = 500;
    constructor(message: string) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class NotImplementedError extends Error {
    public code = 501;
    constructor(message: string) {
        super(message);
        this.name = 'NotImplementedError';
    }
}
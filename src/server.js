import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler, errorServerHandler } from './middlewares/error-middleware.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use('/', router);
    app.use(notFoundHandler);
    app.use(errorServerHandler);

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

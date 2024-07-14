import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import router from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { notFoundHandler, errorServerHandler } from './middlewares/error-middleware.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());
    app.use('/', router);
    app.use('/auth', authRouter);
    app.use(notFoundHandler);
    app.use(errorServerHandler);
    app.use('/uploads', express.static(UPLOAD_DIR));

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

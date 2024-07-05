import jwt from 'jsonwebtoken';
import {SessionsCollection} from "../db/models/session.js";
import {FIFTEEN_MINUTES, THIRTY_DAYS} from "../constants/index.js";
import createHttpError from "http-errors";

class TokensService {
    generateToken(payload) {
        const accessToken  = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken  = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(id, tokens) {
        return await SessionsCollection.create({
            userId: id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
            refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
        })
    }

    async removeSessionId(sessionId) {
        const tokenData = await SessionsCollection.deleteOne({_id: sessionId});
        return tokenData;
    }

    async removeUserId(userId) {
        const tokenData = await SessionsCollection.deleteOne({userId: userId});
        return tokenData;
    }

    validateRefreshToken(token) {
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch (e) {
            throw createHttpError(401, 'Unauthenticated!');
        }
    }

    validateAccessToken(token) {
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch (e) {
            return null
        }
    }

    async findToken(refreshToken, sessionId) {
        const tokenData = await SessionsCollection.findOne({
            _id: sessionId,
            refreshToken,
        });
        return tokenData;
    }
}

export default new TokensService();

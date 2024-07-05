import {UsersCollection} from "../db/models/user.js";
import UserDto from "../dtos/user-dto.js";
import TokensService from "../services/tokens.js"
import createHttpError from "http-errors";
import {SessionsCollection} from "../db/models/session.js";

class UsersService {

    async getUser(email) {
        const user = await UsersCollection.findOne({ email });
        return user;
    }
    async registration(name, email, password) {
        const user = await UsersCollection.create({
            name, email, password
        });
        const userDto = new UserDto(user);

        return {
            user: userDto
        };
    }

    async login(user) {
        const userDto = new UserDto(user);
        const tokens = TokensService.generateToken({...userDto});

        return await TokensService.saveToken(user._id, tokens);
    }

    async logout(sessionId) {
        await TokensService.removeSessionId(sessionId);
    }

    async refresh(refreshToken, sessionId) {
        const session = await TokensService.findToken(refreshToken, sessionId);

        if(!session) {
            throw createHttpError(401, 'Session not found');
        }

        const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

        if (isSessionTokenExpired) {
            throw createHttpError(401, 'Session token expired');
        }

        const user = await UsersCollection.findOne({ _id: session.userId });

        const userDto = new UserDto(user);
        const tokens = TokensService.generateToken({...userDto});

        await SessionsCollection.deleteOne({_id: sessionId, refreshToken});

        return await TokensService.saveToken(user._id, tokens);
    }
}

export default new UsersService();

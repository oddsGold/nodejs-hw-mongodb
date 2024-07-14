import UsersService from '../services/users.js'
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import TokensService from "../services/tokens.js";
class UserController {
    async registration(req, res, next) {
        const {name, email, password} = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UsersService.getUser(email);

        if(user){
            throw createHttpError(409, 'Email in use');
        }

        const userData = await UsersService.registration(name, email, encryptedPassword);

        res.status(201).json({
            status: 201,
            message: `Successfully registered a user!`,
            data: userData,
        });

    }

    async login(req, res, next) {

        const {email, password} = req.body;

        const user = await UsersService.getUser(email);

        if(!user){
            throw createHttpError(401, 'User not found');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if(!isPassEquals) {
            throw createHttpError(404, 'Incorrect Login or Password');
        }

        await TokensService.removeUserId(user._id);

        const userData = await UsersService.login(user);

        res.cookie('refreshToken', userData.refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
        res.cookie('sessionId', userData._id, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});

        res.status(201).json({
            status: 200,
            message: `Successfully logged in an user!`,
            data: {
                accessToken: userData.accessToken
            }
        });
    }

    async logout(req, res, next){
        const {sessionId} = req.cookies;

        if(sessionId) {
            await UsersService.logout(sessionId)
        }

        res.clearCookie('sessionId');
        res.clearCookie('refreshToken');

        res.status(204).send();
    }

    async refresh(req, res, next) {
        const {refreshToken, sessionId} = req.cookies;

        TokensService.validateRefreshToken(refreshToken);

        const session = await UsersService.refresh(refreshToken, sessionId);

        res.cookie('refreshToken', session.refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
        res.cookie('sessionId', session._id, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});

        res.json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
                accessToken: session.accessToken,
            },
        });
    }

    async resetEmail(req, res, next) {
        const {email} = req.body;

        const user = await UsersService.getUser(email);

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        await UsersService.resetToken(user);

        res.json({
            message: 'Reset password email was successfully sent!',
            status: 200,
            data: {},
        });
    }

    async resetPassword(req, res, next){
        const {password, token} = req.body;

        const entries = TokensService.validateResetToken(token);

        const user = await UsersService.getUser(entries.email);

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await UsersService.resetPassword(user.id, encryptedPassword);

        res.json({
            message: 'Password was successfully reset!',
            status: 200,
            data: {},
        });
    }

}

export default new UserController();

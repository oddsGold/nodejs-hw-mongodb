import {Router} from "express";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {validateBody} from "../middlewares/validateBody.js";
import UserController from "../controllers/user-controller.js";
import {loginUserSchema, registerUserSchema, resetEmailSchema, resetPasswordSchema} from "../validation/auth.js";


const authRouter = new Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(UserController.registration));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(UserController.login));
authRouter.post('/refresh', ctrlWrapper(UserController.refresh));
authRouter.post('/logout', ctrlWrapper(UserController.logout));
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), ctrlWrapper(UserController.resetEmail));
authRouter.post('/reset-pwd',validateBody(resetPasswordSchema), ctrlWrapper(UserController.resetPassword));

export default authRouter;

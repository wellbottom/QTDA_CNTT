import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { getUserData } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', authenticateUser, getUserData);

export default userRouter;
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { getUserData, storeRecentSearchItems } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', authenticateUser, getUserData);
userRouter.post('/store-recent-search', authenticateUser, storeRecentSearchItems);

export default userRouter;
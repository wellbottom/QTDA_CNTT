import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware';
import { registerHotel } from '../controllers/hotelController';

const hotelRouter = express.Router();

hotelRouter.post('/', authenticateUser, registerHotel);


export default hotelRouter;
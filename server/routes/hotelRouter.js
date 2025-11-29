import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware';
import { getHotelsByOwner, registerHotel } from '../controllers/hotelController';

const hotelRouter = express.Router();

hotelRouter.post('/', authenticateUser, registerHotel);
// GET hotels belonging to ANY owner
hotelRouter.get("/:ownerId", getHotelsByOwner);


export default hotelRouter;
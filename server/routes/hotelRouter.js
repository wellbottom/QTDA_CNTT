import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getHotelsByOwner, registerHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.post('/', authenticateUser, registerHotel);
// GET hotels belonging to ANY owner
hotelRouter.get("/:ownerId", getHotelsByOwner);


export default hotelRouter;
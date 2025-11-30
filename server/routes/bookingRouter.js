import express from 'express'
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/', authenticateUser, createBooking);
bookingRouter.get('/user', authenticateUser, getUserBookings);
bookingRouter.get('/hotel/:hotelId', authenticateUser, getHotelBookings);

export default bookingRouter;
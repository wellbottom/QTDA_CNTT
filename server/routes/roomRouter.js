import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { createRoom, getRoom, getRoomById, getRoomsByHotel, toggleRoomAvailability } from '../controllers/roomController.js';

const roomRouter = express.Router();

//POST rooms
roomRouter.post('/', upload.array("images", 5), authenticateUser, createRoom);

//GET available rooms
roomRouter.get('/', getRoom);

//GET room by Id
roomRouter.get('/:roomId', getRoomById);


// GET rooms for a specific hotel
roomRouter.get("/all-rooms-by-hotels/:hotelId", getRoomsByHotel);

//PUT 
roomRouter.post('/toggle-availability', authenticateUser, toggleRoomAvailability)

export default roomRouter;
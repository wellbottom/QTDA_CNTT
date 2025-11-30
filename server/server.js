import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRouter.js';
import hotelRouter from './routes/hotelRouter.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRouter.js';
import bookingRouter from './routes/bookingRouter.js';


connectDB();

connectCloudinary();
const app = express();

app.use(cors()); //enable cross-origin resource sharing

//middleware

app.use(express.json()); //body parser

app.use(clerkMiddleware({
    debug:true,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
}));

//API to listen to Clerk webhooks
app.use("/api/clerk", clerkWebHooks);

app.get('/', (req, res) => res.send("API is running fucking fine..."));
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on port ' + PORT));
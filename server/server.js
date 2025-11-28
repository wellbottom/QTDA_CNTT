import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebhooks.js';

connectDB();
const app = express();

app.use(cors()); //enable cross-origin resource sharing

//middleware

app.use(express.json()); //body parser

app.use(clerkMiddleware());

//API to listen to Clerk webhooks
app.use("/api/clerk", clerkWebHooks);

app.get('/', (req, res) => res.send("API is running fucking fine..."));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log('Server running on port ' + PORT));
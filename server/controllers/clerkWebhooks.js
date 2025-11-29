import UserModel from "../models/User.js";
import { Webhook } from "svix";


const clerkWebHooks = async (req, res) => {
    try {
        //create a svix instance with the webhook secret
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //getting header
        const headers = {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        };
        //verify the webhook header      
        await wh.verify(JSON.stringify(req.body), headers);

        //get data from request body
        const {data, type} = req.body;

        //getting data from clerk to store in mongo
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: data.first_name + " " + data.last_name,
            image: data.profile_image_url || data.image_url
        }

        //switch case for different webhook events
        switch (type) {
            case "user.created":
                //create a new user in mongoDB
                await UserModel.create(userData);
                console.log("User created with ID:", data.id);
                return res.status(200).send("User created");
                // break;
            case "user.deleted":
                //delete user from mongoDB
                await UserModel.findByIdAndDelete(data.id);
                console.log("User deleted with ID:", data.id);
                return res.status(200).send("User deleted");
            case "user.updated":
                //update user in mongoDB
                await UserModel.findByIdAndUpdate(data.id, userData);
                console.log("User updated with ID:", data.id);
                return res.status(200).send("User updated");
            default:
                return res.status(200).send("Event type not handled");
        }
        res.json({ success: true, message: "Webhook received and processed." });
    } catch (err) {
        console.error("Error processing webhook:", err.message);
        res.json({ success: false, message: "Webhook Error: " + err.message });
        return res.status(400).send(`Webhook Error: ${err.message}`);
        
    }
}

export default clerkWebHooks;
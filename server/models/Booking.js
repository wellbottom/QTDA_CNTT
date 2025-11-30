import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, ref: "User", required: true},
    room: {type: String, ref: "Room", required: true},
    hotel: {type: String, ref: "Hotel", required: true},
    checkInDate:{type: Date, required: true},
    checkOutDate:{type: Date, required: true},
    totalPrice:{type: Number, required: true},
    guests:{type: Number, required: true},
    status:{type: String, enum:["Pending", "Confirmed", "Cancelled"], default:"Pending"},
    paymentMethod:{type: String, enum:["ATM", "Cash on arrive"], default:"Cash on arrive"},
    isPaid:{type:Boolean, default:false}
}, {timestamps:true});

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
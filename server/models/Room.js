import mongoose, { Mongoose } from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel :{type: mongoose.Schema.Types.ObjectId, required: true, ref:"Hotel"},
    roomType:{tpye: String, required: true},
    pricePerNight:{type: Number, required: true},
    amenities: {type: Array},
    images: [{type: String, required: true}],
    isAvailable:{type: Boolean, default:true},

},{timestamps:true}
);

const RoomModel = mongoose.model("Hotel", hotelSchema);
export default RoomModel;

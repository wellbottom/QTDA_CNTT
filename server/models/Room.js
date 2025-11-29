import mongoose, { Mongoose } from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel :{type: mongoose.Schema.Types.ObjectId, required: true, ref:"HotelModel"},
    roomType:{type: String, required: true},
    pricePerNight:{type: Number, required: true},
    amenities: {type: Array},
    images: [{type: String, required: true}],
    isAvailable:{type: Boolean, default:true},

},{timestamps:true}
);

const RoomModel = mongoose.model("HotelModel", roomSchema);
export default RoomModel;

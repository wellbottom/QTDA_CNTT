import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name:{type:String, required:true},
    address:{type:String, required:true},
    contact:{type:String, required:true},
    owner:{type:mongoose.Schema.Types.ObjectId, required:true, ref: "UserModel"}, 
    city: {type:String, required:true},
    image: {type: String, required:false}
},{timestamps:true}
);

const HotelModel = mongoose.model("HotelModel", hotelSchema);
export default HotelModel;

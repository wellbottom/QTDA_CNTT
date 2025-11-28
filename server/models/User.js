import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{type:String, required:true},
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    image:{type:String, required:true},
    role:{type:String, enum:["User", "HotelOwners"], default:"User"},
    //optional fields could be recent searched items for whatever reason but i just don't see the points
},{timestamps:true}
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
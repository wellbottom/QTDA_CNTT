import UserModel from "../models/User.js";

export const authenticateUser = async (req, res, next) => {

    //execute before any controller, if not authenticated then just return
    const {userId} = req.auth;
    if(!userId){
        res.json({success: false, message: "Unauthorized"});
    }else{
        const user = await UserModel.findById(userId);
        req.user = user;
        next();
    }
}
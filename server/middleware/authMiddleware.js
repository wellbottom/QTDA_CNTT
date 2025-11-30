import UserModel from "../models/User.js";

export const authenticateUser = async (req, res, next) => {

    //debug
    // console.log("Authorization header:", req.headers.authorization);
    console.log(req.auth().debug());

    //execute before any controller, if not authenticated then just return
    const { userId } = req.auth();
    // console.log("req.auth : " +req.auth)
    // console.log("req.auth() : " +req.auth())
    // console.log("req.auth() stringify: ", JSON.stringify(req.auth()))


    if (!userId) {
        res.json({ success: false, message: "Unauthorized. No userId found" });
    } else {
        const user = await UserModel.findById(userId);
        req.user = user;
        next();
    }
}
import HotelModel from "../models/Hotels.js";
import UserModel from "../models/User.js";


export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        //check address is registered. This means only 1 hotel can be registered per user
        const addressExist = await HotelModel.findOne({ address });
        if (addressExist) {
            return res.json({ success: false, message: "Hotel already registered by this owner." });
        }

        await HotelModel.create({ name, address, contact, owner, city });
        await UserModel.findByIdAndUpdate(owner, { role: "HotelOwners" });

        res.json({ success: true, message: "Hotel registered successfully." });



    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// GET /hotels/owner/:ownerId
export const getHotelsByOwner = async (req, res) => {
    try {
        const ownerId = req.params.ownerId || req.query.ownerId;
        if (!ownerId) {
            return res.status(400).json({ success: false, message: "ownerId is required" });
        }

        const hotels = await HotelModel.find({ owner: ownerId })
            .populate({ path: 'owner', select: 'image name email' }) // optional
            .sort({ createdAt: -1 });

        res.json({ success: true, hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
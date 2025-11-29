import { populate } from "dotenv";
import HotelModel from "../models/Hotels.js";
import RoomModel from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary"

//POST /api/rooms 
export const createRoom = async (req, res) => {
  try {
    const { hotelId, roomType, pricePerNight, amenities } = req.body;

    if (!hotelId) {
      return res.json({ success: false, message: "hotelId is required" });
    }

    // Validate that hotel exists AND belongs to this owner
    const hotel = await HotelModel.findOne({
      _id: hotelId,
      owner: req.auth.userId
    });

    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found or does not belong to this owner"
      });
    }

    // Upload images to Cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    // Create the room
    await RoomModel.create({
      hotel: hotelId,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




//GET /api/rooms (isAvailable:true)
export const getRoom = async (req, res) => {
    try {
        const availableRooms = await RoomModel.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });

        res.json({ success: true, availableRooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


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



// GET /rooms/hotel/:hotelId
export const getRoomsByHotel = async (req, res) => {
    try {
        const hotelId = req.params.hotelId || req.query.hotelId;

        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "hotelId is required"
            });
        }

        const rooms = await RoomModel.find({ hotel: hotelId })
            .populate("hotel")
            .sort({ createdAt: -1 });

        res.json({ success: true, rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


//PUT
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await RoomModel.findById(roomId);

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availability changed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
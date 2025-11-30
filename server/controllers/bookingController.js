import RoomModel from "../models/Room.js";

//function to check room's availability

import BookingModel from "../models/Booking.js"

const checkAvailable = async ({room, checkInDate, checkOutDate}) =>{
    try {
        const bookings = await BookingModel.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate}

        });

        const is_Available = bookings.length === 0;
        return is_Available;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}



//POST /api/bookings/check-availability

export const checkAvailabilityAPI = async(req, res) =>{
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const is_Available = await checkAvailable({room, checkInDate, checkOutDate});
        res.json({success:true, is_Available})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};


//POST /api/bookings/book-room

export const createBooking = async(req, res) =>{
    try {
        const {room, checkInDate, checkOutDate, guests} = req.body;
        const user = req.user._id


        //check availability before booking
        const is_Available = await checkAvailable({room, checkInDate, checkOutDate});
        if(!is_Available){
            return res.json({success: false, message: "Room not available"})
        }

        const roomData = await RoomModel.findById(room).populate("hotel");


        //total price = price per night * number of nights (floor)
        const checkIn = new Date(checkInDate).getTime();
        const checkOut = new Date(checkOutDate).getTime();
        const nightf = Math.floor( (checkOut - checkIn) / (1000 * 3600 * 24)); 

        let totalPrice = roomData.pricePerNight * nightf;

        const booking = await BookingModel.create({
            user,
            room, 
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate, 
            checkOutDate, 
            totalPrice
        })

        res.json({success: true, message:"Booking done completed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
};



//GET /api/booking/user
//only get all bookings created by current logged-in users
export const getUserBookings = async (req, res)=>{
    try {
        const user = req.user._id;
        const bookings = await BookingModel.find({ user }).populate("room hotel").sort({createdAt: -1});
        res.json({success:true, bookings})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
};



//GET /api/bookings/hotel/:hotelId
export const getHotelBookings = async (req, res) => {
    try {
        const hotelId = req.params.hotelId || req.query.hotelId;

        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "hotelId is required"
            });
        }

        // Verify that the authenticated user owns this hotel
        const hotel = await HotelModel.findOne({
            _id: hotelId,
            owner: req.user._id
        });

        if (!hotel) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You do not own this hotel"
            });
        }

        const bookings = await BookingModel.find({ hotel: hotelId })
            .populate("room hotel user")
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        res.status(200).json({ success: true, dashboardData: { totalBookings, totalRevenue }, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
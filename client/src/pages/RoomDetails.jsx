import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { roomCommonData, roomsDummyData, facilityIcons, assets } from '../assets/assets'
import { UseAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useUser } from '@clerk/clerk-react'
const RoomDetails = () => {
    const { id } = useParams()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const [guests, setGuest] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);

    const { user } = useUser();

    const { axios, getToken } = UseAppContext();



    const fetchRoomById = async (roomId) => {
        try {
            const { data } = await axios.get(`/api/rooms/${roomId}`);
            if (data.success) {
                console.log(data);
                return data.availableRooms; // Changed from data to data.room
            }
        } catch (error) {
            console.error('Error fetching room:', error);
        }
    }

    const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
        setIsChecking(true);
        try {
            const { data } = await axios.post(
                '/api/bookings/check-availability',
                {
                    room: roomId,
                    checkInDate,
                    checkOutDate
                }
            );

            if (data.success) {
                setIsAvailable(data.is_Available);
                if (data.is_Available) {
                    toast.success('Room is available for selected dates!');
                    console.log(data)
                    setIsAvailable(true);
                } else {
                    toast.error('Room is not available for selected dates');
                }
                return data.is_Available;
            } else {
                toast.error(data.message || 'Failed to check availability');
                console.log(data.message)
                return false;
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            toast.error(error.response?.data?.message || 'Failed to check availability');
            return false;
        } finally {
            setIsChecking(false);
        }
    };

    const createBooking = async (roomId, checkInDate, checkOutDate, guests) => {
        console.log("🔵 createBooking called with:", { roomId, checkInDate, checkOutDate, guests });

        if (!checkInDate) {
            console.log("❌ No check-in date");
            toast.error("Check in date required");
            return;
        }
        if (!checkOutDate) {
            console.log("❌ No check-out date");
            toast.error("Check out date required");
            return;
        }
        if (!guests) {
            console.log("❌ No guests");
            toast.error("Guests number required");
            return;
        }
        if (!roomId) {
            console.log("❌ No room ID");
            toast.error("Logic error, no room id found");
            return;
        }

        console.log("✅ All validations passed, making API call...");

        try {
            const token = await getToken();
            console.log("🔑 Token:", token ? "exists" : "missing");

            const { data } = await axios.post('/api/bookings',
                { room:roomId, checkInDate, checkOutDate, guests },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("📡 Response:", data);

            if (data.success) {
                toast.success("Booked!");
                setCheckinDate('');
                setCheckoutDate('');
                setGuest(0);
                setIsAvailable(false)
            } else {

                toast.error(data.message || "Booking failed");
            }
        } catch (error) {

            toast.error(error.response?.data?.message || "Failed to create booking");
        }
    }

    useEffect(() => {
        const loadRoom = async () => {
            const foundRoom = await fetchRoomById(id); // Added await
            if (foundRoom) {
                setRoom(foundRoom);
                setMainImage(foundRoom.images[0]);
            }
        };

        loadRoom();
    }, [id])

    if (!room) {
        return <div>Room doesn't not exist</div>
    }

    return (
        <div className="pt-14 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-10">

                {/* ---------- HERO IMAGES ---------- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-2">
                        <img
                            src={mainImage}
                            alt="Room image"
                            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                        />
                    </div>

                    <div className=" grid grid-cols-2 gap-3">
                        {room.images.slice(0, 4).map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt="Room image"
                                className={`cursor-pointer rounded-xl transition-all duration-200 ${mainImage === image ? 'outline outline-4 outline-orange-500' : 'hover:scale-105'
                                    } h-46 w-full object-cover`}
                                onClick={() => setMainImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* ---------- TITLE / RATING / ADDRESS + PRICE ---------- */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between ">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                            {room.hotel.name}
                            <span className="font-normal text-xl text-gray-600 ml-2">({room.roomType})</span>
                            <span className="ml-3 inline-block text-orange-500 text-sm font-semibold px-2 py-1 bg-orange-100 rounded-full">
                                20% OFF
                            </span>
                        </h1>

                        <div className="flex items-center gap-3 mt-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                {/* Placeholder for stars — keep your original rating logic if you have it */}
                                <div className="text-orange-500">★ ★ ★ ★ ☆</div>
                                <div className="text-sm">200+ reviews</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 mt-2">
                            <img src={assets.locationIcon} alt="location icon" className="w-5 h-5" />
                            <span>{room.hotel.address}</span>
                        </div>
                    </div>

                    <div className="md:w-48 flex-shrink-0 text-right">
                        <p className="text-3xl font-bold text-gray-900">
                            ${room.pricePerNight}
                            <span className="text-xl font-medium text-gray-600">/day</span>
                        </p>
                    </div>
                </div>

                {/* ---------- SUBTITLE / AMENITIES ---------- */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Experience luxury like never before</h2>

                    <div className="flex flex-wrap gap-3">
                        {room.amenities.map((item, index) => (
                            <div
                                key={index}
                                className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-700 inline-flex items-center gap-2"
                            >
                                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* ---------- BOOKING BAR (horizontal card) ---------- */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <div>
                        <form className="flex flex-col md:flex-row items-center gap-4" onSubmit={(e) => { e.preventDefault(); checkRoomAvailability(id, checkinDate, checkoutDate) }}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                                <div className="space-y-2">
                                    <label htmlFor="checkin-date" className="block text-sm font-medium text-gray-900">Check in</label>
                                    <input
                                        type="date"
                                        id="checkin-date"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add date"
                                        required
                                        value={checkinDate}
                                        onChange={(e) => setCheckinDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="checkout-date" className="block text-sm font-medium text-gray-900">Check out</label>
                                    <input
                                        type="date"
                                        id="checkout-date"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add date"
                                        required
                                        value={checkoutDate}
                                        onChange={(e) => setCheckoutDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="guests" className="block text-sm font-medium text-gray-900">Guests</label>
                                    <input
                                        type="number"
                                        id="guests"
                                        min="1"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="2 guests"
                                        required
                                        value={guests}
                                        onChange={(e) => setGuest(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:w-56 w-full">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Check Availability
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
                {isAvailable &&
                    <div className="md:w-56 w-full">
                        <button
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                            onClick={() => {console.log("roomId: ", id);createBooking(id, checkinDate, checkoutDate, guests)}}>
                            Book now
                        </button>
                    </div>}

                {/* ---------- COMMON SPECIFICATIONS (list) ---------- */}
                <div className="space-y-6">
                    {roomCommonData.map((spec, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <img src={spec.icon} alt={`${spec.title} icon`} className="w-10 h-10 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{spec.title}</h4>
                                <p className="text-gray-600 text-base">{spec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ---------- DESCRIPTION ---------- */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl border-y border-gray-200">
                    <p className="text-lg text-gray-700 leading-relaxed">{room.description}</p>
                </div>

                {/* ---------- HOST CARD (Posted By) ---------- */}
                <div className="flex items-start gap-6 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
                    <div className="flex-shrink-0">
                        <img
                            src={room.hotel.owner.image}
                            alt="Host"
                            className="w-20 h-20 rounded-2xl object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <p className="text-gray-500">Hosted by</p>
                            <p className="text-xl font-semibold text-gray-900">{room.hotel.owner.name}</p>
                        </div>

                        <div className="text-gray-600">
                            {/* keep any host details or badges here */}
                        </div>
                    </div>

                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap">
                        Contact now
                    </button>
                </div>

            </div>
        </div>
    );

}

export default RoomDetails

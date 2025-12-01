import React, { useEffect, useState } from "react";
import { roomsDummyData } from "../assets/assets";
import Card from "./Card";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { UseAppContext } from "../context/AppContext";
import toast from "react-hot-toast";


const FeaturedDestination = ({ }) => {

    const [featuredRooms, setFeaturedRooms] = useState([]);
    const { axios } = UseAppContext();

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms?limit=4');
            if (data.success) {
                console.log(data);
                setFeaturedRooms(data.availableRooms);
            } else {
                console.error('Failed to fetch rooms:', data.message);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }
    useEffect(() => {
        fetchRooms();
    },[])

    const navigate = useNavigate();
    return (
        <div className="flex flex-col item-center px-6 md:px-12 lg:px-24 xl:px-32 mt-20 bg-slate-50 py-10 rounded-lg">
            <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience.' align='' font='' />

            <div className="flex flex-wrap item-center justify-center gap-8 mt-20">
                {featuredRooms.slice(0, 4).map((room, index) => (
                    <Card room={room} index={index} key={room._id} />
                ))}
            </div>

            <button className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
                onClick={() => {
                    navigate('/rooms');
                    scrollTo(0, 0);
                }}

            >
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination;
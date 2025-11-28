import React from "react";
import { roomsDummyData } from "../assets/assets";
import Card from "./Card";
import Title from "./Title";
import {useNavigate} from "react-router-dom";

const FeaturedDestination = ({}) => {


    const navigate = useNavigate();
    return (
        <div className="flex flex-col item-center px-6 md:px-12 lg:px-24 xl:px-32 mt-20 bg-slate-50 py-10 rounded-lg">
            <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience.' align='' font=''  />
            
            <div className="flex flex-wrap item-center justify-center gap-8 mt-20">
                {roomsDummyData.slice(0,4).map((room, index) => (
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
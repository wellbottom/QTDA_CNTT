
import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { UseAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import { roomsDummyData } from '../../assets/assets';
import Title from '../../components/Title';
import HotelListComponent from '../../components/HotelList';


const RoomItemTable = ({ allRoomsData, toggleRoomAvailability}) => {

  console.log("From the RoomItemTable component: ", allRoomsData)
  return (
    <table className='w-full'>
      <thead className='bg-gray-50'>
        <tr>
          <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
          <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
          <th className='py-3 px-4 text-gray-800 font-medium '>Price / night</th>
          <th className='py-3 px-4 text-gray-800 font-medium text-center'>Available</th>
        </tr>
      </thead>

      <tbody className='text-sm'>
        {allRoomsData.map((item, index) => (
          <tr key={index}>
            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
              {item.roomType}
            </td>

            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
              {item.amenities.join(', ')}
            </td>

            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
              ${item.pricePerNight}
            </td>

            <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
              <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                <input 
                type="checkbox" 
                className='sr-only peer' 
                checked={item.isAvailable} 
                value={item.isAvailable}
                onChange={(e) =>{
                  toggleRoomAvailability(item._id)
                }}
                />
                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
              </label>

            </td>

          </tr>
        ))}
      </tbody>

    </table>
  )
}



const RoomList_owner = () => {


  const { axios, getToken } = UseAppContext();
  const [hotelList, setHotelList] = useState([]);
  const { user } = useUser();
  const [selectedHotel, setSelectedHotel] = useState('');
  const [rooms, setRooms] = useState([]);
  

  const fetchAllHotels = async (ownerId) => {
    try {
      const { data } = await axios.get(`/api/hotels/${ownerId}`, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) {
        toast.success(data.message);
        setHotelList(data.hotels || []);
        console.log(data);
      } else {
        console.log(data.message);
        toast.error(data.message);
        setHotelList([]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch hotels');
      setHotelList([]);
    }
  };

  const fetchAllRoomsByHotel = async (hotelId) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }

    try {
      const { data } = await axios.get(`/api/rooms/all-rooms-by-hotels/${hotelId}`, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) {
        setRooms(data.rooms || []);
        console.log('Rooms fetched:', data.rooms);
      } else {
        toast.error(data.message || 'Failed to fetch rooms');
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch rooms');
      setRooms([]);
    }
  }

  const toggleRoomAvailability = async (roomId) => {
    try {
      const { data } = await axios.post('/api/rooms/toggle-availability', 
        { roomId }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        // Update the rooms state to reflect the change
        setRooms(rooms.map(room => 
          room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
        ));
      } else {
        toast.error(data.message || 'Failed to toggle availability');
      }
    } catch (error) {
      console.error('Error toggling room availability:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle availability');
    }
  }

  useEffect(() => {
    if (user) {
      fetchAllHotels(user.id);
    }
  }, [user])

  useEffect(() => {
    if (selectedHotel) {
      fetchAllRoomsByHotel(selectedHotel);
    }
  }, [selectedHotel])


  return (
    <div>
      <Title align='left' font='outfit' title='Room List' subTitle='Manage your rooms here. You can edit or delete room details as needed.' className='mb-5' />

      <div style={{ marginTop: '20px' }}>
        <HotelListComponent hotelList={hotelList} selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel}/>
      </div>

      <p className='text-gray-500 mt-8'>All Rooms</p>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        {rooms.length > 0 ? <RoomItemTable allRoomsData={rooms} toggleRoomAvailability={toggleRoomAvailability}/> : <p className='p-4 text-gray-500'>No rooms found. Select a hotel to view rooms.</p>}
      </div>


    </div>
  )
}


const StyledWrapper = styled.div`
  .radio-input input {
    display: none;
  }

  .radio-input {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: fit-content;
  }

  .radio-input label {
    position: relative;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #f5f5f5;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .radio-input label:hover {
    background-color: #efefef;
    border-color: #0b75df;
  }

  .radio-input input:checked + span {
    color: #0b75df;
    font-weight: 600;
  }

  .radio-input label:has(input:checked) {
    background-color: #e3f2fd;
    border-color: #0b75df;
    box-shadow: 0 0 0 3px rgba(11, 117, 223, 0.1);
  }

  .radio-input input[type="radio"]::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #999;
    border-radius: 50%;
    background-color: #fff;
  }

  .radio-input input:checked[type="radio"]::before {
    border-color: #0b75df;
    box-shadow: inset 0 0 0 4px #0b75df;
  }

  .selection {
    display: none;
  }`;

export default RoomList_owner
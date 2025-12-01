import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'
import { useUser } from '@clerk/clerk-react'
import { UseAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {


  const [bookings, setBookings] = useState(userBookingsDummyData)

  const {user} = useUser();
  const {axios, getToken} = UseAppContext();
  const fetchUserBookings =async ()=>{
    const {data} = await axios.get('/api/bookings/user', {headers:{Authorization: `Bearer ${await getToken()}`}});
    if(data.success){
      console.log(data);
      toast.success("Fetch success");
      setBookings(data.bookings)
    }
  }

  useEffect(()=>{
    fetchUserBookings()
  },[user])

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        
        {/* Title */}
        <div className="mb-12">
          <Title 
            title="My Bookings" 
            subtitle="One place to keep track of all your hotel bookings" 
            align="text-left"
          />
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="font-semibold text-xl text-gray-900">Hotels</div>
          <div className="font-semibold text-xl text-gray-900">Date & Timing</div>
          <div className="font-semibold text-xl text-gray-900">Payment</div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Hotel Details */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Room Image */}
                  <img 
                    src={booking.room.images[0]} 
                    alt="hotel img"
                    className="w-28 h-28 object-cover rounded-2xl flex-shrink-0"
                  />
                  
                  {/* Hotel Info */}
                  <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold text-gray-900 truncate">
                        {booking.hotel.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-600">
                        <span>{booking.room.roomType}</span>
                      </p>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-center gap-2">
                      <img src={assets.locationIcon} alt="location icon" className="w-5 h-5" />
                      <span className="text-sm text-gray-600 truncate">{booking.room.hotel.address}</span>
                    </div>
                    
                    {/* Guests */}
                    <div className="flex items-center gap-2">
                      <img src={assets.guestsIcon} alt="guests icon" className="w-5 h-5" />
                      <span className="text-sm text-gray-600">{booking.guests} guests</span>
                    </div>
                    
                    {/* Price */}
                    <p className="text-base font-semibold text-gray-900">
                      Total: <span className="text-2xl">$</span>{booking.totalPrice}
                    </p>
                  </div>
                </div>

                {/* Date & Timing */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Checkin</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(booking.checkInDate).toDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Checkout</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(booking.checkOutDate).toDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-3 w-3 rounded-full ${
                        booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <p className={`text-sm font-semibold ${
                      booking.isPaid ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {booking.isPaid ? 'Paid' : 'Unpaid'}
                    </p>
                  </div>
                  
                  {/* Pay Now Button for unpaid bookings */}
                  {!booking.isPaid && (
                    <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyBookings

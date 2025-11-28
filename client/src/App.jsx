import React, { useState } from 'react';
import NavBar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RoomList from './pages/RoomList';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBooking';
import HotelRegistration from './pages/HotelRegistration';
import Layout from './pages/HotelOwners/Layout';
import Dashboard from './pages/HotelOwners/Dashboard';
import AddRoom from './pages/HotelOwners/AddRoom';
import RoomList_owner from './pages/HotelOwners/RoomList_owner';

const App = () => {



  //hide navbar on owner path
  const isOwnerPath = useLocation().pathname.startsWith('/my-hotels');

  const [showRegistration, setShowRegistration] = useState(false);
  return (
    <div>
      {!isOwnerPath && <NavBar />}
      {false && <HotelRegistration />}
      <div className='min-h-[70vh]'>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<RoomList />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-booking' element={<MyBookings />} />
          <Route path='/my-hotels' element={<Layout />}>
            {/* Nested routes for hotel owners can be added here */}
            <Route index element={<Dashboard/>} />
            <Route path='add-room' element={<AddRoom/>} />
            <Route path='list-room' element={<RoomList_owner/>} />
            
          </Route>

        </Routes>

      </div>
    </div>
  );
}

export default App;
import React from 'react'
import Navbar from '../../components/HotelOwners/Navbar'
import Sidebar from '../../components/HotelOwners/Sidebar'
import { useUser, useClerk } from '@clerk/clerk-react'
import { Outlet } from 'react-router-dom'
const Layout = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    return (

        <div>
            {user ? (
                // if user exists
                <div className="flex flex-col h-screen">
                    <Navbar />
                    <div className="flex h-full">
                        <Sidebar />
                        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            ) : (
                // if user does NOT exist
                <div>
                    {/* maybe a login page or redirect */}
                    (<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
                            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                                Welcome Back!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Please log in to access your dashboard.
                            </p>
                            <button onClick={openSignIn} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded transition">
                                Login
                            </button>
                        </div>
                    </div>)
                </div>
            )}

        </div>
    )
}

export default Layout
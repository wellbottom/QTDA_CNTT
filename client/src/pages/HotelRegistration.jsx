import React, { useState , useEffect} from 'react'
import { assets, cities } from '../assets/assets'
import { UseAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const HotelRegistration = () => {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");

    const {axios, getToken} = UseAppContext();

    const navigate = useNavigate();


    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();


            //debug
            const token = await getToken();
            console.log("Token retrieved:", token ? "EXISTS" : "MISSING");

            //end debug
            const {data} = 
                await axios.post(`/api/hotels`, 
                                {name, contact, address, city},
                                 {headers: 
                                    {Authorization: `Bearer ${await getToken()}`
                
            }});
            if(data.success){
                toast.success(data.message);
                navigate('/');
            }else{
                console.log(data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
            <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'
                    onSubmit={onSubmitHandler}
                    onClick={(e)=>e.stopPropagation}>
                
                {/* LEFT IMAGE */}
                <img 
                    src={assets.regImage} 
                    alt="reg-image" 
                    className='w-1/2 rounded-xl hidden md:block' 
                />

                {/* RIGHT CONTENT WRAPPER */}
                <div className='relative flex flex-col md:w-1/2 p-8 md:p-10'>

                    {/* Close icon */}
                    <img 
                        src={assets.closeIcon} 
                        alt="close-icon" 
                        className='absolute top-4 right-4 h-4 w-4 cursor-pointer' 
                        onClick={() => navigate('/')}
                    />

                    <p className='text-2xl font-semibold mt-6'>
                        Register Your Hotel
                    </p>

                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">Hotel Name</label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Type here"
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                            required
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    {/* Contact */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">Contact</label>
                        <input
                            id='contact'
                            type="text"
                            placeholder="Type here"
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                            required
                            onChange={(e) => setContact(e.target.value)}
                            value={contact}
                        />
                    </div>

                    {/* Address */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">Address</label>
                        <input
                            id='address'
                            type="text"
                            placeholder="Type here"
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                        />
                    </div>

                    {/* City */}
                    <div className='w-full mt-4 max-w-60'>
                        <label className="font-medium text-gray-500">City</label>
                        <select
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
                            required
                            onChange={(e)=> setCity(e.target.value)}
                            value={city}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Register button */}
                    <button className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white px-6 py-2 rounded cursor-pointer mt-6 w-fit'>
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}

export default HotelRegistration

import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useUser } from '@clerk/clerk-react'
import { UseAppContext } from '../../context/AppContext'
import HotelListComponent from '../../components/HotelList'

const AddRoom = () => {


    const { axios, getToken } = UseAppContext();
    const [hotelList, setHotelList] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const { user } = useUser();

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


    const createRoomInHotel = async (e) => {
        e.preventDefault();
        
        if (!selectedHotel) {
            toast.error('Please select a hotel');
            return;
        }
        
        if (!inputs.roomType) {
            toast.error('Please select a room type');
            return;
        }

        if (!inputs.pricePerNight) {
            toast.error('Please enter price per night');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('hotelId', selectedHotel);
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);
            formData.append('description', inputs.description);
            
            // Convert amenities object to array of selected amenities
            const amenitiesArray = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
            formData.append('amenities', JSON.stringify(amenitiesArray));
            formData.append('roomNumber', inputs.roomNumber);

            // Add images
            Object.keys(images).forEach((key) => {
                if (images[key]) {
                    formData.append('images', images[key]);
                }
            });

            const { data } = await axios.post('/api/rooms', formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Room created successfully');
                // Reset form
                setInputs({
                    roomNumber: '',
                    roomType: '',
                    pricePerNight: '',
                    amenities: {
                        'Free Wi-Fi': false,
                        'Air Conditioning': false,
                        'Breakfast Included': false,
                        'Swimming Pool': false,
                    },
                    description: ''
                });
                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                    5: null
                });
                setSelectedHotel('');
            } else {
                toast.error(data.message || 'Failed to create room');
            }
        } catch (error) {
            console.error('Error creating room:', error);
            toast.error(error.response?.data?.message || 'Failed to create room');
        }
    };
    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    })
    const [inputs, setInputs] = useState({
        roomNumber: '',
        roomType: '',
        pricePerNight: '',
        amenities: {
            'Free Wi-Fi': false,
            'Air Conditioning': false,
            'Breakfast Included': false,
            'Swimming Pool': false,
        },
        description: ''
    })

    useEffect(() => {
        if (user) {
            fetchAllHotels(user.id);
        }
    }, [user])


    return (
        <form onSubmit={createRoomInHotel}>
            <Title
                align='left'
                font='outfit'
                title='Add Room'
                subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.'
            />

            {/* Hotel Selection */}
            <HotelListComponent hotelList={hotelList} selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel} />

            {/* Upload Area For Images */}
            <p className='text-gray-800 mt-10'>Images</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key) => (
                    <label htmlFor={`roomImage${key}`} key={key}>
                        <img
                            className='max-h-13 cursor-pointer opacity-80'
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                            alt=""
                        />
                        <input
                            type="file"
                            accept='image/*'
                            id={`roomImage${key}`}
                            hidden
                            onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
                        />
                    </label>
                ))}
            </div>

            {/* Room Types fill area */}
            <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
                <div className='flex-1 max-w-48'>
                    <p className='text-gray-800 mt-4'>Room Type</p>
                    <select
                        value={inputs.roomType}
                        onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
                        className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
                    >
                        <option value="">Select Room Type</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                    </select>
                </div>
                {/* The closing </div> for the outer flex container is missing in the image, but assumed to be here or later */}
            </div>

            {/* price per night fill area */}
            <div>
                <p className='mt-4 text-gray-800'>
                    Price <span className='text-xs'>/night</span>
                </p>
                <input
                    type="number"
                    placeholder='0'
                    className='border border-gray-300 mt-1 rounded p-2 w-24'
                    value={inputs.pricePerNight}
                    onChange={(e) =>
                        setInputs({ ...inputs, pricePerNight: e.target.value })
                    }
                />
            </div>

            {/* amenities fill area */}
            <p className='text-gray-800 mt-4'>Amenities</p>
            <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
                {Object.keys(inputs.amenities).map((amenity, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`amenities${index + 1}`}
                            checked={inputs.amenities[amenity]}
                            onChange={() =>
                                setInputs({
                                    ...inputs,
                                    amenities: {
                                        ...inputs.amenities,
                                        [amenity]: !inputs.amenities[amenity],
                                    },
                                })
                            }
                        />
                        <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
                    </div>
                ))}
            </div>
            <div className='mt-5'>
                <button type='submit' className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition'>
                    Submit
                </button>
            </div>




        </form>
    )

}
export default AddRoom
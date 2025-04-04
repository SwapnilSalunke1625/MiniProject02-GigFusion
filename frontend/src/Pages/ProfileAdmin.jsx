import React, { useState } from 'react';
import { Link } from "react-router-dom";
import AddressAdmin from '../components/dashboard/AddressAdmin';
import PasswordAdmin from '../components/dashboard/PasswordAdmin';
import security from '../components/dashboard/Security';
import Profile from "../components/dashboard/Profile"
import Booking from '../components/dashboard/Booking';
import Balance from '../components/dashboard/Balance';
import LeftArrow from '../components/Assets/Icons/LeftArrow.svg';
import Security from '../components/dashboard/Security';

export default function ProfileAdmin() {

    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [selectedPage, setSelectedPage] = useState('Profile'); // Track the selected page

    // Toggle the panel visibility
    const handleTogglePanel = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    // Render the appropriate component based on the selected page
    const renderPage = () => {
        switch (selectedPage) {
            case 'Profile':
                return <Profile/>;
            case 'Password':
                return <PasswordAdmin />;
            case 'Address':
                return <AddressAdmin />;
            case 'Security':
                return <Security/>;
            case 'MyBooking':
                return <Booking/>;
            case 'NotificationSetting':
                return <div>Notification Setting Content</div>; 
            case 'Balance':
                return <Balance/>; 
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className='px-4 flex gap-20'>
            <div className={`absolute md:relative min-h-screen w-[160px] md:w-[300px] bg-gray-100 shadow-lg transition-transform duration-500 ${isPanelVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='flex'>
                    <div onClick={handleTogglePanel} className='md:hidden rounded-full ml-auto mr-2 mt-2 cursor-pointer'>
                        <img src={LeftArrow} className='h-[20px] md:h-[25px]' alt="Toggle panel" />
                    </div>
                </div>
                <h1 className='text-center text-lg md:text-2xl font-bold mt-2 md:pt-4 text-stdBlue'>Thomas Alisena</h1>

                {/* Profile options */}
                <div className='flex flex-col w-full mt-5 space-y-1'>
                    <button onClick={() => setSelectedPage('Profile')} className='h-[45px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Profile
                    </button>
                    <button onClick={() => setSelectedPage('Password')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Password
                    </button>
                    <button onClick={() => setSelectedPage('Address')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Address
                    </button>
                    <button onClick={() => setSelectedPage('Security')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Security
                    </button>
                    <button onClick={() => setSelectedPage('MyBooking')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        My Booking
                    </button>
                    <button onClick={() => setSelectedPage('NotificationSetting')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Notification Setting
                    </button>
                    <button onClick={() => setSelectedPage('Balance')} className='h-[40px] md:h-[45px] w-full text-base md:text-lg font-semibold rounded-md shadow-md text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>
                        Balance
                    </button>
                </div>

                <div className='flex items-center justify-center mt-8'>
                    <button className='h-[40px] w-[100px] text-base md:text-lg font-semibold bg-orange-500 text-white rounded-full shadow-md hover:bg-btnColor hover:text-white hover:shadow-lg transition-all duration-300 ease-out'>Logout</button>
                </div>
            </div>

            {/* Render selected page */}
            <div className='flex center w-full'>
                {renderPage()}
            </div>
        </div>
    );
}

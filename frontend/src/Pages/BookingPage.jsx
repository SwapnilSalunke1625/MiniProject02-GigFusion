import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import backgroundImage from "../components/Assets/BgImageOfBooking.png"
import NewRequestBooking from '../components/NewRequestBooking'
import CompletedRequestBooking from '../components/CompletedRequestBooking'
import PendingRequestBooking from '../components/PendingRequestBooking'
import BackButton from '../components/BackButton'

export default function BookingPage() {
  // State to manage the active button
  const [activeButton, setActiveButton] = useState('New')

  return (
    <>
    <BackButton />
      <div
        className="h-[250px] w-full flex flex-col items-center justify-start"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <h1 className='text-white mt-2 text-[32px] font-bold mb-2 '>Grow your business with TradeConnect</h1>
        <h2 className='text-white text-[28px]  font-semibold '>"Connect with local customers and </h2>
        <h2 className='text-white text-[28px] font-semibold  mb-10'>expand your service offerings"</h2>
        <h1 className='font-bold text-color3  text-3xl '>Welcome, Sagar Waghmare! Here’s what’s happening today</h1>
      </div>
      
      <div className='flex gap-20'>
        {/* Sticky Request Status Buttons */}
        <div className='w-[350px] h-[150px]  rounded-md border-black ml-4 mt-2 flex flex-col sticky top-4'>
          <div className='h-[80px] flex justify-center items-center border-black rounded-t-xl'>
            <h1 className='text-color1 text-center font-bold text-2xl leading-[1.2]'>Request Status</h1>
          </div>

          <div className='h-[60px] flex justify-around items-center py-2'>
            {/* Button 1: New */}
            <button
              className={`py-1 px-2 text-lg font-semibold rounded-lg relative group ${activeButton === 'New' ? 'border-b-4 border-blue-500' : ''}`}
              onClick={() => setActiveButton('New')}
            >
              New
              <span className={`absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
            </button>

            {/* Button 2: Completed */}
            <button
              className={`py-1 px-2 text-lg font-semibold rounded-lg relative group ${activeButton === 'Completed' ? 'border-b-4 border-green-500' : ''}`}
              onClick={() => setActiveButton('Completed')}
            >
              Completed
              <span className={`absolute bottom-0 left-0 w-0 h-[1px] bg-green-500 transition-all duration-300 group-hover:w-full`}></span>
            </button>

            {/* Button 3: Pending */}
            <button
              className={`py-1 px-2 text-lg font-semibold rounded-lg relative group ${activeButton === 'Pending' ? 'border-b-4 border-yellow-500' : ''}`}
              onClick={() => setActiveButton('Pending')}
            >
              Pending
              <span className={`absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-500 transition-all duration-300 group-hover:w-full`}></span>
            </button>
          </div>
        </div>

        {/* Conditionally Rendered Divs Based on Active Button */}
        <div className='flex flex-col gap-5 justify-center items-center mt-10 ml-5 mb-10'>
          {activeButton === 'New' && (
            <>
              <NewRequestBooking name="Edision Jenn" job="Mechanic" icon="EJ" timeDate="8.00AM 17-Oct-2024" />
              <NewRequestBooking name="Andrew White" job="Plumber" icon="AW" timeDate="10.00AM 23-Aug-2024" />
              <NewRequestBooking name="Hannah Martin" job="Electrician" icon="HM" timeDate="02.00PM 13-March-2024"/>
              <NewRequestBooking name="Oliver Scott" job="Mechanic" icon="OS" timeDate="04.00PM 10-Feb-2024"  />
              <NewRequestBooking name="Thomas Harris" job="Plumber" icon="TH" timeDate="08.00PM 19-Jan-2024" />
            </>
          )}

          {activeButton === 'Completed' && (
            <>
              <CompletedRequestBooking name="Thomas Harris" job="Plumber" icon="TH" timeDate="8.00AM 17-Oct-2024" Money="4200"/>
              <CompletedRequestBooking name="Oliver Scott" job="Mechanic" icon="OS"  timeDate="10.00AM 23-Aug-2024" Money="2000" />
              <CompletedRequestBooking name="Hannah Martin" job="Electrician" icon="HM" timeDate="02.00PM 13-March-2024" Money="3700" />
              <CompletedRequestBooking name="Edision Jenn" job="Mechanic" icon="EJ"  timeDate="04.00PM 10-Feb-2024" Money="4500"/>
              <CompletedRequestBooking name="Edision Jenn" job="Mechanic" icon="EJ"  timeDate="08.00PM 19-Jan-2024" Money="1700"/>
            </>
          )}

          {activeButton === 'Pending' && (
            <div className=" mb-10">
              <PendingRequestBooking name="Thomas Harris" job="Plumber" icon="TH" timeDate="8.00AM 17-Oct-2024"/>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
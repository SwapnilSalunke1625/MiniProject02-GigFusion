import React from 'react'
import gmail from "../components/Assets/Icons/gmail.png";
import headphone from "../components/Assets/Icons/headphone.png";
import address from "../components/Assets/Icons/address.png";

export default function ContactUs() {
    return (
        <>
            <div className='flex items-center justify-center px-5 '>
                <div className='h-auto w-auto  flex flex-col md:flex-row bg-gray-300 p-10 gap-10  rounded-lg'>
                    <div className='text-stdBlue flex flex-col gap-2 p-2'>
                        <h1 className='text-xl font-semibold mt-2 text-center'>Get in touch by with us</h1>
                        <h2 className='text-center text-base'>Connecting with us to get the work done in the less time.</h2>
                        <h2 className='text-center text-base'>Fill the form or send us an email</h2>
                        <button className='border-b-color1 border-b-2 mt-5'></button>

                        <div className='flex gap-8 items-center justify-center mt-4'>
                            <div>
                                <img src={headphone} alt="" className='h-[30px]  mb-2' />
                                <img src={gmail} alt="" className='h-[30px] mb-2' />
                                <img src={address} alt="" className='h-[30px]' />
                            </div>
                            <div className='text-base'>
                                <p>+91-8856917094</p>
                                <p className='mt-3'>tradeconnect@gmail.com</p>
                                <p className='mt-4'>Deogiri college,Aurangabad</p>
                            </div>
                        </div>
                    </div>
                    <div className=' bg-white h-auto w-auto text-center rounded-md flex flex-col gap-6 items-center md:px-20 '>
                        <h2 className='mt-2 text-[24px] font-bold'> Send us message</h2>
                        <input type="text" placeholder='Name' className='h-[40px] w-auto bg-gray-200 rounded-md pl-3 outline-none' />
                        <input type="phone" placeholder='Phone' className='h-[40px] w-auto bg-gray-200 rounded-md pl-3 outline-none' />
                        <input type="email" placeholder='Email' className='h-[40px] w-auto bg-gray-200 rounded-md pl-3 outline-none' />
                        <textarea placeholder='Comment' className='bg-gray-200 h-[140px] w-auto px-2 rounded-md'></textarea>
                    </div>


                </div>
            </div>
        </>
    );
}
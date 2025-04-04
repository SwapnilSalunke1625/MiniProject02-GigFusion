import React from 'react'
import { Link } from 'react-router-dom';
import ServiceProfile from "../components/Assets/serviceProfile.png";
import BackButton from './BackButton';
export default function ProffessionProfile(props) {
    return (
        <>
        <BackButton />
            <div className="h-[320px] w-[250px] border rounded-xl">
                <div>
                    <img src={ServiceProfile} alt="" className="rounded-t-xl h-[160px] w-[250px]" />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-color1 font-bold text-[18px]">{props.name}<span className="text-color3 text-[16px] ml-2 ">★★★★</span></h1>

                    <p className="text-[14px] font-semibold">Plumber | Mechanic | Electrician</p>
                    <button className="border-b-2 w-[180px] mt-2 border-gray-400"></button>

                    <p className="text-[12px] text-justify px-4 mt-2">“We provide the best mechanic and plumbing services in the city”</p>
                    <div className="flex gap-5 mt-3">
                        <Link to="/UserProfile">
                            <button className="h-[30px] w-[90px] bg-btnColor  rounded-2xl text-white font-semibold text-center">Profile</button>
                        </Link>
                        <button className="h-[30px] w-[90px]  bg-color1 rounded-2xl text-white font-semibold text-center">Message</button>
                    </div>
                </div>

            </div>
        </>
    )
}

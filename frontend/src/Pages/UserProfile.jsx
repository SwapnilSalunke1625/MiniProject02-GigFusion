import React from "react";
import { Link } from "react-router-dom";
import ProfileReview from "../components/ProfileReview.jsx";
import ProfilePhoto from "../components/Assets/ProfileImage.jpg";
import BackButton from "../components/BackButton.jsx";

export default function UserProfile(props) {
    return (
        <>
        <BackButton/>
            <div className="flex flex-col lg:flex-row">
                {/* Left Advertisement Section - Hidden on Mobile */}
                <div className="hidden lg:block min-h-screen w-[280px] border-r-2 border-black bg-gray-200 text-center py-5">
                    ADVERTISE
                </div>

                {/* Right Profile Section - Takes Full Width on Mobile */}
                <div className="flex flex-col items-center w-full mt-10 lg:mt-0 lg:px-20">
                    {/* Profile Information */}
                    <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
                        <div>
                            <div className="border h-[250px] w-[250px] rounded-full bg-gray-100 flex justify-center items-center">
                                <img src={ProfilePhoto} className="border h-[240px] w-[240px] rounded-full" />
                            </div>
                            <h1 className="text-center font-semibold text-[24px] mt-5">@UserName</h1>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="flex flex-col">
                                <h1 className="font-bold text-[24px]">@UserName Home Services</h1>
                                <span className="text-color3 text-[34px] pr-10">★ ★ ★ ★</span>
                                <button className="w-full lg:w-[350px] border-b-2"></button>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 items-center">
                                    <h1 className="font-bold text-[18px]">Services</h1>
                                    <h1 className="font-semibold">Electrical | Plumbing | Furniture | Car Wash</h1>
                                </div>
                                <button className="w-full lg:w-[350px] border-b-2 mt-2"></button>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="flex flex-col lg:flex-row gap-2 items-center">
                                    <h1 className="font-bold text-[18px]">Badges</h1>
                                    <button className="h-[25px] w-[50px] border rounded-3xl flex justify-center items-center font-semibold bg-profilebtn text-white">
                                        Elite
                                    </button>
                                    <button className="h-[25px] w-[50px] border rounded-3xl flex justify-center items-center font-semibold bg-footercolr text-white">
                                        Pro
                                    </button>
                                </div>
                                <button className="w-full lg:w-[350px] border-b-2 mt-2"></button>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="flex flex-col lg:flex-row gap-2 items-center">
                                    <h1 className="font-bold text-[18px]">Job History</h1>
                                    <h1 className="font-semibold">Professional Plumber</h1>
                                </div>
                                <button className="w-full lg:w-[350px] border-b-2 mt-2"></button>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-5 mt-8 items-center">
                                <button className="w-[150px] h-[40px] bg-color1 rounded-3xl text-[18px] text-white font-semibold">Hire Me</button>
                                <Link to="/ProfileAdmin">
                                    <button className="w-[150px] h-[40px] bg-btnColor rounded-3xl text-[18px] text-white font-semibold">Let’s Connect</button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="flex flex-col justify-center items-center mt-20 w-full">
                        <h1 className="text-black text-[28px] font-bold">Reviews</h1>
                        <div className="flex flex-col gap-6 mt-8 mb-10 px-2">
                            <ProfileReview name="Oliver Scott" icon="OS" />
                            <ProfileReview name="Lucy Green" icon="LG" />
                            <ProfileReview name="Rachel Baker" icon="RB" />
                            <div className="flex items-center justify-center">
                                <button className="h-[40px] w-[120px] border rounded-3xl bg-btnColor font-semibold text-white">
                                    Show more
                                    <i className="fa-solid fa-chevron-down ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

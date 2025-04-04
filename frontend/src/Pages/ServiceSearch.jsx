import React from "react";
import { Link } from "react-router-dom";
import ProffessionProfile from "../components/ProffessionProfile.jsx";

export default function Servicesearch(props) {
    return (
        <>
            <div className="p-5">
                <h1 className="text-center mt-5 text-2xl md:text-3xl font-bold">
                    We found 12 results for you!
                </h1>

                {/* Search Bar */}
                <div className="flex justify-center mt-10">
                    <input
                        type="text"
                        placeholder="Mechanic near me"
                        className="w-[300px] h-[40px] border-2 rounded-3xl pl-5 mb-5"
                    />
                    <span className="relative left-[-30px] cursor-pointer text-[20px]">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                {/* Main Container */}
                <div className="flex flex-col md:flex-row items-start gap-10 md:gap-20 px-5 md:px-20 mt-10">

                    {/* Filters Section */}
                    <div className="w-full md:w-[300px] h-auto md:h-[450px] rounded-xl border border-black flex flex-col items-center p-5 gap-5">
                        <button className="h-[40px] w-[200px] rounded-xl bg-color1 text-white font-semibold text-lg">Filters</button>

                        <select className="w-full h-[35px] rounded-3xl pl-2 bg-color2">
                            <option value="">Service Type</option>
                            <option value="">Option 1</option>
                            <option value="">Option 2</option>
                            <option value="">Option 3</option>
                            <option value="">Option 4</option>
                        </select>

                        <select className="w-full h-[35px] rounded-3xl pl-2 bg-color2">
                            <option value="">Price Range</option>
                            <option value="">$ - $$</option>
                            <option value="">$$ - $$$</option>
                            <option value="">$$$ - $$$$</option>
                        </select>

                        <select className="w-full h-[35px] rounded-3xl pl-2 bg-color2">
                            <option value="">Availability</option>
                            <option value="">Available</option>
                            <option value="">Unavailable</option>
                        </select>

                        <button className="h-[35px] w-[120px] bg-black text-white rounded-md font-semibold">
                            Apply
                        </button>
                    </div>

                    {/* Profile Results */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        <ProffessionProfile name="John Smith" />
                        <ProffessionProfile name="Emily Clarke" />
                        <ProffessionProfile name="David Johnson" />
                        <ProffessionProfile name="Sarah Williams" />
                        <ProffessionProfile name="James Brown" />
                        <ProffessionProfile name="Laura Davies" />
                        <ProffessionProfile name="Jessica Taylor" />
                        <ProffessionProfile name="Thomas Harris" />
                        <ProffessionProfile name="Rebecca Thompson" />
                        <ProffessionProfile name="Andrew White" />
                        <ProffessionProfile name="Hannah Martin" />
                        <ProffessionProfile name="Oliver Scott" />
                    </div>
                </div>
            </div>
        </>
    );
}

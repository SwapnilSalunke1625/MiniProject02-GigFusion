import React from "react";

const Profile = () => {
  return (
    <>
      <div className='flex  flex-col items-center '>
        <div className=' relative top-10 left-20 h-[450px] w-[500px]  flex flex-col  mt-2 rounded-xl'>
          <h2 className="text-3xl text-center font-bold mb-5 text-stdBlue">Profile Information</h2>
          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex  gap-20">
              <div>
                <h3 className="text-lg font-semibold text-stdBlue">Full Name:</h3>
                <input type="text" className="h-[40px] w-[300px] rounded-md pl-2 text-base outline-none bg-gray-200" value={"Swapnil Salunke"} />

              </div>

              <div>
                <h3 className="text-lg font-semibold text-stdBlue">Email Address:</h3>
                <input type="text" className="h-[40px] w-[300px] rounded-md pl-2 text-base outline-none bg-gray-200" value={"salunkeswapnil145@gmail.com"} />
              </div>

            </div>

            <div className="flex gap-20">
              <div>
              <h3 className="text-lg font-semibold text-stdBlue">Phone Number:</h3>
              <input type="text" className="h-[40px] w-[300px] rounded-md pl-2 text-base outline-none bg-gray-200" value={"8459293092"} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-stdBlue">Location:</h3>
              <input type="text" className="h-[40px] w-[300px] rounded-md pl-2 text-base outline-none bg-gray-200" value={"Pune, Mumbai Maharashtra"} />
            </div>
            </div>

            <div className="flex flex-col ">
              <h3 className="text-lg font-semibold text-stdBlue">About Me:</h3>
           
              <p className=" text-gray-700 bg-gray-200 p-2 rounded-md">
                Hi, I’m Swapnil, a software developer with a passion for UI/UX design and full stack development. I love creating impactful digital experiences.
              </p>
            </div>
          </div>

          {/* Optional Edit Button */}
          <div className="mt-8 flex justify-center">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Edit Profile
            </button>
          </div>
        </div>


      </div>

    </>

  );
};

export default Profile;

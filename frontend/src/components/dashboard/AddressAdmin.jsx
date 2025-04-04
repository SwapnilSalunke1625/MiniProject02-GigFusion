import React from 'react'
import { useState } from 'react'

export default function AddressAdmin() {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateAddress = () => {
    // Basic validation
    if (!addressLine1 || !city || !state || !zipCode) {
      setMessage("Please fill out all fields.");
      return;
    }

    // Here you would typically handle address update logic
    // For demonstration, we'll just show a success message
    setMessage("Address updated successfully!");

    // Reset fields after successful update
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setZipCode("");
  };

  return (
    <>
      <div className='flex  flex-col items-center '>
        <div className=' relative top-10 left-20 h-[450px] w-[500px]  flex flex-col  mt-2 rounded-xl'>
          <h2 className="text-3xl text-center font-bold my-5 text-stdBlue">Update Your Address</h2>

          {/* Address Update Form */}
          <div className="space-y-4">
            <div className='ml-5'>
              <label className="block text-lg font-semibold">Address 1:</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className=" w-[400px] border border-gray-300 rounded-lg p-2"
                placeholder="Enter your address line 1"
              />
            </div>

            <div className='ml-5'>
              <label className="block text-lg font-semibold">Address Line 2:</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className=" w-[400px] border border-gray-300 rounded-lg p-2"
                placeholder="Enter your address line 2 (optional)"
              />
            </div>

            <div className='flex gap-5'>
              <div className='ml-5'>
                <label className="block text-lg font-semibold">City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-[120px] border border-gray-300 rounded-md p-2 "
                  placeholder="city"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold">State:</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-[120px]"
                  placeholder="state"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold">Zip Code:</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-[120px]"
                  placeholder="zip code"
                />
              </div>
            

            </div>
            <div className='relative left-20'>
                 {/* Message Display */}
                 {message && <p className="mt-4 text-red-500 ">{message}</p>}

            </div>
           
          </div>



          {/* Update Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpdateAddress}
              className="bg-stdBlue text-white w-[120px] py-2 rounded-lg text-lg font-bold hover:bg-orange-600"
            >
              Update
            </button>
          </div>
        </div>


      </div>

    </>

  )
}



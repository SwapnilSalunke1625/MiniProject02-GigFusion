import React, { useState } from "react";

const Address = () => {
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
    <div>
      <h2 className="text-3xl font-bold mb-5">Update Address</h2>

      {/* Address Update Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold">Address Line 1:</label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your address line 1"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Address Line 2:</label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your address line 2 (optional)"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">State:</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your state"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Zip Code:</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your zip code"
          />
        </div>
      </div>

      {/* Message Display */}
      {message && <p className="mt-4 text-red-500">{message}</p>}

      {/* Update Button */}
      <div className="mt-8">
        <button
          onClick={handleUpdateAddress}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Update Address
        </button>
      </div>
    </div>
  );
};

export default Address;

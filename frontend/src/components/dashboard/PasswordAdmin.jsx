import React, { useState } from "react";

const PasswordAdmin = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = () => {
    // Basic validation
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Here you would typically handle password change logic
    // For demonstration, we'll just show a success message
    setMessage("Password updated successfully!");

    // Reset fields after successful update
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
    <div className='flex  flex-col items-center '>
    <div className=' relative top-10 left-20 h-[450px] w-[500px]  flex flex-col  mt-2 rounded-xl'>
    
      <h2 className="text-3xl font-bold mb-5 text-center text-stdBlue">Change Password</h2>

      {/* Password Change Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold text-stdBlue">Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-[350px] outline-none text-base"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-stdBlue">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-[350px] outline-none text-base"
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-stdBlue">Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-[350px] outline-none text-base"
            placeholder="Confirm your new password"
          />
        </div>
      </div>

      {/* Message Display */}
      {message && <p className="mt-4 text-red-500 text-center">{message}</p>}

      {/* Update Button */}
      <div className="mt-8 flex items-center justify-center">
        <button
          onClick={handleChangePassword}
          className="font-bold text-white px-6 py-2 rounded-lg bg-stdBlue hover:color1"
        >
          Update Password
        </button>
      </div>
    </div>


    </div>
  
    
    </>
    
  );
};

export default PasswordAdmin;

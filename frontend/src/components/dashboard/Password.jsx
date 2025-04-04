import React, { useState } from "react";

const Password = () => {
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
    <div>
      <h2 className="text-3xl font-bold mb-5">Change Password</h2>

      {/* Password Change Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold">Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Confirm your new password"
          />
        </div>
      </div>

      {/* Message Display */}
      {message && <p className="mt-4 text-red-500">{message}</p>}

      {/* Update Button */}
      <div className="mt-8">
        <button
          onClick={handleChangePassword}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Password;

import React, { useState } from "react";
import Profile from "../components/dashboard/Profile.jsx";  
import Password from "../components/dashboard/PasswordAdmin.jsx";
import Address from "../components/dashboard/AddressAdmin.jsx";
import Security from "../components/dashboard/Security";
import Booking from "../components/dashboard/Booking";
import Notifications from "../components/dashboard/Notifications";
import Balance from "../components/dashboard/Balance";
import Logout from "../components/dashboard/Logout";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  // Function to render content dynamically
  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile />;
      case "Password":
        return <Password />;
      case "Address":
        return <Address />;
      case "Security":
        return <Security />;
      case "Booking":
        return <Booking />;
      case "Notification Settings":
        return <Notifications />;
      case "Balance":
        return <Balance />;
      case "Logout":
        return <Logout />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-5">
        <h2 className="text-xl font-bold mb-5">Swapnil Salunke</h2>
        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("Profile")}
            className={`cursor-pointer p-3 ${
              activeTab === "Profile" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Profile
          </li>
          <li
            onClick={() => setActiveTab("Password")}
            className={`cursor-pointer p-3 ${
              activeTab === "Password" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Password
          </li>
          <li
            onClick={() => setActiveTab("Address")}
            className={`cursor-pointer p-3 ${
              activeTab === "Address" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Address
          </li>
          <li
            onClick={() => setActiveTab("Security")}
            className={`cursor-pointer p-3 ${
              activeTab === "Security" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Security
          </li>
          <li
            onClick={() => setActiveTab("Booking")}
            className={`cursor-pointer p-3 ${
              activeTab === "Booking" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Booking
          </li>
          <li
            onClick={() => setActiveTab("Notification Settings")}
            className={`cursor-pointer p-3 ${
              activeTab === "Notification Settings" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Notification Settings
          </li>
          <li
            onClick={() => setActiveTab("Balance")}
            className={`cursor-pointer p-3 ${
              activeTab === "Balance" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Balance
          </li>
          <li
            onClick={() => setActiveTab("Logout")}
            className={`cursor-pointer p-3 ${
              activeTab === "Logout" ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10">{renderContent()}</div>
    </div>
  );
};

export default UserDashboard;
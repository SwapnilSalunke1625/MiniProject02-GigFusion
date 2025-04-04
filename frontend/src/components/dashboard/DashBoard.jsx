import React, { useState } from "react";

// Dummy components for each tab content
const Profile = () => (
  <div>
    <h2 className="text-2xl font-bold">Profile</h2>
    <p className="mt-2">Here is the profile information of Swapnil Salunke.</p>
  </div>
);

const Password = () => (
  <div>
    <h2 className="text-2xl font-bold">Password</h2>
    <p className="mt-2">Change your password here.</p>
  </div>
);

const Address = () => (
  <div>
    <h2 className="text-2xl font-bold">Address</h2>
    <p className="mt-2">Update your address information.</p>
  </div>
);

const Security = () => (
  <div>
    <h2 className="text-2xl font-bold">Security</h2>
    <p className="mt-2">Review security settings and permissions.</p>
  </div>
);

const Booking = () => (
  <div>
    <h2 className="text-2xl font-bold">Booking</h2>
    <p className="mt-2">View and manage your bookings.</p>
  </div>
);

const Notifications = () => (
  <div>
    <h2 className="text-2xl font-bold">Notifications</h2>
    <p className="mt-2">Manage your notification preferences.</p>
  </div>
);

const Balance = () => (
  <div>
    <h2 className="text-2xl font-bold">Balance</h2>
    <p className="mt-2">Check your account balance and transactions.</p>
  </div>
);

const Logout = () => (
  <div>
    <h2 className="text-2xl font-bold">Logout</h2>
    <p className="mt-2">You have been logged out successfully.</p>
  </div>
);

const Dashboard = () => {
  // State to manage which component to display on the right
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
      <div className="w-1/4 bg-gray-100 p-5 shadow-lg">
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
      <div className="w-3/4 p-10 bg-white shadow-lg">
        {/* Render dynamic content here */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

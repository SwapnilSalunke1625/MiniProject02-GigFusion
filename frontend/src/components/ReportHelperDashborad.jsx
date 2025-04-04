import React from "react";
import { Link } from "react-router-dom";

const ReportHelperDashborad = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Active Projects */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
        <p className="text-2xl font-bold mt-1">{stats?.activeProjects || 0}</p>
        <div className="mt-4">
          <Link to="/projects" className="text-blue-600 text-sm hover:underline">
            View projects →
          </Link>
        </div>
      </div>

      {/* Sent Proposals */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Sent Proposals</h3>
        <p className="text-2xl font-bold mt-1">{stats?.sentProposals || 0}</p>
        <div className="mt-4">
          <Link to="/proposals" className="text-blue-600 text-sm hover:underline">
            View proposals →
          </Link>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Completed Projects</h3>
        <p className="text-2xl font-bold mt-1">{stats?.completedProjects || 0}</p>
      </div>

      {/* Total Earnings */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
        <p className="text-2xl font-bold mt-1">${stats?.totalEarnings || 0}</p>
        <div className="mt-4">
          <Link to="/payments" className="text-blue-600 text-sm hover:underline">
            View payments →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportHelperDashborad;
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const EscrowLandingPage = () => {
    return (
        <div className="container mx-auto py-10 px-4 lg:px-20">
            <h1 className="text-3xl font-bold text-center mb-8">Escrow Payments</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pending Escrow Payments */}
                <div className="bg-blue-50 border border-blue-500 rounded-lg p-6 text-center shadow-md">
                    <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Pending</h2>
                    <p className="text-gray-600">List of pending escrow payments.</p>
                    <button className="mt-4 px-4 py-2 border rounded-lg text-blue-600 border-blue-500 hover:bg-blue-100">View Details</button>
                </div>

                {/* Completed Escrow Payments */}
                <div className="bg-green-50 border border-green-500 rounded-lg p-6 text-center shadow-md">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Completed</h2>
                    <p className="text-gray-600">List of completed escrow payments.</p>
                    <button className="mt-4 px-4 py-2 border rounded-lg text-green-600 border-green-500 hover:bg-green-100">View Details</button>
                </div>

                {/* Disputed Escrow Payments */}
                <div className="bg-yellow-50 border border-yellow-500 rounded-lg p-6 text-center shadow-md">
                    <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Disputed</h2>
                    <p className="text-gray-600">List of disputed escrow payments.</p>
                    <button className="mt-4 px-4 py-2 border rounded-lg text-yellow-600 border-yellow-500 hover:bg-yellow-100">View Details</button>
                </div>

                {/* Cancelled Escrow Payments */}
                <div className="bg-red-50 border border-red-500 rounded-lg p-6 text-center shadow-md">
                    <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Cancelled</h2>
                    <p className="text-gray-600">List of cancelled escrow payments.</p>
                    <button className="mt-4 px-4 py-2 border rounded-lg text-red-600 border-red-500 hover:bg-red-100">View Details</button>
                </div>
            </div>
        </div>
    );
};

export default EscrowLandingPage;
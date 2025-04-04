import { FaUserCircle } from 'react-icons/fa';

export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    ))}
                </div>

                {/* Content Cards Skeleton */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 border border-gray-100 rounded-xl p-4 animate-pulse">
                            <div className="flex-shrink-0">
                                <FaUserCircle className="text-gray-200 text-5xl" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
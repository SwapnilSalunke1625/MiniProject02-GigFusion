export default function ReviewSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    {/* Header Skeleton */}
                    <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300"></div>

                    {/* Form Skeleton */}
                    <div className="p-8 space-y-6">
                        {/* Rating Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                ))}
                            </div>
                        </div>

                        {/* Select Box Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                            <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                        </div>

                        {/* Date Input Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                            <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                        </div>

                        {/* Textarea Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                            <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="flex gap-4">
                            <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
                            <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
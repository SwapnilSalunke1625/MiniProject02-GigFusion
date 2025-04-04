// components/ui/button.js
import React from "react";
import clsx from "clsx";

export const Button = ({ variant = "default", className, children, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
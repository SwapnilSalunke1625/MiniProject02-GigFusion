// components/ui/card.js
import React from "react";
import clsx from "clsx";

export const Card = ({ className, children }) => {
    return (
        <div className={clsx("rounded-2xl shadow-lg border p-4 bg-white", className)}>
            {children}
        </div>
    );
};

export const CardContent = ({ className, children }) => {
    return <div className={clsx("p-4", className)}>{children}</div>;
};
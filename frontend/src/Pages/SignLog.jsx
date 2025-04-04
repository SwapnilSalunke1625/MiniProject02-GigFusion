"use client";
import React from "react";
import { Boxes } from "./../components/ui/background-boxes";
import { cn } from "./../lib/utils";
import { Link } from "react-router-dom";


export function SignLog() {
  return (
    <div
      className="relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg"
      style={{ minHeight: "calc(100vh - 64px)" }} // Adjust for navbar height
    >
      <div
        className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"
      />
      <Boxes />
      
      {/* Sign Up & Login Box */}
      <div className="relative z-20 flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg w-full max-w-md">
       
        <h1 className="text-color1 font-bold text-3xl mt-2">
          Gig <span className="text-stdBlue">Fusion</span>
        </h1>

        <div className="flex flex-col gap-4 w-full mt-5">
          {/* Sign Up Button */}
          <Link to="/signup">
            <button className="h-12 w-full rounded-full border text-lg bg-gray-100">
              Sign Up
            </button>
          </Link>

          {/* Login Button */}
          <Link to="/login">
            <button className="h-12 w-full rounded-full border bg-stdBlue text-white text-lg">
              Login
            </button>
          </Link>
        </div>

        {/* Terms & Privacy */}
        <p className="text-sm text-neutral-500 mt-5 max-w-[300px]">
          By signing up you agree to our <span className="font-bold text-stdBlue">Terms of Use</span> and <span className="font-bold text-stdBlue">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

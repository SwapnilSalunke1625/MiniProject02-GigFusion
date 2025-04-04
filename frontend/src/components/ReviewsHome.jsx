import React from 'react'
import { useState } from 'react';

export default function ReviewsHome(props) {

  return (
    <>
         <div className="bg-gray-300  text-stdBlue shadow-lg rounded-lg p-2  text-justify max-w-[500px]">
              <div className='flex gap-2 md:justify-between'>
                <h3 className="font-semibold text-base md:text-xl pl-4">{props.name}.</h3>
                <span className="text-orange-500 text-lg md:text-2xl md:pr-10 pr-0">★★★★</span>
              </div>
              <p className="text-black text-xs md:text-sm p-2 mt-1 flex flex-wrap">
                Vitalii assembled the IKEA Norli drawer chest for me in less than 30 minutes, and he assembled a metal wire shelving unit as well in about 10 minutes. He also fixed a drawer on an already assembled desk so it
              </p>
              <p className="text-stdBlue font-semibold text-right mr-2 text-sm pb-1">IKEA Furniture Assembly</p>
          </div>
    </>
  )
}
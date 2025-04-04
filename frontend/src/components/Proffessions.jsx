import React from 'react'

export default function Proffessions() {
  return (
    <div className="flex w-[550px] justify-between text-[40px] font-bold mt-6 text-stdBlue">

    <div id="transportation">
      <i className="fa-solid fa-truck"></i>
      <p className='text-[12px]'>Moving</p>
    </div>
    <div id="electricity">
    <i className="fa-solid fa-plug-circle-bolt"></i>
    <p className='text-[12px]'>Electrical</p>
    </div>
    <div id="carpenter">
    <i className="fa-solid fa-hammer"></i>
    <p className='text-[12px]'>Carpenter</p>
    </div>
    <div id="cleaning">
    <i className="fa-solid fa-paintbrush"></i>
    <p className='text-[12px]'>Painting</p>
    </div>
    <div id="cleaning">
    <i className="fa-solid fa-broom"></i>
    <p className='text-[12px]'>Cleaning</p>
    </div>
    <div id="water">
    <i className="fa-solid fa-water"></i>
    <p className='text-[12px]'>Plumbing</p>
    </div>


  </div>
  )
}

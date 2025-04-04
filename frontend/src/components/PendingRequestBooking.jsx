import React from "react";

export default function PendingRequestBooking(props) {
    return (
        <div className='h-[320px] w-[800px] bg-Pendingbg rounded-2xl p-2'>
            <div className='flex justify-between'>
                
                <div className='flex flex-col  py-2'>
                    <div className='flex gap-20'>
                        <div className='flex gap-2 items-center'>
                            <div className='h-[40px] w-[40px] rounded-full bg-color1 flex justify-center items-center text-white font-semibold text-lg'>
                                {props.icon}
                            </div>
                            <h1 className='text-lg font-bold'>{props.name}</h1>
                        </div>
                    </div>
                    <div className='flex gap-5 ml-10 mt-1'>
                        <button className='h-[25px] w-[60px] rounded-full text-xs font-bold bg-white'>1km</button>
                        <button className='h-[25px] w-[60px] rounded-full text-xs font-bold bg-white'>Home</button>
                    </div>
                    <div className='pl-3 mt-3'>
                        <h1 className='font-bold text-md'>Job Type: <span className='font-semibold text-sm'>{props.job}</span></h1>
                        <p className='w-[400px] font-bold text-md'>Requirements: <span className='font-semibold text-sm'>alkfdaskfd asijfda jsdafaskdf kasdhdfksdahf khasdkfh askfhdksfh dskfhfh.</span></p>
                        <p className='font-bold text-md'>Address: <span className='font-semibold text-sm'>Customer Address</span></p>
                    </div>
                </div>
                <h1 className='text-xs font-bold text-btnColor' >{props.timeDate}</h1>
                <div className='flex flex-col justify-center mr-20'>
                    <button className='h-[50px] w-[140px] rounded-xl text-md text-white font-bold bg-Completedchat flex justify-center items-center'>
                        <i className="fa-brands fa-rocketchat text-xl mr-2 text-color1"></i> Let's chat
                    </button>
                </div>
            </div>
            <div className='flex justify-center relative' style={{ top: '-20px'}}>
                <h1 className='text-lg font-bold text-btnColor'>Service Journey</h1>
            </div>

            {/* Progress Bar */}
            <div className='flex items-center px-10 relative' style={{ top: '-10px'}}>
                <div className='flex-1 relative'>
                    {/* Background Progress Bar */}
                    <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                        <div className='h-2 w-full rounded-l-3xl bg-trackBar' />
                        <div className='h-2 rounded-r-full rouded-l-3xl bg-white ' style={{ width: '25%' }} />
                    </div>

                    {/* Rounded Icons on the Progress Bar */}
                    <div className='flex justify-between relative z-10'>
                        <span className='flex flex-col items-center relative' style={{ top: '10px', left:'10px'}}>
                            <div className='h-[40px] w-[40px] rounded-full bg-trackBar border-2 border-white flex justify-center items-center'>
                            <i className="fa-solid fa-person text-2xl "></i>
                            </div>
                            <span className='text-sm mt-1 font-bold'>Start</span>
                        </span>
                        <span className='flex flex-col items-center relative' style={{ top: '10px' }}>
                            <div className='h-[40px] w-[40px] rounded-full bg-trackBar border-2 border-white flex justify-center items-center'>
                                <i className="fa-solid fa-hourglass-half text-black text-2xl"></i>
                            </div>
                            <span className='text-sm mt-1'>In Progress</span>
                        </span>
                        <span className='flex flex-col items-center relative' style={{ top: '10px' }}>
                            <div className='h-[40px] w-[40px] rounded-full bg-trackBar border-2 border-white flex justify-center items-center'>
                                <i className="fa-solid fa-circle-check text-black text-2xl"></i>
                            </div>
                            <span className='text-sm mt-1'>Complete</span>
                        </span>
                        <span className='flex flex-col items-center relative' style={{ top: '10px' }}>
                            <div className='h-[40px] w-[40px] rounded-full bg-white border-2 border-gray-300 flex justify-center items-center'>
                                <i className="fa-solid fa-dollar-sign text-black  text-2xl"></i>
                            </div>
                            <span className='text-sm mt-1'>Payment</span>
                        </span>
                    </div>
                </div>
            </div>

           
                      
            


            {/* Rounded Icons on the Progress Bar */}


        </div>
    );
}
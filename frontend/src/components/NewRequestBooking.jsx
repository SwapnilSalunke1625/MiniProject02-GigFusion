import React from 'react'

export default function NewRequestBooking(props) {
    return (
        <>
        
            <div className='h-[200px] w-[800px] bg-newRequest  rounded-2xl'>
                
                <div className='flex justify-between'>

                    <div className='flex flex-col  px-2 py-2'>
                        <div className='flex gap-20'>
                            <div className='flex gap-2 items-center'>
                                <div className='h-[40px] w-[40px] rounded-full  bg-color1 flex justify-center items-center text-white font-semibold text-lg '>{props.icon}</div>
                                <h1 className='text-lg font-bold'>{props.name}</h1>
                            </div>
                            <div className='flex gap-2 items-center'>
                                {/* <div className='h-[30px] w-[30px] rounded-full  bg-color1 flex justify-center items-center text-white font-semibold text-lg '>SS</div> */}
                                {/* <h1 className='text-lg font-bold'>Swapnil Salunke Home Services</h1> */}
                            </div>
                        </div>
                        <div className='flex gap-5 ml-10 mt-1'>
                            <button className='h-[25px] w-[60px] rounded-full text-xs font-bold bg-white'> 1km</button>
                            <button className='h-[25px] w-[60px] rounded-full text-xs font-bold bg-white'>Home</button>
                        </div>
                        <div className='pl-3 mt-3'>
                            <h1 className='font-bold text-md'>Job Type: <span className='font-semibold text-sm'>{props.job}</span></h1>
                            <p className='w-[400px] font-bold text-md'>Requirements: <span className='font-semibold  text-sm'>alkfdaskfd asijfda jsdafaskdf kasdhdfksdahf khasdkfh askfhdksfh dskfhfh.</span></p>
                            <p className='font-bold text-md'>Address : <span className='font-semibold text-sm'>Customer Address</span></p>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <h1 className='text-xs font-bold text-btnColor '>{props.timeDate}</h1>
                    </div>
                    

                    <div className='flex flex-col justify-center mr-20 '>
                        <div className='flex flex-col gap-8 '>
                            <button className='h-[35px] w-[100px] rounded-full text-md text-white font-bold bg-greenFlag flex justify-center items-center'><i className="fa-solid fa-check mr-2 mt-1"></i>Accept </button>
                            <button className='h-[35px] w-[100px] rounded-full text-md text-white font-bold bg-redflag flex justify-center items-center'><i className="fa-solid fa-xmark mr-2 mt-1"></i> Ignore</button>
                        </div>
                    </div>


                </div>


            </div>

        </>
    )
}
import React from 'react'

export default function CompletedRequestBooking(props) {
    return (
        <>

            <div className='h-[300px] w-[800px] bg-bgCompleted  rounded-2xl'>       
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
                    <h1 className='text-xs font-bold text-btnColor mt-2'>{props.timeDate}</h1>
                    <div className='flex flex-col justify-center mr-20 '>
                        <button className='h-[50px] w-[140px] rounded-xl text-md text-white font-bold bg-Completedchat flex justify-center items-center'><i className="fa-brands fa-rocketchat text-xl mr-2 text-color1"></i>Let's chat</button>
                    </div>

                </div>
                
                <div className='flex  justify-between'>
                    <div className='ml-5 mt-6'>
                        <h1 className='font-bold'>Download Receipt </h1>
                        <div className='flex justify-center items-center mt-1'>
                         <button className='h-[35px] w-[85px] flex items-center justify-center rounded-lg bg-green-500 text-white mt-1 '>Invoice<i className="fa-solid fa-download text-sm ml-2"></i></button>

                        </div>
                        
                    </div>
                    
                    <div className='mt-2 mr-7'>
                        <h1 className='font-bold text-lg'>Completed <span><i className="fa-solid fa-circle-check text-greenFlag text-xl"></i></span></h1>
                        <h1 className='font-semibold'>Advance Payment : <span className='font-bold'>Yes</span> </h1>
                        <h1 className='font-semibold'>Total Charges : <span className='font-bold'>{props.Money}</span></h1>
                        
                    </div>



                </div>


            </div>

        </>
    )
}

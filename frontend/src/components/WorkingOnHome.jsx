import React from 'react'

export default function WorkingOnHome() {
    return (
        <>
            <div className='bg-stdBg h-[400px] flex flex-col'>
                <h1 className='text-center text-headTag font-bold mt-8 text-stdBlue '>How it works</h1>
                <div className='flex justify-around mt-8 '>
                    <div className='h-[300px] w-[300px]  flex flex-col '>
                        <i className="fa-regular fa-comment-dots text-homeTag text-center mb-3"></i>
                        <h1 className='text-ternaryFont font-bold text-stdBlue'>1. Tell us what your home needs</h1>
                        <p className='text-justify mt-5'>From routine maintenance and repairs to dream home renovations, we can help with any project — big or small.</p>
                    </div>
                    <div className='h-[300px] w-[300px]  flex flex-col'>
                    <i className="fa-solid fa-bolt text-homeTag text-center mb-3"></i>
                    <h1 className='text-ternaryFont font-bold text-stdBlue'>2. We’ll match you with personalized solutions</h1>
                    <p className='text-justify mt-5'>See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.</p>
                    
                    </div>
                    <div className='h-[300px] w-[300px]  flex flex-col '>
                    <i className="fa-solid fa-house text-homeTag text-center mb-3"></i>
                    <h1 className='text-ternaryFont font-bold text-stdBlue'>3. Start to finish, we’ve got you covered</h1>
                    <p className='text-justify mt-5'>When you book and pay with Angi, you’re covered by our Happiness Guarantee. We’ll cover your projects up to full purchase price, plus limited damage protection.</p>
                    
                    </div>
                </div>

            </div>
        </>
    )
}

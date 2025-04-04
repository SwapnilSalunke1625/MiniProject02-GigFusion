import React from 'react';
import phonecase from '../assets/phonecase.png'
import LoginPagePhone from '../assets/LoginPagePhone.png'
import HomePagePhoto from '../assets/HomePagePhoto01.png'

export default function HomePage() {
  return (
    <>

      <div className="grid grid-cols-12 gap-2">

        <section class="py-24 relative col-span-12 h-[90vh] flex items-center justify-center">
          <img class="lg:mx-0 mx-auto h-full object-cover object-left-top absolute top-0 left-0 z-10 opacity-25 w-full" src="https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-25051.jpg?ga=GA1.1.863066051.1726057861&semt=ais_hybrid" alt="about Us image" />
          <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto relative z-20">
            <div class="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
              <div class="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                <div class="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                  <h2 class="text-gray-900 text-[40px] font-extrabold font-Poppins leading-normal lg:text-start text-center">Find Trusted Local Professionals for Your Home Services</h2>
                  <p class="text-gray-700 text-[18px] leading-relaxed lg:text-start text-center">Our platform helps you easily connect with reliable professionals for all your home service needs. Whether it’s repairs, renovations, or maintenance, we make it simple to find and hire skilled experts you can trust.</p>
                </div>
                <button class="sm:w-fit w-full px-3.5 py-2 bg-Btn-color2 hover:bg-slate-600 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                  <span class="px-1.5 text-white text-sm font-medium leading-6">Get Started</span>
                </button>
              </div>
              <img class="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-25051.jpg?ga=GA1.1.863066051.1726057861&semt=ais_hybrid" alt="about Us image" />
            </div>
          </div>
        </section>

        <section className='col-span-12'>
          <div className='flex flex-col w-full max-w-7xl mx-auto'>
            <h1 className='text-center font-extrabold text-4xl mt-8 text-Btn-color2 '>How it works</h1>
            <div className='flex justify-around mt-8 rounded-md'>
              <div className='w-[400px]  flex flex-col items-center border-2 border-solid border-black shadow-xl shadow-black bg-Btn-color opacity-80 p-4 rounded-xl'>
                <i className="fa-regular fa-comment-dots text-homeTag text-center mb-3"></i>
                <h1 className='text-ternaryFont font-bold text-stdBlue'>1. Tell us what your home needs</h1>
                <p className='text-justify mt-5'>From routine maintenance and repairs to dream home renovations, we can help with any project — big or small.</p>
              </div>

              <div className='w-[400px]  flex flex-col items-center border-2 border-solid border-black shadow-xl shadow-black bg-Btn-color opacity-80 p-4 rounded-xl'>
                <i className="fa-solid fa-bolt text-homeTag text-center mb-3"></i>
                <h1 className='text-ternaryFont font-bold text-stdBlue'>2. We’ll match you with personalized solutions</h1>
                <p className='text-justify mt-5'>See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.</p>
              </div>

              <div className='w-[400px]  flex flex-col items-center border-2 border-solid border-black shadow-xl shadow-black bg-Btn-color opacity-80 p-4 rounded-xl'>
                <i className="fa-solid fa-house text-homeTag text-center mb-3"></i>
                <h1 className='text-ternaryFont font-bold text-stdBlue'>3. Start to finish, we’ve got you covered</h1>
                <p className='text-justify mt-5'>When you book and pay with us, you’re covered by our Happiness Guarantee. We’ll cover your projects up to full purchase price, plus limited damage protection.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="my-16 py-24 relative col-span-12">
          <img class="absolute top-0 left-0 z-10 opacity-25 w-full lg:mx-0 mx-auto h-full object-cover object-center" src="https://pagedone.io/asset/uploads/1717741205.png" alt="about Us image" />
          <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto relative z-20">
            <div class="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
              <div
                class="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
                <div class="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
                  <img class=" rounded-xl object-cover" src="https://pagedone.io/asset/uploads/1717741205.png" alt="about Us image" />
                </div>
                <img class="sm:ml-0 ml-auto rounded-xl object-cover" src="https://pagedone.io/asset/uploads/1717741215.png"
                  alt="about Us image" />
              </div>
              <div class="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                <div class="w-full flex-col justify-center items-start gap-8 flex">
                  <div class="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2
                      class="text-gray-900 text-4xl font-bold font-Poppins leading-normal lg:text-start text-center">
                      Empowering Each Other to Succeed</h2>
                    <p class="text-black text-base font-normal leading-relaxed lg:text-start text-center">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor provident consequatur similique quasi corrupti, vel, molestiae consectetur ratione soluta accusantium veritatis nulla laudantium distinctio repudiandae. Et necessitatibus suscipit natus autem.</p>
                  </div>
                  <div class="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                    <div class="flex-col justify-start items-start inline-flex">
                      <h3 class="text-gray-900 text-4xl font-bold font-Poppins leading-normal">33+</h3>
                      <h6 class="text-black text-base font-normal leading-relaxed">Years of Experience</h6>
                    </div>
                    <div class="flex-col justify-start items-start inline-flex">
                      <h4 class="text-gray-900 text-4xl font-bold font-Poppins leading-normal">125+</h4>
                      <h6 class="text-black text-base font-normal leading-relaxed">Successful Projects</h6>
                    </div>
                    <div class="flex-col justify-start items-start inline-flex">
                      <h4 class="text-gray-900 text-4xl font-bold font-Poppins leading-normal">99%</h4>
                      <h6 class="text-black text-base font-normal leading-relaxed">Happy Clients</h6>
                    </div>
                  </div>
                </div>
                {/* <button
                  class="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                  <span class="px-1.5 text-white text-sm font-medium leading-6">Read More</span>
                </button> */}
              </div>
            </div>
          </div>
        </section>

        <section className='col-span-12 bg-gradient-to-t from-Btn-color'>
          <div className='flex flex-col w-full max-w-7xl mx-auto'>
            <div className='flex justify-around mt-8 rounded-md'>
              <div className='w-[400px]  flex flex-col items-center p-4'>
                <h1 className='text-3xl text-ternaryFont font-bold text-stdBlue'>Book home services in an instant.</h1>
                <p className='font-semibold text-justify mt-5'>Get the help you need — when you need it — with upfront pricing and instant booking for plumbing, cleaning and more.</p>
              </div>

              <div className='w-[400px]  flex flex-col items-center p-4'>
                <h1 className='text-3xl text-ternaryFont font-bold text-stdBlue'>Stay on top of routine upkeep.</h1>
                <p className='font-semibold text-justify mt-5'>Easily schedule home care and maintenance projects to keep your home looking fresh and running smoothly year-round.</p>
              </div>

              <div className='w-[400px]  flex flex-col items-center p-4'>
                <h1 className='text-3xl text-ternaryFont font-bold text-stdBlue'>Bring your dream home to life.</h1>
                <p className='font-semibold text-justify mt-5'>Find information and inspiration to kick-start bigger home projects — and connect with trusted pros to bring your visions to life.</p>
              </div>
            </div>
          </div>
        </section>

        <section className='col-span-12'>
          <div className="flex flex-col items-center justify-center text-center pt-16 bg-gradient-to-b from-Btn-color">
            <p className='font-semibold'>Vetted Pros</p>
            <h2 className='font-bold text-4xl w-96'>We'll match you with personalized solutions</h2>
            <p className='m-4'>See your price and book services in an instant. <br /> Or, request and compare quotes from highly rated pros near you.</p>
            <img className='h-96' src={HomePagePhoto} alt="Work" />
            <p className='w-[54rem] mt-16 mb-32 font-semibold text-lg'>TradeConnect is the go-to platform for tradespeople and customers looking for reliable services. Our team is dedicated to connecting you with skilled professionals in your area, ensuring top-notch quality and customer satisfaction. Join TradeConnect today and experience the difference!</p>
          </div>
        </section>

      </div>
    </>
  );
}
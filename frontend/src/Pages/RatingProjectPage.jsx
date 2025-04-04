import { FiMail } from 'react-icons/fi';
import axios from "axios";
import EmailPhoto from "./../components/Assets/EmailModulePhoto01.png";




export default function RatingProjectPage() {
  const sendMail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/users/sendMail',
        {
          email: e.target[0].value,
          name: e.target[1].value
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      alert('Thank you! Information sent successfully.');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  

  return (
    <div className="p-5 w-[1300px] h-[600px] rounded-3xl bg-gray-100 flex flex-col justify-center items-center mt-10">
      <h2 className='text-stdBlue font-bold text-3xl'>"Unlock All Available Places – We’ll Send You the List!"</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-14 w-full h-full px-10">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-[45%] flex justify-center">
          <img 
            src={EmailPhoto} 
            alt="Email photo" 
            className="w-[350px] md:w-[450px] transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Side - Form Box */}
        <div className="w-full md:w-[55%]">
          <div className="bg-gray-200 rounded-xl shadow-lg p-10 w-full h-full max-w-xl mx-auto flex flex-col justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-stdBlue flex flex-col items-center gap-2 font-bold text-3xl mb-8">
              <FiMail className="text-color1 text-4xl " /> Check Your Inbox
            </h2>
            <form onSubmit={sendMail} className="space-y-6">
              <div className="flex flex-col gap-6">
                <input className="w-full h-14 text-lg rounded-xl px-5 border border-gray-300 outline-none focus:ring-1 focus:ring-stdBlue transition-all" type="email" placeholder="Enter your mail" required />
                <input className="w-full h-14 text-lg rounded-xl px-5 border border-gray-300 outline-none focus:ring-1 focus:ring-stdBlue transition-all" type="text" placeholder="Enter your name" required />
              </div>
              <div className='flex items-center justify-center'>
              <button type="submit" className="bg-stdBlue  text-white py-3 w-[150px]  rounded-full text-xl font-bold flex items-center gap-3 justify-center hover:bg-color1 hover:scale-105 transition-all duration-300 shadow-md ">
                 Submit
              </button>

              </div>
              
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

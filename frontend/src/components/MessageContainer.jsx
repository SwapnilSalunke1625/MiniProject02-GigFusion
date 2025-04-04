import { useEffect, useState, useRef } from "react";
import userConversation from "../Zustans/userConversation.js";
import axios from 'axios';
import Cookies from 'js-cookie';
import { TiMessages } from 'react-icons/ti';
import { IoArrowBackSharp } from 'react-icons/io5';
import { IoSend } from 'react-icons/io5';
import { useSocketContext } from "../context/SocketContext.jsx";
import notification from './Assets/sound/notification.mp3';


const MessageContainer = ({ onBackUser }) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const { socket } = useSocketContext();
  const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
  const lastMessageRef = useRef();
  const [sendData, setSendData] = useState('');

  // Fetch the authenticated user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get('/api/v1/users/current-user', {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            Content: 'application/json',
          }
        });
        // console.log('auth user:', res.data.data);
        setAuthUser(res.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/users/get-message/${selectedConversation?._id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            Content: 'application/json',
          }
        });
        const response = res.data;
        // console.log('Response: ', response);
        if (response.success === false) {
          console.error('Error fetching messages:', response.message);
        } else {
          setMessage(response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
    // console.log('Sender ID:', messages[0]._id);
  }, [selectedConversation?._id, setMessage]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };

    scrollToBottom();
  }, [messages]);

  const handelMessages = (e) => {
    setSendData(e.target.value);
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      console.log('Message being sent:', sendData);
      const res = await axios.post(`/api/v1/users/send-message/${selectedConversation?._id}`, {
        message: sendData
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          Content: 'application/json',
        }
      })

      const response = res.data;
      console.log('Response:', res);
      if (response.success === false) {
        setSending(false);
        console.error('Error sending message:', response.message);
      } else {
        setSending(false);
        setSendData('');
        setMessage([...messages, response.data]);
      }

    } catch (error) {
      setSending(false);
      console.error('Error sending message:', error);
    }
  }

  //   useEffect(() => {
  //     const handleNewMessage = (message) => {
  //         const sound = new Audio(notification);
  //         sound.play();
  //         setMessage((prevMessages) => [...prevMessages, message]);
  //     };

  //     socket?.on('newMessage', handleNewMessage);
  //     return () => socket?.off('newMessage', handleNewMessage);
  // }, [socket, setMessage]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notification);
      sound.play();
      setMessage([...messages, newMessage])
    })

    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages]);

  return (
    <div className='min-w-full md:min-w-[79vw] md:max-w-[79vw] h-[90vh] flex flex-col'>
      {selectedConversation === null ? (
        <div className='flex items-center justify-center w-full h-full'>
          <div className='px-4 text-center text-2xl text-gray-950 font-semibold 
            flex flex-col items-center gap-2'>
            <p className='text-2xl'>Welcome, {authUser?.fullName}!</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className='text-6xl text-center' />
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-between gap-1 bg-white md:px-2 h-10 md:h-12 py-8 border-b-2 border-b-black'>
            <div className='flex gap-2 md:justify-between items-center w-full'>
              <div className='md:hidden ml-1 self-center'>
                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1
                   self-center'>
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className='flex justify-between mr-2 gap-4'>
                <div className='self-center'>
                  {
                    selectedConversation.avatar ? (
                      <img src={selectedConversation.avatar}
                        alt={selectedConversation.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                        className='h-10 w-10 rounded-full' />
                    ) : (
                      <div
                        className='h-10 w-10 bg-black rounded-full text-sm text-white font-bold grid items-center justify-center'>
                        {selectedConversation.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                      </div>
                    )
                  }
                </div>
                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                  {selectedConversation?.fullName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-auto bg-white h-[80vh]" style={{ scrollBehavior: 'smooth' }}>
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="loading loading-spinner"></div>
              </div>
            )}

            {!loading && messages?.length == 0 && (
              <p className='text-center text-white items-center'>Send a message to
                start Conversation</p>
            )}

            {!loading && messages.length > 0 && messages?.map((message) => (
              // console.log('Messages length:', messages.length),
              <div className='my-2 px-4' key={message?._id} ref={lastMessageRef}>
                <div className={`chat text-lg flex ${message?.senderId === authUser?._id ? 'chat-end flex-row-reverse' : 'chat-start'}`}>
                  <div className='chat-image avatar'></div>
                  <div className={`rounded-2xl px-4 pt-1  text-white ${message?.senderId === authUser?._id ? 'bg-PrimaryColor1' : 'bg-gray-800'}`}>
                    {message?.message}
                    {/* </div> */}
                    <div className={`text-[10px] opacity-80 flex gap-1`}>
                      <div className="text-end">
                        {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div>
                        {new Date(message?.createdAt).toLocaleTimeString('en-IN', {
                          hour: 'numeric', minute:
                            'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handelSubmit} className='text-black border-t-black border-t-2'>
            <div className='w-full flex items-center bg-white justify-center'>
              <input value={sendData} onChange={handelMessages} required id='message' type='text'
                className='w-full bg-transparent outline-none px-4 rounded-full' />
              <button type='submit'>
                {
                  // sending ? <div className='loading loading-spinner'></div> :
                  <IoSend size={25} className='text-PrimaryColor1 cursor-pointer w-fit h-10 p-1' />
                }
              </button>
            </div>
          </form>

        </>
      )}
    </div>
  );
};

export default MessageContainer;

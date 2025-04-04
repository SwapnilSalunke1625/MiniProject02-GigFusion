import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import MessageContainer from '../components/MessageContainer.jsx';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSideVisible, setIsSideVisible] = useState(true);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setIsSideVisible(false);
    };

    const handleSideVisibility = () => {
        setIsSideVisible(true);
        setSelectedUser(null);
    };

    return (
        <div className='mx-auto flex justify-between min-w-full md:min-w-[100vw] md:max-w-[100vw] px-2 h-[90.35vh] border-black border-2'>
            <div className={`w-full md:flex ${isSideVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handleSelectUser} />
            </div>
            <div className={`divider divider-horizontal bg-black px-[0.75px] ${isSideVisible ? 'hidden md:flex' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
            <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200`}>
                <MessageContainer onBackUser={handleSideVisibility} />
            </div>
        </div>
    );
};

export default ChatPage;
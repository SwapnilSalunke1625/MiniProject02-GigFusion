import { create } from "zustand";

const userConversation = create((set) => ({
    messages: [],
    selectedConversation: null,
    setMessage: (newMessages) => set({ messages: newMessages }),
    setSelectedConversation: (user) => set({ selectedConversation: user }),
}));

export default userConversation;
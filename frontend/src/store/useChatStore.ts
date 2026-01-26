import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

type User = {
  _id: string;
  fullName: string;
  profilePic: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  text?: string;
  image?: string;
};

type Chat = {
  _id: string;
  fullName: string;
  profilePic: string;
  participants: User[];
  lastMessage?: Message;
};

type ChatStore = {
  allContacts: User[];
  chats: Chat[];
  messages: Message[];
  activeTab: "chats" | "contacts";
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: User | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>
};

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab: "chats" | "contacts") => set({ activeTab: tab }),
  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "fetching contacts failed",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "fetching partners failed",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "fetching messages failed",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));

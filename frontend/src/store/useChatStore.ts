import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import axios from "axios"

type User = {
  _id: string
  fullName: string
}

type Message = {
  id: string
  senderId: string
  receiverId: string
  text: string
}

type Chat = {
  id: string
  participants: User[]
  lastMessage?: Message
}


type ChatStore = {
  allContacts: User[]
  chats: Chat[]
  messages: Message[]
  activeTab: "chats" | "contacts"
  selectedUser: User | null
  isUsersLoading: boolean
  isMessagesLoading: boolean
  isSoundEnabled: boolean
  toggleSound: () => void
}

export const useChatStore = create<ChatStore>((set,get) => ({
  allContacts: [],
  chats: [],
  messages:[],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    const newValue = !get().isSoundEnabled
    localStorage.setItem("isSoundEnabled", String(newValue))
    set({isSoundEnabled: newValue})
  },

  setActiveTab: (tab: "chats" | "contacts") => set({ activeTab: tab }),
  setSelectedUser: (selectedUser: User | null) => set({selectedUser}),

  getAllContacts: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/contacts")
      set({allContacts: res.data})
    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast.error(error?.response?.data?.message || "fetching contacts failed");
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/chats")
      set({chats: res.data})
    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast.error(error?.response?.data?.message || "fetching partners failed");
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      set({ isUsersLoading: false })
    }
  },
}))

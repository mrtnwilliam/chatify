import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.ts';
import toast from 'react-hot-toast';
import axios from "axios";
import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:3000" : "/";

interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  profilePic: string;
}

interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  socket: Socket | null;
  onlineUsers: string[];

  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;

  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set,get) => ({
  authUser: null,
  isCheckingAuth:true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({authUser: res.data})
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null }); 
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({isSigningUp: true})
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!")

      get().connectSocket()
    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast.error(error?.response?.data?.message || "Signup failed");
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      set({isSigningUp: false})
    }
  },

  login: async (data) => {
    set({isLoggingIn: true})
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully")

      get().connectSocket()
    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast.error(error?.response?.data?.message || "Login failed");
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      set({isLoggingIn: false})
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out successfully")
      get().disconnectSocket();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Logout failed");
      } else {
        toast.error("Something went wrong")
      }
    }
  },

  updateProfile: async (data) => {
    set({isUpdatingProfile: true})
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({authUser: res.data})
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("error in update profile:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Logout failed");
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      set({isUpdatingProfile: false})
    }
  },

  connectSocket: () => {
    const {authUser} = get()
    if (!authUser || get().socket?.connected) return

    const socket = io(BASE_URL, {
      withCredentials: true // this ensures cookies are sent with the connection
    })

    socket.connect()

    set({socket})

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers:userIds})
    })
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect()
  }
}))
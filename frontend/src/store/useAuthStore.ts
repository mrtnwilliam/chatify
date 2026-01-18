import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.ts';
import toast from 'react-hot-toast';
import axios from "axios";

interface AuthUser {
  _id: string;
  email: string;
  username: string;
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

interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth:true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({authUser: res.data})
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
    } catch (error) {
      if (axios.isAxiosError(error)) {

        toast.error(error?.response?.data?.message || "Logout failed");
      } else {
        toast.error("Something went wrong")
      }
    }
  }
}))
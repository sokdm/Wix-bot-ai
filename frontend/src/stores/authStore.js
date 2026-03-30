import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,

      register: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post(`${API_URL}/auth/register`, { email, password })
          set({ 
            token: res.data.data.token,
            isAuthenticated: true,
            loading: false 
          })
          get().fetchUser()
          return true
        } catch (err) {
          set({ 
            error: err.response?.data?.message || 'Registration failed',
            loading: false 
          })
          return false
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post(`${API_URL}/auth/login`, { email, password })
          set({ 
            token: res.data.data.token,
            isAuthenticated: true,
            loading: false 
          })
          get().fetchUser()
          return true
        } catch (err) {
          set({ 
            error: err.response?.data?.message || 'Login failed',
            loading: false 
          })
          return false
        }
      },

      adminLogin: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post(`${API_URL}/auth/admin/login`, { email, password })
          set({ 
            token: res.data.data.token,
            isAdmin: true,
            loading: false 
          })
          return true
        } catch (err) {
          set({ 
            error: err.response?.data?.message || 'Admin login failed',
            loading: false 
          })
          return false
        }
      },

      fetchUser: async () => {
        const token = get().token
        if (!token) return

        try {
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          set({ user: res.data.data })
        } catch (err) {
          get().logout()
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isAdmin: false,
          error: null 
        })
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'wix-auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, isAdmin: state.isAdmin })
    }
  )
)

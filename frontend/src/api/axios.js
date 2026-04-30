import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor: attach Bearer token ──────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle errors globally ─────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      toast.error('Server unreachable. Please try again.')
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const message = data?.message || 'Something went wrong.'

    if (status === 401) {
      // Auto-logout on unauthorized
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login (avoid import cycle with router)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Attach the message to the error for callers to use
    error.message = message
    return Promise.reject(error)
  }
)

export default axiosInstance

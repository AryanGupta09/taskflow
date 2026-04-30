import { createContext, useReducer, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on mount if token exists
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' })
      return
    }
    try {
      const { data } = await axiosInstance.get('/auth/me')
      dispatch({ type: 'LOAD_USER_SUCCESS', payload: data.user })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({ type: 'AUTH_ERROR' })
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    toast.success(`Welcome back, ${data.user.name}!`)
    return data
  }

  const register = async (name, email, password, role) => {
    const { data } = await axiosInstance.post('/auth/register', {
      name,
      email,
      password,
      role,
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    toast.success(`Account created! Welcome, ${data.user.name}!`)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully.')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

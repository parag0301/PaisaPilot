import axios from 'axios'

// Base URL from .env
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => Promise.reject(error)
)

// Handle expired or invalid token
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const token = localStorage.getItem('token')
    const requestUrl = error.config?.url || ''

    const isLoginRequest = requestUrl.includes('/api/users/login')
    const isRegisterRequest = requestUrl.includes('/api/users/register')

    if (
      error.response?.status === 401 &&
      token &&
      !isLoginRequest &&
      !isRegisterRequest
    ) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
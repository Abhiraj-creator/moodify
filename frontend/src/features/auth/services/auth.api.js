import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    withCredentials: true
})


export const Register = async ({ username, email, password }) => {
    const response = await api.post('/api/auth/register', {
        username,
        email,
        password
    })
    return response.data
}


export const Login = async ({ username, email, password }) => {
    const response = await api.post('/api/auth/login', {
        username,
        email,
        password
    })
    return response.data
}


export const GetMe = async () => {
    const response = await api.get('/api/auth/get-me')
    return response.data
}

export const logOut = async () => {
    const response = await api.get('/api/auth/logout')
    return response.data
}
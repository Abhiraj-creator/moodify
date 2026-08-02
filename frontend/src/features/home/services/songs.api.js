import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    withCredentials: true
})

export async function GetSong(mood) {
    const response = await api.get(`/api/song?mood=${mood}`)
    return response.data
}

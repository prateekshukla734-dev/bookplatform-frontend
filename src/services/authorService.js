import axios from 'axios'

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
})

export const getAuthor = async (slug) => {
    const response = await API.get(`/authors/${slug}`)
    return response.data.author
}
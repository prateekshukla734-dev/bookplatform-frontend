
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const API = axios.create({
    baseURL: `${API_URL}/api`
})

// Fetch all books
export const getBooks = async () => {
    const response = await API.get('/books')
    return response.data.books
}

// Fetch one book using its slug
export const getBookBySlug = async (slug) => {
    const response = await API.get(`/books/slug/${slug}`)
    return response.data.book
}

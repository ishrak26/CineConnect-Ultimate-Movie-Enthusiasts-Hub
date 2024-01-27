import axios from 'axios'

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.API_KEY,
  },
  validateStatus: () => true,
})

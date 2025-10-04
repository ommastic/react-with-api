export const API_KEY = import.meta.env.VITE_OMDB_KEY || ''
export const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || ''

if (!API_KEY || !TMDB_KEY){
	console.warn("Missing OMDB_KEY or TMDB_KEY in .env.local")
}

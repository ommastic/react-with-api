export const API_KEY = process.env.REACT_APP_OMDB_KEY
export const TMDB_KEY = process.env.REACT_APP_TMDB_KEY

if (!API_KEY || !TMDB_KEY){
	console.warn("Missing OMDB_KEY or TMDB_KEY")
}

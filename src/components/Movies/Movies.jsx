import "./Movies.css";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import noImage from "../../assets/noImage.jpg";
import { API_KEY, TMDB_KEY } from "../../config/keys";

// --- TMDB poster helper (tiny cache) ---
const posterCache = new Map(); // imdbID -> string|null

async function getTMDBPoster(imdbID) {
  if (!imdbID) return null;
  if (!TMDB_KEY) return null;
  if (posterCache.has(imdbID)) return posterCache.get(imdbID);

  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/find/${encodeURIComponent(imdbID)}`,
      { params: { api_key: TMDB_KEY, external_source: "imdb_id" } }
    );

    const moviePoster =
      (data?.movie_results && data.movie_results[0]) ||
      (data?.tv_results && data.tv_results[0]);

    // Build full CDN URL for the poster path
    const url = moviePoster?.poster_path
      ? `https://image.tmdb.org/t/p/w342${moviePoster.poster_path}`
      : null;

    posterCache.set(imdbID, url);
    return url;
  } catch {
    posterCache.set(imdbID, null);
    return null;
  }
}

const Movies = () => {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchFor = (params.get("searchFor") || "").trim();

  function filterByImdID(list) {
    const info = new Set();
    return list.filter((item) => {
      if (!item.imdbID || info.has(item.imdbID)) {
        return false;
      } else {
        info.add(item.imdbID);
        return true;
      }
    });
  }

  async function getMovies() {
    if (!searchFor) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get("https://omdbapi.com/", {
        params: { apikey: API_KEY, s: searchFor },
      });

      const resp = data?.Search || [];
      const unique = filterByImdID(resp).slice(0, 6);

      // Enrich each result with a stable poster
      const withPosters = await Promise.all(
        unique.map(async (m) => {
          const tmdbPoster = await getTMDBPoster(m.imdbID);
          const omdbPoster = m.Poster && m.Poster !== "N/A" ? m.Poster : null;
          return {
            ...m,
            poster: tmdbPoster || omdbPoster || noImage,
          };
        })
      );

      setResults(withPosters);
    } catch (e) {
      console.warn("getMovies failed:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFor]);

  const year = (value) => {
    const match = String(value || "").match(/\d{4}/);
    return match ? Number(match[0]) : null;
  };

  const displayed = useMemo(() => {
    const resp = [...results];
    switch (sortBy) {
      case "title-asc":
        return resp.sort((a, b) => a.Title.localeCompare(b.Title));
      case "title-desc":
        return resp.sort((a, b) => b.Title.localeCompare(a.Title));
      case "year-asc":
        return resp.sort((a, b) => (year(a.Year) ?? 0) - (year(b.Year) ?? 0));
      case "year-desc":
        return resp.sort((a, b) => (year(b.Year) ?? 0) - (year(a.Year) ?? 0));
      default:
        return resp;
    }
  }, [results, sortBy]);

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="results">
            <div className="search-summary">
              <span className="search__title">Search Results for : </span>
              <span id="search__info">
                {searchFor || "-"}{displayed.length ? ` (${displayed.length})` : ""}
              </span>
            </div>

            {loading ? (
              <div className="movies__loading">
                <FontAwesomeIcon icon="spinner" className="fa-spinner"/>
              </div>
            ) : (
              <>
                <select
                  className="sort--movie"
                  id="sort--movie"
                  defaultValue="DEFAULT"
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="DEFAULT" disabled hidden>
                    Sort Movie By
                  </option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="year-desc">Latest Movies</option>
                  <option value="year-asc">Oldest Movies</option>
                </select>

                <div className="movies__list">
                  {displayed.map((movie) => (
                    <div className="movie__poster" key={movie.imdbID}>
                      <img
                        className="movie__poster--img"
                        src={movie.poster || noImage}
                        alt={movie.Title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = noImage;
                        }}
                        onClick={() => navigate(`/movies/${movie.imdbID}`)}
                      />
                      <div className="movie--about">
                        <span className="movie--data movie__title">{movie.Title}</span>
                        <div className="movie__year">{year(movie.Year) ?? ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Movies;

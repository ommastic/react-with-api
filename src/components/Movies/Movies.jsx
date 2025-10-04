import './Movies.css'
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import noImage from '../../assets/noImage.jpg'
import {API_KEY} from "../../config/keys"

const Movies = () => {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams()
  const searchFor = (params.get("searchFor") || "").trim()

  function filterByImdID(list) {
    const info = new Set()
    return list.filter(item => {
      if (!item.imdbID || info.has(item.imdbID)) {
        return false
      }
      else {
        info.add(item.imdbID)
        return true
      }
    })
  }

  async function getMovies() {
    setLoading(true)
    const { data } = await axios.get(
      `https://omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(searchFor)}`
    );
    const resp = data.Search || []
    const unique = filterByImdID(resp)
    setResults(unique.slice(0, 6))
    setLoading(false)
  }

  useEffect(() => {
    if (!searchFor) {
      setResults([]);
      return
    }
    getMovies();
  }, [searchFor])

  const year = (value) => {
    const match = String(value || '').match(/\d{4}/)
    return match ? Number(match[0]) : "null"
    }

  const displayed = useMemo(() => {
    const resp = [...results]


    switch (sortBy) {
      case "title-asc":
        return resp.sort((a, b) => a.Title.localeCompare(b.Title));
      case "title-desc":
        return resp.sort((a, b) => b.Title.localeCompare(a.Title));
      case "year-asc":
        return resp.sort((a, b) => year(a.Year) - year(b.Year))
      case "year-desc":
        return resp.sort((a, b) => year(b.Year) - year(a.Year))
    }
    return resp
  }, [results, sortBy])


  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="results">
            <div className="search-summary">
              <span className="search__title">Search Results for : </span>
              <span id="search__info">{searchFor || "-"}{displayed.length ? `${displayed.length}` : ""}</span>
            </div>
            {
              loading ? (
                <div className="movies__loading">
                  <FontAwesomeIcon icon="spinner" />
                </div>
              ) : (
                <>
                  {/* <label htmlFor="sort--movie"></label> */}
                  <select
                    className="sort--movie"
                    id="sort--movie"
                    defaultValue="DEFAULT"
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="DEFAULT" disabled hidden >
                      Sort Movie By
                    </option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="year-desc">Latest Movies</option>
                    <option value="year-asc">Oldest Movies</option>
                  </select>

                  <div className="movies__list">
                    <div className="movies__list">
                      {
                        displayed.map(movie => (
                          <div className="movie__poster" key={movie.imdbID}>
                            <img className="movie__poster--img" src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : noImage}
                              alt="" loading="lazy" onClick={() => navigate(`/movies/${movie.imdbID}`)} />
                            <div className="movie--about">
                              <span className="movie--data movie__title">{movie.Title}</span>
                              <div className="movie__year">{year(movie.Year) ?? null}</div>
                            </div>
                          </div>
                        ))}
                    </div>
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

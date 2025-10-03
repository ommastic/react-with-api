import React from "react";
import "./Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Search = () => {
  const [text, setText] = useState("")
  const navigate = useNavigate()


  const movieSearch = () => {
    const searchFor = text.trim()
    navigate(searchFor ? `/movies?searchFor=${encodeURIComponent(searchFor)}` : "/movies")
  }

  return (
    <div className="search">
      <div className="header__wrapper">
        <h4 className="header__subtitle">Browse our Movies</h4>
        <div className="search__wrapper">
          <input
            className="header--search"
            type="text"
            placeholder="Search by Name, year or Keyword"
          value={text} onChange={(event) => setText(event.target.value)}
          onKeyDown={event => event.key === "Enter" && movieSearch()}
          />

          <button className="search__btn"  onClick={movieSearch}>
            <FontAwesomeIcon icon="magnifying-glass"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;

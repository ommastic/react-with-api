// import React from "react";
import axios from "axios";
import "./MovieDetail.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import noImage from "../../assets/noImage.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {TMDB_KEY} from "../../config/keys"

const MovieDetail = () => {
  const { imdbID } = useParams();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //if there is no image id!!
    if (!imdbID) {
      setError("Missing IM"); //if there is no image id
      setError("Missing IMDb id"); //if there is no image id
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // TMDb: map TMDb id with imdb Id
        //using the imdbID to get equivalent movies or tv info about the movie
        const { data: find } = await axios.get(
          `https://api.themoviedb.org/3/find/${imdbID}`,
          { params: { api_key: TMDB_KEY, external_source: "imdb_id" } }
        );
        const movieHit = find.movie_results?.[0];
        const tvHit = find.tv_results?.[0];
        const hit = movieHit || tvHit;

        if (!hit) {
          throw new Error("Title not found on TMDB");
        }

        //define type needed to get the trailer of the poster
        const type = movieHit ? "movie" : "tv";

        //getting details for video and other info (summary, year and title)
        const { data: dataInfo } = await axios.get(
          `https://api.themoviedb.org/3/${type}/${hit.id}`,
          { params: { api_key: TMDB_KEY, append_to_response: "videos" } }
        );

        //With more than one trailer, picking in order
        const vids = dataInfo.videos?.results || [];
        const pick =
          vids.find(
            (video) =>
              (video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official) ||
              /official/i.test(video.name)
          ) ||
          vids.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
          ) ||
          vids.find((video) => video.site === "YouTube");

        if (cancelled) return;

        setDetails(dataInfo);
        setTrailerKey(pick?.key || "");
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setTimeout(() => (setLoading(false), 1000));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  if (loading) return <div className="spinner movie-detail">
        <FontAwesomeIcon icon="spinner"/>
        </div>;
  if (error) return <div className="movie-detail">Error: {error}</div>;
  if (!details) return <div className="movie-detail">No data.</div>;

  const title = details.title || details.name || "untitled";
  const year = (details.release_date || details.first_air_date || "").slice(0, 4);
  const poster = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : noImage;
  const overview = details.overview || "";

  return (
    <div className="movie-detail">
      <div className="trailer">
        {trailerKey ? (
          <iframe
            className="video-frame"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title={`${title} trailer video player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="no__trailer">No trailer available on TMDb.</p>
        )}
      </div>
      <div className="overview__wrapper">
        <h2 className="movie__title movie__player">{title}</h2>
        <h2 className="movie__year">{year && `(${year})`}</h2>
        {overview && <p className="movie__overview">{overview}</p>}
      </div>
    </div>
  );
};

export default MovieDetail;

import React from "react";
import "./Home.css";
import Nav from "../../components/Nav/Nav";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="image__wrapper">
        <div className="home__intro">
          <h1>This is the site to search for your favourite Movies</h1>
          <h2>Click the button below to start your search</h2>
          <Link to="/search" className="btn btn__space">Click Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

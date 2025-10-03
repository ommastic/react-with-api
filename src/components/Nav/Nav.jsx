import React from "react";
import "./Nav.css";
import moviesWebsiteWhitelogo from "../../assets/moviesWebsiteWhite.png";
import { Link, useLocation } from "react-router-dom";
import {logout} from '../../firebase'

const Nav = () => {
  const { pathname } = useLocation()
  const onHome = pathname === "/";

  return (
    <nav>
      <div className="nav">
        <div className="nav__container">
          <img className="nav__logo--img" src={moviesWebsiteWhitelogo} alt="" />
          <h3 className="nav--name">MWeb</h3>
        </div>
        <ul className="nav__lists">
          <li>
            <Link to="/" className="nav__list" href="#">
              Home
            </Link>
          </li>
          <li>
            <Link to="" className="nav__list" href="#search__info">
              Movie Scope
            </Link>
          </li>
          <li>
            <button className="btn">Contact</button>
          </li>
          {onHome ? 
          <li>
            <button className="btn" onClick={() => {logout()}}>Signout</button>
          </li> : null}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

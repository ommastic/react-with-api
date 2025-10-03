import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row row__column">
          <div className="footer__socials">
          <Link to="/" className="footer__logo">
          <FontAwesomeIcon icon={["fab", "facebook-f"]} className='footer__logo--img'/>
          </Link>
          <Link to="/" className="footer__logo">
          <FontAwesomeIcon icon={["fab", "instagram"]} className='footer__logo--img' />
          </Link>
          <Link to="/" className="footer__logo">
          <FontAwesomeIcon icon={["fab", "twitter"]} className='footer__logo--img' />
          </Link>
          <Link to="/" className="footer__logo">
          <FontAwesomeIcon icon={["fab", "youtube"]} className='footer__logo--img'/>
          </Link>
          </div>
          <div className="footer__list">
            <Link to="/" className="footer__link">Home</Link>
            <span className="footer__link no-cursor">About</span>
            <Link to="/books" className="footer__link">Movies</Link>
            <Link to="/cart" className="footer__link">Contact</Link>
          </div>
          <div className="footer__copyright">
            Copyright &copy; 2025 MWeb
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
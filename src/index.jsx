import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { BrowserRouter } from 'react-router-dom';


library.add(faMagnifyingGlass,faSpinner,faFacebookF, faTwitter, faYoutube, faInstagram)

// React Router wants basename WITHOUT a trailing slash.
const BASENAME = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
    <App />
    </BrowserRouter>
  </React.StrictMode>
)



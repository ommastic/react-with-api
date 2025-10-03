import Nav from "./components/Nav/Nav";
import Home from "./pages/Home/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import Search from "./pages/Search/Search";
import Footer from "./components/Footer/Footer";
import Movies from "./components/Movies/Movies";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Login from "./pages/Login/Login";

function App() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const { pathname } = location;
      if (!user && pathname !== "/login") {
        navigate("/login", {replace: true})
      }
      if (user && pathname === "/login"){
        navigate("/", {replace: true});
      }
    });
    return unsub
  }, [navigate, location.pathname]);

  return (
    <div className="App">
      <Nav />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/search"
            element={<Search query={query} setQuery={setQuery} />}
          />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:imdbID" element={<MovieDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

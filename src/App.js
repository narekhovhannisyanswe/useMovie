import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";
import TextExpander from "./components/TextExpander";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NavbarResult({ moviesCount }) {
  return (
    <p className="num-results">
      Found <strong>{moviesCount}</strong> results
    </p>
  );
}

function Navbar({ moviesCount, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NavbarResult moviesCount={moviesCount} />
    </nav>
  );
}

function Movie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MoviesList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

const OMDB_KEY = "2b39c271";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingError, setFetchingError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        setFetchingError("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_KEY}&s=${query}`
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search);
      } catch (err) {
        console.error(`Movies are not fetched, reason: ${err.message}`);
        setFetchingError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setFetchingError("");
      return;
    }

    fetchMoves();
  }, [query]);

  return (
    <>
      <Navbar moviesCount={movies.length} query={query} setQuery={setQuery} />
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !fetchingError && <MoviesList movies={movies} />}
          {fetchingError && <ErrorMessage message={fetchingError} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

import React, { useState } from "react";
import "./App.css";

/* === THEME COLORS (see README and instructions) === */
const COLORS = {
  primary: "#2d3142",
  secondary: "#bfc0c0",
  accent: "#ef8354",
  bgLight: "#ffffff",
  cardShadow: "rgba(0,0,0,0.03)",
};

/* =============== MOCK DATA =============== */
const MOCK_MOVIE_RESULTS = [
  {
    id: "movie1",
    title: "Inception",
    year: 2010,
    image: "https://covers.openlibrary.org/b/id/9230476-L.jpg",
    books: [
      {
        id: "book1",
        title: "Ubik",
        author: "Philip K. Dick",
        image:
          "https://covers.openlibrary.org/b/id/6979861-L.jpg",
        explanation:
          "Both twist reality and play with perception, blending dreams and the real world. Ubik explores shifting realities much like Inception.",
      },
      {
        id: "book2",
        title: "Hard-Boiled Wonderland and the End of the World",
        author: "Haruki Murakami",
        image:
          "https://covers.openlibrary.org/b/id/10494116-L.jpg",
        explanation:
          "Surreal narratives, dream-logic, and layered mysteries connect this novel to Inception's cerebral storytelling.",
      },
    ],
  },
  {
    id: "movie2",
    title: "Pride & Prejudice",
    year: 2005,
    image: "https://covers.openlibrary.org/b/id/8224141-L.jpg",
    books: [
      {
        id: "book3",
        title: "Longbourn",
        author: "Jo Baker",
        image:
          "https://covers.openlibrary.org/b/id/10434710-L.jpg",
        explanation:
          "A retelling of Pride & Prejudice from below stairs; perfectly complements the original story with new perspectives.",
      },
    ],
  },
];

const MOCK_BOOK_RESULTS = [
  {
    id: "book4",
    title: "The Martian",
    author: "Andy Weir",
    image: "https://covers.openlibrary.org/b/id/7894896-L.jpg",
    matches: [
      {
        id: "movie3",
        title: "Gravity",
        year: 2013,
        image:
          "https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg",
        explanation:
          "Both feature survival stories in space, blending suspense, isolation, and innovation.",
      },
      {
        id: "movie4",
        title: "Apollo 13",
        year: 1995,
        image:
          "https://upload.wikimedia.org/wikipedia/en/9/9f/Apollo_thirteen_movie.jpg",
        explanation:
          "Similar survival and ingenuity themes, with a focus on human determination against the odds.",
      },
    ],
  },
];

/* ======== HELPERS FOR MOCKED "API" ======== */
// PUBLIC_INTERFACE
/**
 * Simulate backend search for movies/shows by name
 * @param {string} query
 * @returns {Promise<Array>} Simulated search result
 */
function searchMovies(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_MOVIE_RESULTS.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300);
  });
}

// PUBLIC_INTERFACE
/**
 * Simulate backend reverse search: books to movies/shows
 * @param {string} bookName
 * @returns {Promise<Array>} Simulated reverse result
 */
function searchBooks(bookName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_BOOK_RESULTS.filter((book) =>
          book.title.toLowerCase().includes(bookName.toLowerCase())
        )
      );
    }, 300);
  });
}

/* ====== COMPONENTS ====== */

// PUBLIC_INTERFACE
function App() {
  // UI state management
  const [tab, setTab] = useState("search"); // 'search' | 'reverse'
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [reverseSearch, setReverseSearch] = useState("");
  const [reverseResults, setReverseResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Favorites are pairs: {movie, book} or {book, movie}
  const [favorites, setFavorites] = useState([]);
  // For explanation modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  /* === EVENT HANDLERS === */
  // Movie/Show search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchMovies(search);
    setResults(data);
    setLoading(false);
  };

  // Book reverse search
  const handleReverseSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchBooks(reverseSearch);
    setReverseResults(data);
    setLoading(false);
  };

  const handleAddFavorite = (item) => {
    setFavorites((old) =>
      old.some((fav) => fav.key === item.key)
        ? old
        : [...old, item]
    );
  };

  const handleRemoveFavorite = (key) => {
    setFavorites((old) => old.filter((fav) => fav.key !== key));
  };

  // Show explanation modal
  const showModal = (explanation, from, to) => {
    setModalContent({ explanation, from, to });
    setModalOpen(true);
  };

  // Share favorites via "URL"
  const handleShareFavorites = () => {
    const fakeUrl =
      "https://bookcinema.app/share/" +
      encodeURIComponent(
        JSON.stringify(
          favorites.map((fav) => ({
            from: fav.fromTitle,
            to: fav.toTitle,
          }))
        )
      );
    window.prompt(
      "Copy and share this favorites list URL:",
      fakeUrl
    );
  };

  /* === RENDERING === */
  return (
    <div
      style={{
        fontFamily:
          "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif",
        background: COLORS.bgLight,
        color: COLORS.primary,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          borderBottom: `1px solid ${COLORS.secondary}`,
          padding: "12px 24px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 6px 0 #ececec",
        }}
      >
        <div
          style={{
            fontWeight: 900,
            letterSpacing: 2,
            fontSize: 24,
            color: COLORS.accent,
            display: "flex",
            alignItems: "center",
          }}
        >
          📚 BookCinema
        </div>
        <nav
          style={{
            display: "flex",
            gap: "22px",
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          <button
            onClick={() => setTab("search")}
            style={{
              border: "none",
              background: "none",
              color: tab === "search" ? COLORS.accent : COLORS.primary,
              cursor: "pointer",
              fontWeight: tab === "search" ? 600 : 400,
              borderBottom:
                tab === "search" ? `2.5px solid ${COLORS.accent}` : "none",
              transition: "all 0.1s",
              padding: "0 0 2px 0",
              fontSize: "inherit",
            }}
          >
            Movie/Show → Book
          </button>
          <button
            onClick={() => setTab("reverse")}
            style={{
              border: "none",
              background: "none",
              color: tab === "reverse" ? COLORS.accent : COLORS.primary,
              cursor: "pointer",
              fontWeight: tab === "reverse" ? 600 : 400,
              borderBottom:
                tab === "reverse"
                  ? `2.5px solid ${COLORS.accent}`
                  : "none",
              transition: "all 0.1s",
              padding: "0 0 2px 0",
              fontSize: "inherit",
            }}
          >
            Book → Movie/Show
          </button>
        </nav>
        <button
          style={{
            background: COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 18px",
            marginLeft: 12,
            cursor: "pointer",
            boxShadow: "0 2px 8px 0 #f7f7f7",
            transition: "opacity 0.20s",
            opacity: favorites.length ? 1 : 0.65,
          }}
          disabled={!favorites.length}
          onClick={handleShareFavorites}
        >
          Share Favorites
        </button>
      </header>
      <div
        style={{
          display: "flex",
          flex: 1,
          background: COLORS.bgLight,
          minHeight: "0",
        }}
      >
        {/* Main view area */}
        <main
          style={{
            flex: "1 1 0",
            padding: "32px 16px 16px 32px",
            minWidth: 0,
            maxWidth: "822px",
          }}
        >
          {tab === "search" ? (
            <SearchByMovie
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              results={results}
              loading={loading}
              handleAddFavorite={handleAddFavorite}
              showModal={showModal}
              favorites={favorites}
            />
          ) : (
            <ReverseSearch
              reverseSearch={reverseSearch}
              setReverseSearch={setReverseSearch}
              handleReverseSearch={handleReverseSearch}
              reverseResults={reverseResults}
              loading={loading}
              handleAddFavorite={handleAddFavorite}
              showModal={showModal}
              favorites={favorites}
            />
          )}
        </main>
        {/* Sidebar */}
        <FavoritesSidebar
          favorites={favorites}
          handleRemoveFavorite={handleRemoveFavorite}
          COLORS={COLORS}
        />
      </div>
      <footer
        style={{
          textAlign: "center",
          fontSize: 13,
          padding: "16px",
          color: COLORS.secondary,
          background: "#faf9f8",
          borderTop: `1px solid ${COLORS.secondary}11`,
          letterSpacing: 0.4,
        }}
      >
        BookCinema — Find your next literary adventure.<span style={{ color: COLORS.accent }}> ✦</span>
      </footer>

      {/* Explanation Modal */}
      {modalOpen && (
        <ExplanationModal
          content={modalContent}
          onClose={() => setModalOpen(false)}
          accent={COLORS.accent}
        />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function SearchByMovie({
  search,
  setSearch,
  handleSearch,
  results,
  loading,
  handleAddFavorite,
  showModal,
  favorites,
}) {
  return (
    <div>
      <form
        style={{ display: "flex", gap: 10, marginBottom: 24 }}
        onSubmit={handleSearch}
        autoComplete="off"
      >
        <input
          required
          autoFocus
          type="text"
          placeholder="Search for a movie or TV show…"
          style={{
            flex: 1,
            padding: "12px 18px",
            fontSize: 18,
            borderRadius: 8,
            border: "1.5px solid #e6e6e6",
            background: "#fafbfc",
            outline: "none",
            transition: "border 0.15s",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          style={{
            borderRadius: 8,
            background: "#ef8354",
            border: "none",
            color: "#fff",
            fontWeight: 600,
            fontSize: 17,
            padding: "0 24px",
            height: 44,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.33 : 1,
            transition: "opacity 0.2s",
            boxShadow: "0 2px 8px 0 #f7efef",
          }}
          disabled={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>
      <div style={{ minHeight: "32px" }}>
        {results.length === 0 && !loading && (
          <div style={{ color: "#bbb", marginTop: 12 }}>No results yet. Try searching a popular movie!</div>
        )}
      </div>
      <div
        style={{
          marginTop: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {results.map((movie) => (
          <div key={movie.id}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{
                    width: 38,
                    height: 56,
                    borderRadius: 5,
                    objectFit: "cover",
                    boxShadow: "0 2px 8px 1px #eee",
                  }}
                />
              )}
              <span>
                {movie.title} <span style={{ fontWeight: 400, color: "#888", fontSize: 16 }}>
                  {movie.year}
                </span>
              </span>
            </div>
            <div style={{ margin: "10px 0 0 44px" }}>
              <div
                style={{
                  color: "#7a7b7b",
                  fontWeight: 500,
                  fontSize: 15,
                  marginBottom: 6,
                  letterSpacing: 0.2,
                }}
              >
                Book Recommendations:
              </div>
              {movie.books.map((book) => (
                <ResultCard
                  key={book.id}
                  main={{
                    title: book.title,
                    subtitle: book.author,
                    image: book.image,
                    type: "Book",
                  }}
                  matched={{
                    title: movie.title,
                    type: "Movie/Show",
                  }}
                  explanation={book.explanation}
                  onExplanation={() =>
                    showModal(
                      book.explanation,
                      { title: movie.title, type: "Movie/Show" },
                      { title: book.title, type: "Book" }
                    )
                  }
                  onFavorite={() =>
                    handleAddFavorite({
                      key: "msb:" + movie.id + "::" + book.id,
                      from: "movie",
                      to: "book",
                      fromTitle: movie.title,
                      toTitle: book.title,
                      meta: {
                        movie,
                        book,
                      },
                    })
                  }
                  isFavorited={favorites.some(
                    (fav) =>
                      fav.key === "msb:" + movie.id + "::" + book.id
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ReverseSearch({
  reverseSearch,
  setReverseSearch,
  handleReverseSearch,
  reverseResults,
  loading,
  handleAddFavorite,
  showModal,
  favorites,
}) {
  return (
    <div>
      <form
        style={{ display: "flex", gap: 10, marginBottom: 24 }}
        onSubmit={handleReverseSearch}
        autoComplete="off"
      >
        <input
          required
          type="text"
          placeholder="Search for a book (try “The Martian”)"
          style={{
            flex: 1,
            padding: "12px 18px",
            fontSize: 18,
            borderRadius: 8,
            border: "1.5px solid #e6e6e6",
            background: "#fafbfc",
            outline: "none",
            transition: "border 0.15s",
          }}
          value={reverseSearch}
          onChange={(e) => setReverseSearch(e.target.value)}
        />
        <button
          type="submit"
          style={{
            borderRadius: 8,
            background: "#ef8354",
            border: "none",
            color: "#fff",
            fontWeight: 600,
            fontSize: 17,
            padding: "0 24px",
            height: 44,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.33 : 1,
            transition: "opacity 0.2s",
            boxShadow: "0 2px 8px 0 #f7efef",
          }}
          disabled={loading}
        >
          {loading ? "Searching…" : "Reverse Search"}
        </button>
      </form>
      <div style={{ minHeight: "32px" }}>
        {reverseResults.length === 0 && !loading && (
          <div style={{ color: "#bbb", marginTop: 12 }}>
            No book results yet. Try searching for "The Martian".
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {reverseResults.map((book) => (
          <div key={book.id}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  style={{
                    width: 40,
                    height: 54,
                    borderRadius: 5,
                    objectFit: "cover",
                    boxShadow: "0 2px 9px 0px #eee",
                  }}
                />
              )}
              <span>{book.title}</span>
              <span style={{ fontWeight: 400, color: "#888", fontSize: 16 }}>
                {book.author}
              </span>
            </div>
            <div style={{ margin: "10px 0 0 44px" }}>
              <div
                style={{
                  color: "#7a7b7b",
                  fontWeight: 500,
                  fontSize: 15,
                  marginBottom: 6,
                  letterSpacing: 0.2,
                }}
              >
                Similar Movies/Shows:
              </div>
              {book.matches.map((movie) => (
                <ResultCard
                  key={movie.id}
                  main={{
                    title: movie.title,
                    subtitle: movie.year,
                    image: movie.image,
                    type: "Movie/Show",
                  }}
                  matched={{
                    title: book.title,
                    type: "Book",
                  }}
                  explanation={movie.explanation}
                  onExplanation={() =>
                    showModal(
                      movie.explanation,
                      { title: book.title, type: "Book" },
                      { title: movie.title, type: "Movie/Show" }
                    )
                  }
                  onFavorite={() =>
                    handleAddFavorite({
                      key: "bsm:" + book.id + "::" + movie.id,
                      from: "book",
                      to: "movie",
                      fromTitle: book.title,
                      toTitle: movie.title,
                      meta: { book, movie },
                    })
                  }
                  isFavorited={favorites.some(
                    (fav) => fav.key === "bsm:" + book.id + "::" + movie.id
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ResultCard({
  main,
  matched,
  explanation,
  onExplanation,
  onFavorite,
  isFavorited,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 1px 8px 0 rgba(45,49,66,.05)",
        padding: "14px 20px 12px 4px",
        margin: "8px 0 8px 0",
        gap: 10,
        position: "relative",
        maxWidth: 540,
      }}
    >
      <img
        src={main.image}
        alt={main.title}
        style={{
          borderRadius: 6,
          width: 48,
          height: 66,
          objectFit: "cover",
          boxShadow: "0 2px 7px 0 #eee",
        }}
      />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 17,
            lineHeight: 1.25,
            marginBottom: 2,
            color: "#2d3142",
          }}
        >
          {main.title}
          {main.subtitle && (
            <span
              style={{
                color: "#888",
                fontWeight: 400,
                marginLeft: 7,
                fontSize: 15,
              }}
            >
              {main.subtitle}
            </span>
          )}
        </div>
        <div style={{ fontSize: 14, color: "#bfc0c0", fontWeight: 400 }}>
          <span>{main.type} matched with {matched.type}:</span>{" "}
          <span style={{ color: "#4c4e52" }}>{matched.title}</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 14.5,
            color: "#7a7b7b",
          }}
        >
          <button
            onClick={onExplanation}
            style={{
              fontSize: 13,
              background: "none",
              border: "none",
              color: "#ef8354",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              margin: "0 0 0 -2px",
              fontWeight: 500,
              letterSpacing: 0.1,
              outline: "none",
            }}
          >
            Why this match?
          </button>
        </div>
      </div>
      <button
        onClick={onFavorite}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        style={{
          background: isFavorited ? "#ef8354" : "#fff",
          color: isFavorited ? "#fff" : "#ef8354",
          border: `2px solid #ef8354`,
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16,
          padding: "3.5px 10px",
          minWidth: 36,
          marginLeft: 8,
          cursor: "pointer",
          transition: "background 0.18s, color 0.18s",
        }}
      >
        {isFavorited ? "★" : "☆"}
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function FavoritesSidebar({ favorites, handleRemoveFavorite, COLORS }) {
  return (
    <aside
      style={{
        width: 265,
        background: "#f7f8fa",
        borderLeft: `1.5px solid ${COLORS.secondary}66`,
        padding: "32px 18px 16px 10px",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 12,
          letterSpacing: 0.5,
          color: COLORS.primary,
        }}
      >
        <span style={{ color: COLORS.accent }}>★</span> Favorites
      </div>
      <div
        style={{
          fontSize: 14.4,
          color: COLORS.secondary,
        }}
      >
        {favorites.length ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 17,
            }}
          >
            {favorites.map((fav) => (
              <li
                key={fav.key}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "9px 14px 7px 12px",
                  boxShadow: `0 1px 7px 0 ${COLORS.cardShadow}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  position: "relative",
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    border: "none",
                    background: "none",
                    color: "#bbb",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveFavorite(fav.key)}
                  aria-label="Remove from favorites"
                >
                  ×
                </button>
                <div
                  style={{
                    fontWeight: 500,
                    color: COLORS.primary,
                    fontSize: 15,
                  }}
                >
                  {fav.fromTitle} <span style={{ fontWeight: 300, color: "#bfc0c0" }}>&rarr;</span> {fav.toTitle}
                </div>
                <div style={{ fontWeight: 400, color: "#aaa", fontSize: 13 }}>
                  {fav.from} &rarr; {fav.to}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#bfc0c0" }}>No favorites yet.<br />Click <b>☆</b> to save a match.</div>
        )}
      </div>
      <style>
        {`
        @media (max-width: 900px) {
          aside { display: none !important; }
        }
      `}
      </style>
    </aside>
  );
}

// PUBLIC_INTERFACE
function ExplanationModal({ content, onClose, accent }) {
  if (!content) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(45,49,66, 0.20)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.15s",
      }}
      onClick={onClose}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          minWidth: 310,
          maxWidth: 364,
          boxShadow: "0 8px 36px 0 rgba(0,0,0,.16)",
          padding: "32px 22px 20px 22px",
          position: "relative",
          textAlign: "center",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 18,
            border: "none",
            background: "none",
            color: "#888",
            fontWeight: 700,
            fontSize: 22,
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18.5,
            color: accent,
            marginBottom: 6,
          }}
        >
          Why this match?
        </div>
        <div style={{ fontSize: 14.7, color: "#444", marginBottom: 13 }}>
          <span style={{ color: "#bfc0c0" }}>
            {content.from?.title} <span style={{ fontWeight: 800 }}>&rarr;</span>{" "}
            {content.to?.title}
          </span>
        </div>
        <div style={{ fontSize: 15.2, color: "#555", lineHeight: 1.6 }}>
          {content.explanation}
        </div>
      </div>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}

export default App;

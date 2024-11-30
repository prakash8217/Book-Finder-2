import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch books from Open Library API
  const fetchBooks = async (query) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    const apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      if (data.docs.length === 0) {
        setResults([]);
      } else {
        setResults(data.docs.slice(0, 12)); // Limit results to 12
      }
    } catch (err) {
      setError('Error fetching books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    fetchBooks(query);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="bg-gradient-to-br from-pink-200 via-yellow-200 to-teal-200 min-h-screen flex justify-center items-center">
      <div className="container bg-white bg-opacity-80 p-6 rounded-3xl shadow-xl max-w-2xl w-full text-center">
        <header className="mb-6">
          <h1 className="text-4xl text-pink-600 font-bold shadow-lg">📚 Book Finder</h1>
          <p className="text-xl text-gray-600 mt-4">Search for your favorite books and discover new ones!</p>
        </header>
        <div className="search-bar mb-6 flex justify-center gap-4">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter a book title..."
            className="p-4 text-xl border-2 border-pink-600 rounded-full shadow-md w-3/4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleSearchClick}
            className="px-8 py-4 text-xl bg-gradient-to-br from-pink-500 to-red-400 text-white rounded-full shadow-md transition-transform transform hover:translate-y-1"
          >
            🔍 Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="results mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.length === 0 && !loading && !error && (
            <p>No results found. Try a different title!</p>
          )}
          {results.map((book) => {
            const title = book.title || 'Unknown Title';
            const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
            const year = book.first_publish_year || 'Unknown Year';
            const coverId = book.cover_i;
            const coverUrl = coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
              : 'https://via.placeholder.com/150?text=No+Cover';
            const bookKey = book.key;
            const bookUrl = `https://openlibrary.org${bookKey}`;

            return (
              <a
                key={book.key}
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:translate-y-1 transition-all"
              >
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600"><strong>Author:</strong> {author}</p>
                <p className="text-gray-500"><strong>Year:</strong> {year}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

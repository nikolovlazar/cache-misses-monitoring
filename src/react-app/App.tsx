import { useState } from "react";
import {
  Search,
  Star,
  Calendar,
  Clock,
  Play,
  Users,
  Award,
  Film,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Updated movie data with better poster URLs and detailed info
const MOVIES = [
  {
    id: 1,
    title: "The Matrix",
    genre: "Action",
    rating: 8.7,
    year: 1999,
    runtime: 136,
    director: "Lana Wachowski, Lilly Wachowski",
    cast: [
      "Keanu Reeves",
      "Laurence Fishburne",
      "Carrie-Anne Moss",
      "Hugo Weaving",
    ],
    poster:
      "https://images.unsplash.com/photo-1691085465046-807f880ba9d7?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1640388397643-cd924ab7ef1b?q=80&w=3397&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. Neo discovers that reality as he knows it is actually a computer simulation called the Matrix.",
    budget: "$63 million",
    boxOffice: "$467.2 million",
    awards: ["4 Academy Awards", "7 Saturn Awards"],
    languages: ["English"],
    country: "USA",
    studio: "Warner Bros.",
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    year: 2010,
    runtime: 148,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page"],
    poster:
      "https://images.unsplash.com/photo-1594848421678-e2b90643f95b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1653392439276-984b2a2191f0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "A thief who enters people's dreams to steal secrets from their subconscious is given the task of planting an idea into the mind of a CEO. Dom Cobb is a skilled thief who specializes in extraction.",
    budget: "$160 million",
    boxOffice: "$836.8 million",
    awards: ["4 Academy Awards", "3 BAFTA Awards"],
    languages: ["English", "Japanese", "French"],
    country: "USA, UK",
    studio: "Warner Bros.",
  },
  {
    id: 3,
    title: "Pulp Fiction",
    genre: "Crime",
    rating: 8.9,
    year: 1994,
    runtime: 154,
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman", "Bruce Willis"],
    poster:
      "https://images.unsplash.com/photo-1641549058491-8a3442385da0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. A masterpiece of nonlinear storytelling.",
    budget: "$8.5 million",
    boxOffice: "$214.2 million",
    awards: ["1 Academy Award", "1 Golden Globe", "1 BAFTA Award"],
    languages: ["English"],
    country: "USA",
    studio: "Miramax",
  },
  {
    id: 4,
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    runtime: 152,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    poster:
      "https://images.unsplash.com/photo-1653395108060-e0236d7a9e58?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    budget: "$185 million",
    boxOffice: "$1.005 billion",
    awards: ["2 Academy Awards", "1 Golden Globe", "1 BAFTA Award"],
    languages: ["English"],
    country: "USA, UK",
    studio: "Warner Bros.",
  },
  {
    id: 5,
    title: "Forrest Gump",
    genre: "Drama",
    rating: 8.8,
    year: 1994,
    runtime: 142,
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    poster:
      "https://images.unsplash.com/photo-1553201826-fe8a9809c12d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1663868652528-04970e627cc2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    budget: "$55 million",
    boxOffice: "$678.2 million",
    awards: ["6 Academy Awards", "3 Golden Globe Awards"],
    languages: ["English"],
    country: "USA",
    studio: "Paramount Pictures",
  },
  {
    id: 6,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 8.6,
    year: 2014,
    runtime: 169,
    director: "Christopher Nolan",
    cast: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Bill Irwin",
    ],
    poster:
      "https://images.unsplash.com/photo-1615363227873-b9c73fdf3e65?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backdrop:
      "https://images.unsplash.com/photo-1732633553684-b18a43a48d3d?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. Earth's future has been riddled by disasters, famines, and droughts.",
    budget: "$165 million",
    boxOffice: "$677.5 million",
    awards: ["1 Academy Award", "1 BAFTA Award", "1 Critics Choice Award"],
    languages: ["English"],
    country: "USA, UK, Canada",
    studio: "Paramount Pictures",
  },
];

// Search states
type SearchState = {
  status: "idle" | "loading" | "success" | "error" | "not-found";
  query?: string;
};

// API response type
interface MovieSearchResponse {
  success: boolean;
  movie: (typeof MOVIES)[0];
}

// Movie search function - now uses API endpoint
const searchMovie = async (
  query: string,
): Promise<(typeof MOVIES)[0] | null> => {
  const response = await fetch(
    `/api/movie-details?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Movie not found
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as MovieSearchResponse;
  return data.movie;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<(typeof MOVIES)[0] | null>(
    null,
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
  });
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = searchQuery.trim();
      if (query) {
        setSearchState({ status: "loading" });
        setSearchError(null);

        try {
          const foundMovie = await searchMovie(query);
          if (foundMovie) {
            setSelectedMovie(foundMovie);
            setSearchState({ status: "success" });
          } else {
            setSearchState({ status: "not-found", query: query });
            setSelectedMovie(null);
          }
        } catch {
          setSearchState({ status: "error" });
          setSearchError("Failed to search for movie. Please try again.");
        }
      }
    }
  };

  return (
    <div>
      {/* Header with Search */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <motion.div
              className="relative flex items-center max-w-md w-full mx-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className={cn(
                  "flex items-center w-full rounded-full border relative overflow-hidden backdrop-blur-md transition-all duration-300",
                  isSearchFocused
                    ? "border-purple-500 shadow-lg shadow-purple-500/25 bg-white/10"
                    : "border-white/20 bg-white/5",
                )}
                animate={{
                  scale: isSearchFocused ? 1.02 : 1,
                }}
              >
                <Search
                  className={cn(
                    "ml-4 h-5 w-5 transition-colors duration-300",
                    isSearchFocused ? "text-purple-400" : "text-white/60",
                  )}
                />
                <input
                  type="text"
                  id="search"
                  placeholder="Search movies... (Press Enter to search)"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsSearchFocused(false);
                    }, 200);
                  }}
                  className="w-full px-4 py-3 bg-transparent outline-none text-white placeholder-white/60 text-sm"
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMovie(null);
                      setSearchState({ status: "idle" });
                    }}
                    className="mr-4 text-white/60 hover:text-white"
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
            </motion.div>

            <div className="text-white/60 text-sm">
              {MOVIES.length} movies available
            </div>
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {searchState.status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto text-center py-20"
          >
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Searching for movies...
            </h2>
            <div className="animate-pulse bg-white/20 h-2 w-48 mx-auto rounded-full" />
          </motion.div>
        )}

        {/* Not Found State */}
        {searchState.status === "not-found" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Movie not found
            </h2>
            <p className="text-white/60 mb-6">
              We couldn&apos;t find any movies matching &quot;
              {searchState.query}
              &quot;. Try searching for a different movie, director, or actor.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedMovie(null);
                setSearchState({ status: "idle" });
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Error State */}
        {searchState.status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center py-20"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Search Error
            </h2>
            <p className="text-white/60 mb-6">{searchError}</p>
            <button
              type="button"
              onClick={() => {
                setSearchState({ status: "idle" });
                setSearchError(null);
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {searchState.status === "idle" && !selectedMovie && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center py-20"
          >
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Welcome to CineVault
            </h2>
            <p className="text-white/60 mb-6">
              Search for movies to get started. Press Enter to search.
            </p>
            <div className="text-white/40 text-sm">
              Try searching for: "The Matrix", "Inception", "The Dark Knight"
            </div>
          </motion.div>
        )}

        {/* Movie Details - Only show when we have a selected movie */}
        {selectedMovie &&
          (searchState.status === "idle" ||
            searchState.status === "success") && (
            <motion.div
              key={selectedMovie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {/* Hero Section */}
              <div className="relative mb-8 rounded-2xl overflow-hidden">
                <div className="relative h-96 md:h-[500px]">
                  <img
                    src={selectedMovie.backdrop}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-shrink-0 mb-6 md:mb-0"
                      >
                        <img
                          src={selectedMovie.poster}
                          alt={selectedMovie.title}
                          className="w-48 h-72 object-cover rounded-lg shadow-2xl border-4 border-white/20"
                        />
                      </motion.div>

                      <div className="flex-1">
                        <motion.h1
                          className="text-4xl md:text-6xl font-bold text-white mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          {selectedMovie.title}
                        </motion.h1>

                        <motion.div
                          className="flex flex-wrap items-center gap-4 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-1 bg-yellow-500 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 text-black fill-current" />
                            <span className="text-black font-semibold text-sm">
                              {selectedMovie.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/80">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {selectedMovie.year}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/80">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              {selectedMovie.runtime}min
                            </span>
                          </div>
                          <div className="bg-purple-600 px-3 py-1 rounded-full">
                            <span className="text-white text-sm font-medium">
                              {selectedMovie.genre}
                            </span>
                          </div>
                        </motion.div>

                        <motion.p
                          className="text-white/90 text-lg leading-relaxed max-w-3xl mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          {selectedMovie.synopsis}
                        </motion.p>

                        <motion.button
                          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <Play className="h-5 w-5" />
                          <span>Watch Trailer</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Cast & Crew */}
                <motion.div
                  className="md:col-span-2 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Cast & Crew
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-purple-400 font-medium mb-2">
                          Director
                        </h4>
                        <p className="text-white/80">
                          {selectedMovie.director}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-purple-400 font-medium mb-2">
                          Main Cast
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMovie.cast.map((actor) => (
                            <span
                              key={actor}
                              className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm"
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Awards & Recognition
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.awards.map((award) => (
                        <span
                          key={award}
                          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-3 py-1 rounded-full text-yellow-300 text-sm"
                        >
                          {award}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Movie Stats */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Film className="h-5 w-5 mr-2" />
                      Movie Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Budget</span>
                        <span className="text-white font-medium">
                          {selectedMovie.budget}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Box Office</span>
                        <span className="text-white font-medium">
                          {selectedMovie.boxOffice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Studio</span>
                        <span className="text-white font-medium">
                          {selectedMovie.studio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Country</span>
                        <span className="text-white font-medium">
                          {selectedMovie.country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Languages</span>
                        <span className="text-white font-medium">
                          {selectedMovie.languages.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedMovie.rating}
                        </div>
                        <div className="text-white/60 text-sm">Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedMovie.runtime}
                        </div>
                        <div className="text-white/60 text-sm">Minutes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedMovie.year}
                        </div>
                        <div className="text-white/60 text-sm">Release</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedMovie.cast.length}
                        </div>
                        <div className="text-white/60 text-sm">Main Cast</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
      </main>
    </div>
  );
}

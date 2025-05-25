// src/utils/localStorageCache.js
import axios from "axios";
import apiConfig from "../api/apiConfig"; // Assuming apiConfig is correctly linked

const CACHE_PREFIX = "app_cache_"; // Prefix to avoid collisions in localStorage

/**
 * Stores data in localStorage with a timestamp.
 * @param {string} key - The key for the data.
 * @param {any} data - The data to store.
 */
export const setCacheItem = (key, data) => {
  const item = {
    data: data,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (e) {
    //console.error(`Error saving to localStorage for key ${key}:`, e);
  }
};

/**
 * Retrieves data from localStorage and checks its validity.
 * @param {string} key - The key for the data.
 * @param {number} expiryMs - The expiry time in milliseconds. Use Infinity for never expire.
 * @returns {any | null} The cached data if valid, otherwise null.
 */
export const getCacheItem = (key, expiryMs) => {
  try {
    const storedItem = localStorage.getItem(CACHE_PREFIX + key);
    if (!storedItem) {
      return null;
    }
    const item = JSON.parse(storedItem);
    const now = Date.now();

    if (expiryMs === Infinity) {
      // For items that never expire, just return the data
      return item.data;
    }

    if (now - item.timestamp < expiryMs) {
      return item.data; // Cache is still fresh
    } else {
      //console.log(`Cache expired for key: ${key}`);
      localStorage.removeItem(CACHE_PREFIX + key); // Remove expired item
      return null;
    }
  } catch (e) {
    //console.error(`Error reading from localStorage for key ${key}:`, e);
    localStorage.removeItem(CACHE_PREFIX + key); // Clear potentially corrupted data
    return null;
  }
};

// --- Specific fetch functions leveraging the cache utility ---

// Helper to format date (needed for the processing inside fetchSpotlightData)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
};

export const fetchGenres = async (mediaType) => {
  const cacheKey = `${mediaType}Genres`;
  const cachedGenres = getCacheItem(cacheKey, Infinity); // Genres never expire

  if (cachedGenres) {
    //console.log(`Using cached ${mediaType} genres.`);
    return cachedGenres;
  }

  //console.log(`Workspaceing new ${mediaType} genres.`);
  try {
    const res = await axios.get(
      `${apiConfig.baseUrl}genre/${mediaType}/list?api_key=${apiConfig.apiKey}`
    );
    const genresMap = res.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name.toUpperCase();
      return acc;
    }, {});
    setCacheItem(cacheKey, genresMap);
    return genresMap;
  } catch (error) {
    //console.error(`Error fetching ${mediaType} genres:`, error);
    throw error;
  }
};

export const fetchSpotlightData = async (movieGenres, tvGenres) => {
  const CACHE_EXPIRY_3_DAYS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  const cacheKey = "trendingSpotlight";
  const cachedData = getCacheItem(cacheKey, CACHE_EXPIRY_3_DAYS);

  if (cachedData) {
    //console.log("Using cached trending spotlight data.");
    return cachedData;
  }

  //console.log("Fetching new trending spotlight data (cache expired or not found).");
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${apiConfig.apiKey}&language=en-US`
    );
    let results = response.data.results;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cinemaWindowLimit = new Date(today);
    cinemaWindowLimit.setDate(today.getDate() - 21); // 8 weeks ago for the filter

    const filteredAndMappedData = results
      .filter(item => {
        if (item.media_type !== "movie" && item.media_type !== "tv") {
          return false;
        }
        if (!item.backdrop_path || !item.overview) {
          return false;
        }

        const releaseDateString = item.media_type === "movie" ? item.release_date : item.first_air_date;
        if (!releaseDateString) return false;

        const releaseDate = new Date(releaseDateString);
        releaseDate.setHours(0, 0, 0, 0);

        // Filter out unreleased items
        if (releaseDate > today) {
          return false;
        }

        // Filter out movies still likely in cinemas (released in the last 8 weeks)
        if (item.media_type === "movie" && releaseDate >= cinemaWindowLimit) {
          return false;
        }

        return true;
      })
      .map(item => {
        const isMovie = item.media_type === "movie";
        const genresMap = isMovie ? movieGenres : tvGenres;
        const itemGenres = item.genre_ids
          .map(id => genresMap[id])
          .filter(name => name)
          .slice(0, 3);

        const logoPath = item.poster_path ? apiConfig.w500Image(item.poster_path) : null;

        return {
          id: item.id,
          tmdb_id: item.id,
          media_type: item.media_type,
          image: apiConfig.originalImage(item.backdrop_path),
          logo: logoPath || apiConfig.w200Image(item.poster_path),
          lowres: apiConfig.w200Image(item.backdrop_path),
          genres: itemGenres,
          date: formatDate(isMovie ? item.release_date : item.first_air_date),
          score: `${Math.round(item.vote_average * 10)}%`,
          overview: item.overview,
          title: isMovie ? item.title : item.name,
          season: isMovie ? null : 1,
          episode: isMovie ? null : 1,
        };
      })
      .slice(0, 10);

    setCacheItem(cacheKey, filteredAndMappedData);
    return filteredAndMappedData;
  } catch (err) {
    //console.error("Failed to fetch trending spotlight data:", err);
    throw err;
  }
};
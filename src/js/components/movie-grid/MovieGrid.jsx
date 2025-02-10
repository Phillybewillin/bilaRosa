import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './movie-grid.scss';
import './genre.scss';
import Button, { OutlineButton } from '../button/Button';
import tmdbApi, { category } from '../../api/tmdbApi';
import { ToastContainer } from 'react-toastify';
import apiConfig from '../../api/apiConfig';
import axios from 'axios';

const MovieCard = React.lazy(() => import("../movie-card/MovieCard"));

// --- Type definitions ---
// For movies, our internal key for trending is "upcoming"
// For TV, our internal key for trending is "airing_today"
const movieType = {
  upcoming: 'TRENDING',
  popular: 'POPULAR',
  top_rated: 'TOP RATED'
};
const tvType = {
  airing_today: 'TRENDING',
  popular: 'POPULAR',
  top_rated: 'TOP RATED'
};

// --- Constant arrays for genres ---
const genresConst = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const tvgenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 9648, name: "Mystery" },
  { id: 10762, name: "Kids" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const MovieGrid = props => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- State declarations ---
  const [items, setItems] = useState([]);
  document.title = `${props.category === category.movie ? 'Movies • ZillaXR' : 'TV Shows • ZillaXR'}`;
  // Store selected genres as an array of numbers.
  const [selectedGenre, setSelectedGenre] = useState([]);
  // Store the internal selected type (string). If none is provided, we’ll default it.
  const [selectedType, setSelectedType] = useState('');
  const [tags, setTags] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  // --- Helper: Get internal default type ---
  const getDefaultType = () =>
    props.category === category.movie ? "upcoming" : "airing_today";

  // --- Helper: Update URL query parameters ---
  const updateQueryParams = (params) => {
    const searchParams = new URLSearchParams(location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        // For the type parameter, if the internal value equals the default, store "trending" in the URL.
        if (key === "type") {
          const defaultKey = getDefaultType();
          searchParams.set(key, value === defaultKey ? "trending" : value);
        } else if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value);
        }
      } else {
        searchParams.delete(key);
      }
    });
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    // Clear selected genres when the category changes.
    setSelectedGenre([]);

    // Optionally, update the URL to remove the with_genres parameter.
   // updateQueryParams({ with_genres: [] });
  }, [props.category]);
  

  // --- On Mount: Parse URL Query Parameters ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let typeParam = searchParams.get("type");
    // If no type param, default to "trending"
    if (!typeParam) {
      typeParam = "trending";
      searchParams.set("type", typeParam);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
    // Convert "trending" to our internal default key.
    const internalType = typeParam === "trending" ? getDefaultType() : typeParam;
    setSelectedType(internalType);
    const genresParam = searchParams.get("with_genres");
    if (genresParam) {
      setSelectedGenre(genresParam.split(',').map(Number));
    }
  }, [location.search, navigate, location.pathname, props.category , selectedGenre ]);

  // --- Handler for Type Selection ---
  const handleTypeSelect = (value) => {
    setSelectedType(value);
    updateQueryParams({ type: value });
  };

  // --- Handler for Genre Click (toggle selection) ---
  const handleGenreClick = (genreId) => {
    setSelectedGenre(prev => {
      let newSelected;
      if (prev.includes(genreId)) {
        newSelected = prev.filter(id => id !== genreId);
      } else {
        newSelected = [...prev, genreId];
      }
      updateQueryParams({ with_genres: newSelected });
      return newSelected;
    });
  };

  // --- Data Fetching Effect ---
  useEffect(() => {
    const BASE_URL = 'https://api.themoviedb.org/3';
    let API_URL = '';
    // If there are any genres selected, we always use the discover endpoint.
    if (selectedGenre.length > 0) {
      API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=popularity.desc&with_genres=${selectedGenre.join(',')}&with_origin_country=US`;
    } else {
      // Otherwise, use the endpoint for the selected type.
      API_URL = `${BASE_URL}/${props.category}/${selectedType ? selectedType : getDefaultType()}?api_key=${apiConfig.apiKey}&with_origin_country=US`;
    }
    // Set the correct tags for filtering.
    if (props.category === 'tv') {
      setTags(tvgenres);
    } else {
      setTags(genresConst);
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // Avoid duplicates by filtering items based on their ID.
        const uniqueItems = response.data.results.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
        setItems(uniqueItems);
        setPage(1);
        setTotalPage(response.data.total_pages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [selectedType, selectedGenre, props.category]);

  // --- Load More Functionality ---
  const loadMore = useCallback(async () => {
    if (page >= totalPage) return;
    const BASE_URL = 'https://api.themoviedb.org/3';
    let API_URL = '';
    if (selectedGenre.length > 0) {
      API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=popularity.desc&with_genres=${selectedGenre.join(',')}&page=${page + 1}&with_origin_country=US`;
    } else {
      API_URL = `${BASE_URL}/${props.category}/${selectedType ? selectedType : getDefaultType()}?api_key=${apiConfig.apiKey}&page=${page + 1}&with_origin_country=US`;
    }
    try {
      const response = await axios.get(API_URL);
      // Merge new items with previous items and avoid duplicates.
      const combined = [...items, ...response.data.results];
      const uniqueCombined = combined.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );
      setItems(uniqueCombined);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  }, [page, totalPage, selectedType, selectedGenre, props.category, items]);

  // --- Debounce and Scroll for Auto–Loading More ---
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const loadMoreOnScroll = debounce(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 0 && scrollTop + clientHeight >= scrollHeight * 0.75){
        loadMore();
      }
    }, 500);
    window.addEventListener('scroll', loadMoreOnScroll);
    return () => window.removeEventListener('scroll', loadMoreOnScroll);
  }, [loadMore]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilter = () => {
    navigate(`/filter`);
  };

  // --- Rendering: Remove duplicates again when mapping (just in case) ---
  const uniqueItems = items.filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );

  return (
    <>
      <div className="sectiongrid">
        <div className="section_header">
          <div className="section_search">
            {props.category === category.movie && (
              <div className="label">
                <div className="mb2x">
                  MOVIES <i className="bx bx-movie"></i>
                </div>
                <div className="select-container">
                  {Object.entries(movieType).map(([value, label]) => (
                    <div
                      key={value}
                      className={`select-option ${selectedType === value ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect(value)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {props.category === category.tv && (
              <div className="label">
                <div className="mb2x">
                  TV SHOWS <i className="bx bx-tv"></i>
                </div>
                <div className="select-container">
                  {Object.entries(tvType).map(([value, label]) => (
                    <div
                      key={value}
                      className={`select-option ${selectedType === value ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect(value)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="tags">
          {tags.map(genre => (
            <div className={`tagOutline ${selectedGenre.includes(genre.id) ? 'selected' : ''}`} key={genre.id}>
              <div
                className={`tag ${selectedGenre.includes(genre.id) ? 'selected' : ''}`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </div>
            </div>
          ))}
        </div>
        <div className="movie-grid" loading="lazy">
          <React.Suspense fallback={null}>
            {uniqueItems.map(item => (
              <MovieCard category={props.category} item={item} key={item.id} />
            ))}
          </React.Suspense>
        </div>
        {page < totalPage && (
          <div className="movie-grid__loadmore">
            <OutlineButton className="small" onClick={loadMore}> more +</OutlineButton>
          </div>
        )}
        <div
          className="scrolltotop"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            cursor: 'pointer',
            fontSize: '20px',
            backgroundColor: 'black',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'pink',
            opacity: ".6"
          }}
        >
          <i className="bx bx-chevron-up"></i>
        </div>
      </div>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        backdrop={true}
        progressStyle={{ backgroundColor: '#ff0000', color: 'white', borderRadius: '10px' }}
      />
    </>
  );
};

export default MovieGrid;

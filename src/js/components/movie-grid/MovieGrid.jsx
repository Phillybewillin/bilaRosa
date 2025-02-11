import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
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

// --- Sort Options ---
// For movies, sort by original_title; for TV shows, sort by name.
const movieSortOptions = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "release_date.desc", label: "Release Date Descending" },
  { value: "release_date.asc", label: "Release Date Ascending" },
  { value: "vote_average.desc", label: "Vote Average Descending" },
  { value: "vote_average.asc", label: "Vote Average Ascending" },
  { value: "original_title.asc", label: "Title A-Z" },
  { value: "original_title.desc", label: "Title Z-A" }
];

const tvSortOptions = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "first_air_date.desc", label: "First Air Date Descending" },
  { value: "first_air_date.asc", label: "First Air Date Ascending" },
  { value: "vote_average.desc", label: "Vote Average Descending" },
  { value: "vote_average.asc", label: "Vote Average Ascending" },
  { value: "name.asc", label: "Name A-Z" },
  { value: "name.desc", label: "Name Z-A" }
];

const MovieGrid = props => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- State declarations ---
  const [items, setItems] = useState([]);
  document.title = `${props.category === category.movie ? 'Movies • ZillaXR' : 'TV Shows • ZillaXR'}`;
  // Selected genres (array of numbers)
  const [selectedGenre, setSelectedGenre] = useState([]);
  // Selected type (for legacy/other UI purposes)
  const [selectedType, setSelectedType] = useState('');
  // New state for sort option (default is popularity.desc)
  const [sortBy, setSortBy] = useState("popularity.desc");
  // Always use origin country = US
  const originCountry = "US";
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

  // --- On Mount: Parse URL Query Parameters ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let typeParam = searchParams.get("type");
    if (!typeParam) {
      typeParam = "trending";
      searchParams.set("type", typeParam);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
    const internalType = typeParam === "trending" ? getDefaultType() : typeParam;
    setSelectedType(internalType);

    // Parse sort option if provided.
    const sortParam = searchParams.get("sort_by");
    if (sortParam) {
      setSortBy(sortParam);
    } else {
      updateQueryParams({ sort_by: sortBy });
    }

    const genresParam = searchParams.get("with_genres");
    if (genresParam) {
      setSelectedGenre(genresParam.split(',').map(Number));
    }
  }, [location.search, navigate, location.pathname, props.category, sortBy]);

  // --- Clear selected genres when category changes ---
  useEffect(() => {
    setSelectedGenre([]);
    updateQueryParams({ with_genres: [] });
  }, [props.category]);

  // --- Handler for Type Selection (legacy UI) ---
  const handleTypeSelect = (value) => {
    setSelectedType(value);
    updateQueryParams({ type: value });
  };

  // --- Handler for Genre Click ---
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

  // --- Handler for Sort Option Change (using react-select) ---
  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    updateQueryParams({ sort_by: selectedOption.value });
  };

  // --- Choose appropriate sort options based on category ---
  const sortOptions = props.category === category.movie ? movieSortOptions : tvSortOptions;

  // --- Data Fetching Effect ---  
  // Always use the discover endpoint so we can combine sort_by, with_origin_country, and with_genres.
  useEffect(() => {
    const BASE_URL = 'https://api.themoviedb.org/3';
    let API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=${sortBy}&with_origin_country=${originCountry}`;
    if (selectedGenre.length > 0) {
      API_URL += `&with_genres=${selectedGenre.join(',')}`;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // Filter out duplicates and remove items with no poster_path.
        const filteredResults = response.data.results.filter(item => item.poster_path);
        const uniqueItems = filteredResults.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );
        setItems(uniqueItems);
        setPage(1);
        setTotalPage(response.data.total_pages);
      } catch (error) {
        console.error(error);
      }
    };
    // Set tags based on category.
    if (props.category === 'tv') {
      setTags(tvgenres);
    } else {
      setTags(genresConst);
    }
    fetchData();
  }, [selectedGenre, sortBy, props.category, originCountry]);

  // --- Load More Functionality ---
  const loadMore = useCallback(async () => {
    if (page >= totalPage) return;
    const BASE_URL = 'https://api.themoviedb.org/3';
    let API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=${sortBy}&with_origin_country=${originCountry}&page=${page + 1}`;
    if (selectedGenre.length > 0) {
      API_URL += `&with_genres=${selectedGenre.join(',')}`;
    }
    try {
      const response = await axios.get(API_URL);
      const newResults = response.data.results.filter(item => item.poster_path);
      const combined = [...items, ...newResults];
      const uniqueCombined = combined.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );
      setItems(uniqueCombined);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  }, [page, totalPage, selectedGenre, sortBy, props.category, originCountry, items]);

  // --- Debounce and Auto-Load on Scroll ---
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
      if (scrollTop > 0 && scrollTop + clientHeight >= scrollHeight * 0.75) {
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

  // Remove duplicates (as a precaution) before mapping.
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
            {/* --- Sort Dropdown using react-select --- */}
            <div className="sort-container" style={{ marginTop: '.5rem', maxWidth: '250px' , fontSize: '13px', cursor: 'pointer' }}>
              <Select 
                options={sortOptions}
                value={sortOptions.find(option => option.value === sortBy)}
                onChange={handleSortChange}
                placeholder="Sort by..."
                theme={(theme) => ({
                  ...theme,
                
                 // fontSize: '10px',
                // backdropFilter: 'blur(10px)',
                  borderRadius: 10,
                  colors: {
                    ...theme.colors,
                    primary25: '#afafaf54',
                    primary: '#38383879',
                    neutral0 : '#000000c9',
            
                   neutral5: 'grey',
                   neutral10: '#38383879',
                    neutral20: '#38383879',
               neutral30: 'red',
                neutral40: 'pink',
               neutral50: '#a9a9a9',
               neutral60: '#38383879',
                neutral70: '#696969',
               neutral80: '#505050',
                neutral90: '#303030'
                  },
                })}
              />
            </div>
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
            <OutlineButton className="small" onClick={loadMore}>+</OutlineButton>
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
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
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

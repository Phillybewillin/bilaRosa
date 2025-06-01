import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { motion } from 'framer-motion';
import './movie-grid.scss';
import './genre.scss';
import Button, { OutlineButton } from '../button/Button';
import tmdbApi, { category } from '../../api/tmdbApi';
import { ToastContainer } from 'react-toastify';
import apiConfig from '../../api/apiConfig';
import axios from 'axios';
import MovieExpand from '../../pages/MovieExpand';
import TrueFocus from '../reactbits/TrueFocus';

const MovieCard = React.lazy(() => import("../movie-card/MovieCard"));

// --- Type definitions ---
const movieType = {
    trending: 'Trending', // Added Trending
    upcoming: 'Upcoming',
    popular: 'Popular',
    top_rated: 'Top Rated'
};
const tvType = {
    trending: 'Trending', // Added Trending
    airing_today: 'Airing Today',
    popular: 'Popular',
    top_rated: 'Top Rated'
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

// Framer Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)" },
    tap: { scale: 0.98 }
};

const tagVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1  },
    tap: { scale: 0.95 }
};

const typeOptionVariants = {
    hover: { scale: 1 },
    tap: { scale: 0.95 }
};

const MovieGrid = props => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- State declarations ---
    const [items, setItems] = useState([]);
    document.title = `${props.category === category.movie ? 'Discover Movies | MoviePluto' : ' Discover TV Shows | MoviePluto'}`;
    const [selectedGenre, setSelectedGenre] = useState([]);
    const [selectedType, setSelectedType] = useState('trending');
    const [sortBy, setSortBy] = useState("popularity.desc");
    const originCountry = "US";
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    // --- Helper: Get internal default type ---
    const getDefaultType = useCallback(() =>
        props.category === category.movie ? "trending" : "trending", // Default to "trending" for both
        //setSelectedType(),
        [props.category]
    );

    // --- Helper: Update URL query parameters ---
    const updateQueryParams = useCallback((params) => {
        const searchParams = new URLSearchParams(location.search);
        let hasChanges = false;

        Object.entries(params).forEach(([key, value]) => {
            let currentValue = searchParams.get(key);
            let newValue = value;

            if (Array.isArray(value)) {
                newValue = value.length === 0 ? null : value.join(',');
            }

            if (newValue === null || newValue === '') {
                if (currentValue !== null) {
                    searchParams.delete(key);
                    hasChanges = true;
                }
            } else if (currentValue !== String(newValue)) {
                searchParams.set(key, newValue);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        }
    }, [navigate ,props.category , getDefaultType]); // location.search is needed here for accurate current state

    // --- On Mount: Parse URL Query Parameters and Initialize State ---
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        // Initialize type from URL or set to default "trending"
        const typeParam =  getDefaultType();
        setSelectedType( 'trending'|| typeParam);

        // Initialize sort_by from URL or set to default "popularity.desc"
        const sortParam = searchParams.get("sort_by") || "popularity.desc";
        setSortBy(sortParam);

        // Initialize genres from URL
        const genresParam = searchParams.get("with_genres");
        const currentSelectedGenres = genresParam ? genresParam.split(',').map(Number) : [];
        setSelectedGenre(currentSelectedGenres);

        // Set initial tags based on category
        setTags(props.category === category.movie ? genresConst : tvgenres);

        // Ensure URL reflects the initial state, especially for "trending" if not present
        const initialParams = {};
        if (!searchParams.has("type")) {
            initialParams.type = typeParam;
        }
        if (!searchParams.has("sort_by")) {
            initialParams.sort_by = sortParam;
        }
        // Only update URL if there are missing parameters to add
        if (Object.keys(initialParams).length > 0) {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            Object.entries(initialParams).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    newSearchParams.set(key, value);
                }
            });
            navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
        }

    }, [props.category, getDefaultType, navigate]); // Depend on location.search to re-parse if URL changes from outside

    // --- Clear filters and update URL when category changes ---
    useEffect(() => {
        setSelectedGenre([]);
        const defaultType = getDefaultType();
        setSelectedType(defaultType);
        setSortBy("popularity.desc"); // Reset sort to default when category changes
        updateQueryParams({
            with_genres: [],
            type: defaultType,
            sort_by: "popularity.desc",
            page: 1
        });
        setTags(props.category === category.movie ? genresConst : tvgenres);
        setPage(1); // Reset page
    }, [props.category, getDefaultType, updateQueryParams]);

    // --- Handler for Type Selection (e.g., Upcoming, Popular, Trending) ---
    const handleTypeSelect = (value) => {
        setSelectedType(value);
        setSelectedGenre([]); // Clear genres when a type is selected
        setPage(1); // Reset page
        updateQueryParams({ type: value, with_genres: [], page: 1 });
    };

    // --- Handler for Genre Click ---
    const handleGenreClick = (genreId) => {
        // If a type is currently selected, clear it.
        if (selectedType) {
            setSelectedType('');
        }
        setSelectedGenre(prev => {
            let newSelected;
            if (prev.includes(genreId)) {
                newSelected = prev.filter(id => id !== genreId);
            } else {
                newSelected = [...prev, genreId];
            }
            setPage(1); // Reset page
            updateQueryParams({
                with_genres: newSelected,
                type: '', // Clear type param from URL when genres are active
                page: 1
            });
            return newSelected;
        });
    };

    // --- Handler for Sort Option Change (using react-select) ---
    const handleSortChange = (selectedOption) => {
        setSortBy(selectedOption.value);
        setPage(1); // Reset page
        updateQueryParams({ sort_by: selectedOption.value, page: 1 });
    };

    // --- Choose appropriate sort options based on category ---
    const sortOptions = props.category === category.movie ? movieSortOptions : tvSortOptions;

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchData = async () => {
            const BASE_URL = 'https://api.themoviedb.org/3';
            let API_URL = '';

            // Construct API URL based on selected filters
            if (selectedGenre.length > 0) {
                // If genres are selected, use discover endpoint
                API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=${sortBy}&with_origin_country=${originCountry}&with_genres=${selectedGenre.join(',')}&page=1`;
            } else {
                // Otherwise, use type endpoint (trending, popular, top_rated, upcoming, airing_today)
                // Map the internal selectedType state value to the API's expected endpoint
                let apiEndpointType;
                if (selectedType === 'trending') {
                    apiEndpointType = `trending/${props.category}/day`;
                } else {
                    apiEndpointType = `${props.category}/${selectedType}`;
                }
                API_URL = `${BASE_URL}/${apiEndpointType}?api_key=${apiConfig.apiKey}&page=1`;
            }

            try {
                const response = await axios.get(API_URL);
                const filteredResults = response.data.results.filter(item => item.poster_path);
                const uniqueItems = filteredResults.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );
                setItems(uniqueItems);
                console.log('reff',uniqueItems);
                setPage(1); // Always reset to page 1 on new filter/type fetch
                setTotalPage(response.data.total_pages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setItems([]);
                setTotalPage(0);
            }
        };

        // This effect should run when selectedGenre, selectedType, sortBy, or props.category changes.
        // It will also run on initial mount due to initial state values.
        fetchData();
    }, [props.category, selectedGenre, selectedType, sortBy, originCountry , location.search]);


    // --- Load More Functionality ---
    const loadMore = useCallback(async () => {
        if (page >= totalPage) return;

        const BASE_URL = 'https://api.themoviedb.org/3';
        let API_URL = '';

        if (selectedGenre.length > 0) {
            API_URL = `${BASE_URL}/discover/${props.category}?api_key=${apiConfig.apiKey}&sort_by=${sortBy}&with_origin_country=${originCountry}&page=${page + 1}`;
            API_URL += `&with_genres=${selectedGenre.join(',')}`;
        } else {
            const typeParamForApi = selectedType === 'trending' ? `trending/${props.category}/day` : `${props.category}/${selectedType}`;
            API_URL = `${BASE_URL}/${typeParamForApi}?api_key=${apiConfig.apiKey}&page=${page + 1}`;
        }

        try {
            const response = await axios.get(API_URL);
            const newResults = response.data.results.filter(item => item.poster_path);
            setItems(prevItems => {
                const combined = [...prevItems, ...newResults];
                const uniqueCombined = combined.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );
                return uniqueCombined;
            });
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Failed to load more data:", error);
        }
    }, [page, totalPage, selectedGenre, sortBy, props.category, originCountry, selectedType]);


    // --- Debounce and Auto-Load on Scroll ---
    const debounce = useCallback((func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }, []);

    useEffect(() => {
        const loadMoreOnScroll = debounce(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop + clientHeight >= scrollHeight * 0.75 && page < totalPage) {
                loadMore();
            }
        }, 500);
        window.addEventListener('scroll', loadMoreOnScroll);
        return () => window.removeEventListener('scroll', loadMoreOnScroll);
    }, [loadMore, debounce, page, totalPage]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                                <TrueFocus
                                    sentence="Discover Movies"
                                    manualMode={true}
                                    blurAmount={4}
                                    borderColor="red"
                                    animationDuration={0.7}
                                    pauseBetweenAnimations={1}
                                />
                            </div>
                        )}
                        {props.category === category.tv && (
                            <div className="label">
                                <TrueFocus
                                    sentence="Discover TVShows"
                                    manualMode={true}
                                    blurAmount={4}
                                    borderColor="red"
                                    animationDuration={0.7}
                                    pauseBetweenAnimations={1}
                                />
                            </div>
                        )}

                        <MovieExpand category={props.category} />

                         {props.category === category.movie && (
                            <div className="labelp">
                                <TrueFocus
                                    sentence="Discover Movies"
                                    manualMode={true}
                                    blurAmount={4}
                                    borderColor="red"
                                    animationDuration={0.7}
                                    pauseBetweenAnimations={1}
                                />
                            </div>
                        )}
                        {props.category === category.tv && (
                            <div className="labelp">
                                <TrueFocus
                                    sentence="Discover TVShows"
                                    manualMode={true}
                                    blurAmount={4}
                                    borderColor="red"
                                    animationDuration={0.7}
                                    pauseBetweenAnimations={1}
                                />
                            </div>
                        )}

                        {/* --- Type Selection (e.g., Trending, Upcoming, Popular) with Framer Motion --- */}
                        {(props.category === category.movie || props.category === category.tv) && (
                            <motion.div
                                className="select-container"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {Object.entries(props.category === category.movie ? movieType : tvType).map(([value, label]) => (
                                    <motion.div
                                        key={value}
                                        className={`select-option ${selectedType === value ? 'selected' : ''}`}
                                        onClick={() => handleTypeSelect(value)}
                                        variants={typeOptionVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        {label}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* --- Sort Dropdown using react-select (only applicable when genres are used) --- */}
                        {selectedGenre.length > 0 && (
                            <motion.div
                                className="sort-container"
                                style={{ marginTop: '.5rem', maxWidth: '250px', fontSize: '13px', cursor: 'pointer' }}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <Select
                                    options={sortOptions}
                                    value={sortOptions.find(option => option.value === sortBy)}
                                    onChange={handleSortChange}
                                    placeholder="Sort by..."
                                    theme={(theme) => ({
                                        ...theme,
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
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* --- Genre Tags with Framer Motion --- */}
                <motion.div
                    className="tags"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {tags.map(genre => (
                        <motion.div
                            className={`tagOutline ${selectedGenre.includes(genre.id) ? 'tagselected' : ''}`}
                            key={genre.id}
                            variants={tagVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <div
                                className={`tag ${selectedGenre.includes(genre.id) ? 'tagselected' : ''}`}
                                onClick={() => handleGenreClick(genre.id)}
                            >
                                {genre.name}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- Movie Grid Items with Framer Motion --- */}
                <motion.div
                    className="movie-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <React.Suspense fallback={null}>
                        {uniqueItems.map(item => (
                            <MovieCard category={props.category} item={item} key={item.id} />
                        ))}
                    </React.Suspense>
                </motion.div>

                {page < totalPage && (
                    <div className="movie-grid__loadmore">
                        <OutlineButton className="small" onClick={loadMore}>Load More</OutlineButton>
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
                progressStyle={{ backgroundColor: '#ff0000', color: 'white', borderRadius: '10px' }}
            />
        </>
    );
};

export default MovieGrid;
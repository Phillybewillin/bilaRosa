import apiConfig from "../api/apiConfig";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import Input from "../components/input/Input";
import MovieCard from "../components/movie-card/MovieCard";
import ActorCard from "../components/actor-card/ActorCard"; // Assuming ActorCard takes 'actor' prop
import { motion, AnimatePresence } from "framer-motion";

import './search.scss';

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = UserAuth(); // Assuming UserAuth is correctly set up

    const [allSearchResults, setAllSearchResults] = useState([]); // Stores the raw 'multi' search results or actor filmography
    const [filteredResults, setFilteredResults] = useState([]); // Stores results after applying media type filter
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
    const [noResults, setNoResults] = useState(false);
    // Added 'actor_tv' to filter types for actor's TV shows
    const [filter, setFilter] = useState('all'); // 'all', 'movie', 'tv', 'person', 'actor_movies', 'actor_tv'
    const [actorFilmographyId, setActorFilmographyId] = useState(null);
    const [actorFilmographyName, setActorFilmographyName] = useState('');

    const prevSearchValueRef = useRef(''); // To track if the actual search query has changed

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Persist search query, filter, and actor_id from URL on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParam = searchParams.get("query");
        const filterParam = searchParams.get("filter");
        const actorIdParam = searchParams.get("actor_id");
        const actorNameParam = searchParams.get("actor_name");

        if (queryParam) {
            setSearchValue(queryParam);
        }
        // Ensure all valid filter types are included
        const validFilters = ['all', 'movie', 'tv', 'person', 'actor_movies', 'actor_tv'];
        if (filterParam && validFilters.includes(filterParam)) {
            setFilter(filterParam);
        }
        if (actorIdParam) {
            setActorFilmographyId(actorIdParam);
        } else {
            setActorFilmographyId(null);
        }
        if (actorNameParam) {
            setActorFilmographyName(decodeURIComponent(actorNameParam));
        } else {
            setActorFilmographyName('');
        }
    }, [location.search]);

    // Debounce the searchValue
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchValue]);

    // Update URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams();
        if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
            searchParams.set("query", debouncedSearchValue);
        }

        searchParams.set("filter", filter);

        if (actorFilmographyId && (filter === 'actor_movies' || filter === 'actor_tv')) {
            searchParams.set("actor_id", actorFilmographyId);
            searchParams.set("actor_name", encodeURIComponent(actorFilmographyName));
        } else {
            searchParams.delete("actor_id");
            searchParams.delete("actor_name");
        }

        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [debouncedSearchValue, filter, actorFilmographyId, actorFilmographyName, navigate, location.pathname]);


    // Primary search function - fetches data based on debouncedSearchValue and actorFilmographyId
    const fetchSearchResults = useCallback(async (query, actorId) => {
        if (!query || query.trim() === "") {
            setAllSearchResults([]);
            setNoResults(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setNoResults(false);

        let url = '';
        let fetchedData = [];

        if (actorId) {
            // Fetch actor's combined filmography
            url = `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${apiConfig.apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                // Ensure media_type is present for filtering later
                fetchedData = (data.cast || [])
                    .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.profile_path))
                    .map(item => ({ ...item, media_type: item.media_type })); // Explicitly set media_type
            } catch (error) {
                console.error("Error fetching actor filmography:", error);
            }
        } else {
            // General multi search
            url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiConfig.apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                // Filter out results without an image path and ensure media_type is always set
                fetchedData = (data.results || [])
                    .filter(item => item.poster_path || item.profile_path)
                    .map(item => ({ ...item, media_type: item.media_type || 'unknown' })); // Default to 'unknown' if not present
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        }

        if (fetchedData.length === 0) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
        setAllSearchResults(fetchedData); // Cache the raw multi/filmography results
        setIsLoading(false);
    }, []);

    // Effect to trigger fetching only when debouncedSearchValue or actorFilmographyId actually changes
    useEffect(() => {
        // Only fetch if the search query has truly changed OR if we are switching to/from an actor's filmography
        // and the actor ID has changed.
        if (debouncedSearchValue !== prevSearchValueRef.current || (actorFilmographyId && actorFilmographyId !== prevSearchValueRef.current.actorId)) {
            fetchSearchResults(debouncedSearchValue, actorFilmographyId);
            prevSearchValueRef.current = {
                query: debouncedSearchValue,
                actorId: actorFilmographyId
            };
        }
    }, [debouncedSearchValue, actorFilmographyId, fetchSearchResults]);

    // Effect to filter the cached 'allSearchResults' based on the 'filter' state
    useEffect(() => {
        let currentFiltered = [];

        if (filter === 'all' || filter === 'person') { // 'person' filter should show only people
            currentFiltered = allSearchResults.filter(item => item.media_type === filter || filter === 'all');
        } else if (filter === 'movie' || filter === 'tv') {
            currentFiltered = allSearchResults.filter(item => item.media_type === filter);
        } else if (filter === 'actor_movies') {
            currentFiltered = allSearchResults.filter(item => item.media_type === 'movie');
        } else if (filter === 'actor_tv') {
            currentFiltered = allSearchResults.filter(item => item.media_type === 'tv');
        }

        setFilteredResults(currentFiltered);
    }, [filter, allSearchResults]);


    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        setActorFilmographyId(null); // Clear actor context when typing a new search
        setActorFilmographyName('');
        setFilter('all'); // Reset filter to 'all' for new search
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        // If switching from actor-specific filters to general filters, clear actor details
        if (!newFilter.startsWith('actor_')) {
            setActorFilmographyId(null);
            setActorFilmographyName('');
        }
    };

    const handleActorClick = (actorId, actorName) => {
        // When an actor is clicked, we want to display their filmography,
        // setting the search value to their name and the filter to 'actor_movies' initially.
        //setSearchValue(actorName);
        setActorFilmographyId(actorId);
        setActorFilmographyName(actorName);
        setFilter('actor_movies'); // Default to showing movies when an actor is selected
        // The useEffect for `debouncedSearchValue` and `actorFilmographyId` will trigger a fetch
    };

    // Calculate counts for labels
    const allCount = allSearchResults.length;
    const movieCount = allSearchResults.filter(item => item.media_type === 'movie').length;
    const tvShowCount = allSearchResults.filter(item => item.media_type === 'tv').length;
    const personCount = allSearchResults.filter(item => item.media_type === 'person').length;
    const actorMovieCount = allSearchResults.filter(item => item.media_type === 'movie').length;
    const actorTvShowCount = allSearchResults.filter(item => item.media_type === 'tv').length;


    return (
        <div className="search-page-container">
            {/* The background blur will now use the first movie/show result's poster for actor filmography too */}
            <div className="backgrblur" style={{ backgroundImage: `url(${apiConfig.w200Image(filteredResults[0]?.poster_path || filteredResults[0]?.profile_path)})` }}></div>
            <h1 className="search-title">{searchValue ? `Search results for "${actorFilmographyName ? actorFilmographyName : searchValue}"` : 'Search for movies, TV shows, or actors...'}</h1>
            <div className="search-input-wrapper">
                <Input
                    type="text"
                    placeholder="Search for movies, TV shows, or actors..."
                    value={searchValue}
                    onChange={handleInputChange}
                />
                {searchValue && (
                    <div className="clear-search-button" onClick={() => setSearchValue('')}>
                        <i style={{ fontSize: '20px' }} className='bx bx-x'></i>
                    </div>
                )}
            </div>

            <div className="filter-buttons">
                {/* General search filters */}
                {!actorFilmographyId && (
                    <>
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All ({allCount})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'movie' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('movie')}
                        >
                            Movies ({movieCount})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'tv' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('tv')}
                        >
                            Shows ({tvShowCount})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'person' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('person')}
                        >
                            Actors ({personCount})
                        </button>
                    </>
                )}

                {/* Actor filmography filters */}
                {actorFilmographyId && actorFilmographyName && (
                    <>
                        <button
                            className={`filter-btn ${filter === 'actor_movies' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('actor_movies')}
                        >
                            {actorFilmographyName}'s Movies ({actorMovieCount})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'actor_tv' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('actor_tv')}
                        >
                            {actorFilmographyName}'s Shows ({actorTvShowCount})
                        </button>
                        <button
                            className="filter-btn"
                            onClick={() => {
                                // Go back to general search
                                //setSearchValue('');
                                setActorFilmographyId(null);
                                setActorFilmographyName('');
                                setFilter('all');
                            }}
                        >
                            Back to Search
                        </button>
                    </>
                )}
            </div>

            {isLoading && searchValue ? (
                <p className="loading-message">Loading results...</p>
            ) : (
                <>
                    {/* Display "No Results" if the base search yielded none */}
                    {noResults && searchValue && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="no-results"
                        >
                            <h3 className='noresult'>¯\_(ツ)_/¯ Not found</h3>
                        </motion.div>
                    )}
                    {/* Display "No items for this filter" if filtered results are empty but base results exist */}
                    {!noResults && filteredResults.length === 0 && allSearchResults.length > 0 && searchValue && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="no-results"
                        >
                            <h3 className='noresult'>No results for this filter.</h3>
                        </motion.div>
                    )}
                    {filteredResults.length > 0 && (
                        <motion.div
                            className="search-results-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence>
                                {filteredResults.map((item) => {
                                    const mediaType = item.media_type; // Use item.media_type directly

                                    if (mediaType === 'person') {
                                        return (
                                            <motion.div key={item.id + '-person'} variants={itemVariants}>
                                                <ActorCard actor={item} onClick={() => handleActorClick(item.id, item.name)} />
                                            </motion.div>
                                        );
                                    } else if (mediaType === 'movie' || mediaType === 'tv') {
                                        return (
                                            <motion.div key={item.id + '-' + mediaType} variants={itemVariants}>
                                                <MovieCard
                                                    item={item}
                                                    category={mediaType}
                                                />
                                            </motion.div>
                                        );
                                    }
                                    return null;
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;

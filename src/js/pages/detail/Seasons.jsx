// Seasons.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import tmdbApi from "../../api/tmdbApi";
import Button, { OutlineButton } from '../../components/button/Button';
import Select from 'react-select';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './episodes.scss';
import './seasons.scss';

// --- Re-import react-loading-skeleton CSS ---
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // <--- THIS IS BACK AND ESSENTIAL!

// Generic placeholder image for episodes
const GENERIC_EPISODE_PLACEHOLDER = 'https://via.placeholder.com/500x281/333333/FFFFFF?text=No+Episode+Image';

// --- LoadingSkeleton component with SkeletonTheme internally ---
const LoadingSkeleton = ({ count = 6 }) => {
    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#303030" enableAnimation={false}> {/* Apply theme directly here */}
            <div className="episodes-grid skeleton-grid">
                {Array.from({ length: count }).map((_, index) => (
                    <div className="episode-card-item skeleton" key={index}>
                        <div className="episode-card__image-container">
                            <Skeleton className="skeleton-image" />
                        </div>
                        <div className="episode-card__info">
                            <h3 className="episode-card__title">
                                <Skeleton width="80%" className="skeleton-text" />
                            </h3>
                            <p className="episode-card__overview">
                                <Skeleton count={3} className="skeleton-text" />
                            </p>
                            <p className="episode-card__air-date">
                                <Skeleton width="50%" className="skeleton-text" />
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
};

const Seasons = ({ id, category, title, initialSeasonsData  }) => { // <--- Receive initialSeasonsData

    
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(null);
    const [seasonEpisodesCache, setSeasonEpisodesCache] = useState({}); // Stores { [seasonNumber]: { data: Episode[], loading: boolean, error: any } }
    const swiperRef = useRef(null);
    const initialSlideIndexRef = useRef(0); // Use a ref to store the initial slide index

    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '18px',
            boxShadow: state.isFocused ? '0 0 0 1pxrgb(21, 21, 21)' : 'none',
            '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.04)',
            },
            minHeight: '43px',
            fontSize: '.86rem',
            cursor: 'pointer',
            padding: '0 1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#ffffff',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#ffffff',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0.68)',
            backdropFilter: 'blur(15px)',
            borderRadius: '8px',
            marginTop: '5px',
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'rgba(161, 161, 161, 0.2)'
                : state.isFocused
                ? 'rgba(67, 67, 67, 0.2)'
                : 'transparent',
            color: '#ffffff',
            padding: '12px 15px',
            fontSize: '.74rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:active': {
                backgroundColor: '#e50914',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: '#ffffff',
            transition: 'transform 0.3s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
        }),
    };

    // --- Main Effect: Fetch show details and set initial season ---
        useEffect(() => {
        if (initialSeasonsData && initialSeasonsData.length > 0) {
            const validSeasons = initialSeasonsData.filter(
                item => item.season_number !== 0 && item.air_date && new Date(item.air_date) <= new Date()
            ).sort((a, b) => a.season_number - b.season_number);

            setSeasons(validSeasons);

            const lastClickedSeason = localStorage.getItem(`lastClickedSeason_${id}`);
            let initialSeasonNum;

            if (lastClickedSeason && validSeasons.some(s => s.season_number === parseInt(lastClickedSeason))) {
                initialSeasonNum = parseInt(lastClickedSeason);
            } else {
                // If there are valid seasons, default to the last one (most recent)
                initialSeasonNum = validSeasons.length > 0 ? validSeasons[0].season_number : null;
            }

            if (initialSeasonNum !== null) {
                setSelectedSeasonNumber(initialSeasonNum);
                initialSlideIndexRef.current = validSeasons.findIndex(s => s.season_number === initialSeasonNum);
            } else {
                setSelectedSeasonNumber(null);
            }
        } else {
            setSeasons([]);
            setSelectedSeasonNumber(null);
            setSeasonEpisodesCache({});
        }
    }, [id, initialSeasonsData]); // Depend on initialSeasonsData



    // --- Effect: Fetch episodes for the selected season ---
    useEffect(() => {
        if (selectedSeasonNumber === null) return;

        const currentSeasonData = seasonEpisodesCache[selectedSeasonNumber];

        // Only fetch if data is not present, not currently loading, and no previous error
        if (!currentSeasonData || (!currentSeasonData.data?.length && !currentSeasonData.loading && !currentSeasonData.error)) {
            const fetchEpisodes = async () => {
                // Set loading state for the specific season
                setSeasonEpisodesCache(prev => ({
                    ...prev,
                    [selectedSeasonNumber]: { data: [], loading: true, error: null }
                }));
                try {
                    const response = await axios.get(
                        `${apiConfig.baseUrl}tv/${id}/season/${selectedSeasonNumber}?api_key=${apiConfig.apiKey}`
                    );
                    const filteredEpisodes = response.data.episodes.filter(
                        episode => episode.air_date && new Date(episode.air_date) <= new Date() && episode.still_path
                    );
                    // Update with fetched data
                    setSeasonEpisodesCache(prev => ({
                        ...prev,
                        [selectedSeasonNumber]: { data: filteredEpisodes, loading: false, error: null }
                    }));
                } catch (error) {
                    console.error("Failed to fetch episodes for season", selectedSeasonNumber, ":", error);
                    // Update with error state
                    setSeasonEpisodesCache(prev => ({
                        ...prev,
                        [selectedSeasonNumber]: { data: [], loading: false, error: error }
                    }));
                }
            };
            fetchEpisodes();
            localStorage.setItem(`lastClickedSeason_${id}`, selectedSeasonNumber);
        }
    }, [selectedSeasonNumber, id, seasonEpisodesCache ]); // Depend on seasonEpisodesCache to re-evaluate if needed

    const handleEpisodeClick = (episodeData) => {
        const { episode_number, name } = episodeData;
        const watchHistory = localStorage.getItem("watchHistory");
        const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};

        if (!watchHistoryObj[id]) {
            watchHistoryObj[id] = {};
        }
        if (!watchHistoryObj[id][selectedSeasonNumber]) {
            watchHistoryObj[id][selectedSeasonNumber] = [];
        }
        if (!watchHistoryObj[id][selectedSeasonNumber].includes(episode_number)) {
            watchHistoryObj[id][selectedSeasonNumber].push(episode_number);
        }
        localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));

        if (title && id && selectedSeasonNumber && episode_number) {
            const encodedTitle = encodeURIComponent(
                title.replace(/ /g, "-").toLowerCase()
            );
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeasonNumber}/${episode_number}`);
        }
    };

    const watchHistory = localStorage.getItem("watchHistory");
    const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};

    const seasonOptions = seasons.map(s => ({
        value: s.season_number,
        label: `Season ${s.season_number}`
    }));

    // --- Swiper navigation refs handling ---
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiperInstance = swiperRef.current.swiper;
            // Set real elements for navigation
            swiperInstance.params.navigation.prevEl = prevButtonRef.current;
            swiperInstance.params.navigation.nextEl = nextButtonRef.current;
            // Only re-initialize if navigation elements change or are updated
            if (prevButtonRef.current && nextButtonRef.current) {
                swiperInstance.navigation.destroy();
                swiperInstance.navigation.init();
                swiperInstance.navigation.update();
            }
        }
    }, [seasons, prevButtonRef.current, nextButtonRef.current]); // Depend on button refs and seasons

    const onSwiperSlideChange = (swiper) => {
        const newSeasonNum = seasons[swiper.activeIndex]?.season_number;
        if (newSeasonNum !== undefined && newSeasonNum !== selectedSeasonNumber) {
            setSelectedSeasonNumber(newSeasonNum);
        }
    };

    const episodeCardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="show-seasons-section">
            {/* Season Controls */}
            <div className="season-controls">
                <button
                    ref={prevButtonRef}
                    className="season-nav-button"
                >
                    <i className="bx bxs-chevron-left"></i> Prev
                </button>

                <div className="season-dropdown-wrapper">
                    <Select
                        options={seasonOptions}
                        value={seasonOptions.find(option => option.value === selectedSeasonNumber)}
                        onChange={(option) => {
                            const newIndex = seasons.findIndex(s => s.season_number === option.value);
                            if (swiperRef.current && swiperRef.current.swiper && newIndex !== -1) {
                                swiperRef.current.swiper.slideTo(newIndex);
                                setSelectedSeasonNumber(option.value); // Directly update selectedSeasonNumber for dropdown
                            }
                        }}
                        placeholder={`Season ${selectedSeasonNumber ? `Season ${selectedSeasonNumber}` : 'Select Season'}`}
                        classNamePrefix="react-select"
                        styles={customSelectStyles}
                    />
                </div>

                <button
                    ref={nextButtonRef}
                    className="season-nav-button"
                >
                    Next <i className="bx bxs-chevron-right"></i>
                </button>
            </div>

            {/* Episodes Display - Swiper for Seasons */}
            {seasons.length > 0 && selectedSeasonNumber !== null ? (
                <div className="episodes-display-area">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Pagination, Keyboard]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                            prevEl: prevButtonRef.current,
                            nextEl: nextButtonRef.current,
                        }}
                        pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
                        keyboard={{ enabled: true }}
                        allowTouchMove={true}
                        onSlideChange={onSwiperSlideChange}
                        // Use initialSlideIndexRef for initialSlide to ensure it matches the actual season index
                        initialSlide={initialSlideIndexRef.current}
                        className="season-swiper-main"
                        onInit={(swiper) => {
                             // This is important: After Swiper initializes, move to the correct initial slide.
                             // This handles cases where data might not be fully ready on first render.
                             swiper.slideTo(initialSlideIndexRef.current, 0); // 0 duration for instant jump
                        }}
                    >
                        {seasons.map((seasonItem) => {
                            const seasonNumber = seasonItem.season_number;
                            const seasonContent = seasonEpisodesCache[seasonNumber]; // Get content from cache
                            const episodesForThisSeason = seasonContent?.data || [];
                            const isLoadingThisSeason = seasonContent?.loading || !seasonContent; // Also consider it loading if not in cache yet

                            return (
                                <SwiperSlide key={seasonNumber}>
                                    <div className="episodes-list-wrapper">
                                        {isLoadingThisSeason ? (
                                            <LoadingSkeleton /> 
                                        ) : episodesForThisSeason.length > 0 ? (
                                            <motion.div
                                                className="episodes-grid"
                                                variants={episodeCardVariants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                {episodesForThisSeason.map((episode) => {
                                                    const watchedEpisodes =
                                                        watchHistoryObj[id] && watchHistoryObj[id][seasonNumber]
                                                            ? watchHistoryObj[id][seasonNumber]
                                                            : [];
                                                    const lastClickedEpisode =
                                                        watchHistoryObj[id] && watchHistoryObj[id][seasonNumber] &&
                                                            watchedEpisodes.slice(-1)[0];

                                                    return (
                                                        <motion.div
                                                            className="episode-card-item"
                                                            key={episode.id}
                                                            variants={itemVariants}
                                                            onClick={() => handleEpisodeClick(episode)}
                                                        >
                                                            <div className="episode-card__image-container">
                                                                <img
                                                                    className="episode-card__image"
                                                                    src={
                                                                        episode.still_path
                                                                            ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                                                                            : GENERIC_EPISODE_PLACEHOLDER
                                                                    }
                                                                    alt={episode.name || `Episode ${episode.episode_number}`}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = GENERIC_EPISODE_PLACEHOLDER;
                                                                    }}
                                                                />
                                                                {watchedEpisodes.includes(episode.episode_number) && (
                                                                    <div
                                                                        className={`episodestatus ${
                                                                            lastClickedEpisode === episode.episode_number
                                                                                ? "continue-watching"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <i
                                                                            className={`bx ${
                                                                                lastClickedEpisode === episode.episode_number
                                                                                    ? "bx-play"
                                                                                    : "bx-check-double"
                                                                                }`}
                                                                            ></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="episode-card__info">
                                                                    <h3 className="episode-card__title">
                                                                        E{episode.episode_number} • {episode.name}
                                                                    </h3>
                                                                    <p className="episode-card__overview">
                                                                        {episode.overview || "No description available."}
                                                                    </p>
                                                                    <p className="episode-card__air-date">
                                                                        Aired on: {episode.air_date}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </motion.div>
                                            ) : (
                                                <p className="no-episodes-message">No episodes available for this season or no poster paths.</p>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div className="swiper-pagination-custom"></div>
                    </div>
                ) : (
                    // Initial loading state for the entire seasons component before any season data is even available
                    <div className="episodes-display-area">
                        <div className="episodes-list-wrapper">
                            <LoadingSkeleton count={6} />
                        </div>
                    </div>
                )}
            </div>
    );
};

export default Seasons;
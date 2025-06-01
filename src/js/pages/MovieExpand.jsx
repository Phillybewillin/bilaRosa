import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import Swiper modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from framer-motion

import './movie-expand.css';
import apiConfig from '../api/apiConfig';

// Icons (using Boxicons, ensure it's linked in your project, e.g., in index.html)
const PlayIcon = () => <i className="bx bx-play"></i>;
const DetailIcon = () => <i className="bx bx-info-square"></i>;

const MovieExpand = ({ category }) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const mediaType = category === 'tv' ? 'tv' : 'movie';
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/${mediaType}/day?api_key=${apiConfig.apiKey}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMovies(data.results.filter(item => item.backdrop_path || item.poster_path));
            } catch (error) {
                console.error("Failed to fetch trending items:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [category]);

    const handlePlayClick = (movieName, movieId) => {
        const mediaType = category === 'tv' ? 'tv' : 'movie';
        if (mediaType === 'tv') {
            navigate(`/watch/${movieName.replace(/\s+/g, '-').toLowerCase()}/${movieId}/1/1`);
        } else {
            navigate(`/watch/${movieName.replace(/\s+/g, '-').toLowerCase()}/${movieId}`);
        }
    };

    const handleDetailClick = (movieId) => {
        const mediaType = category === 'tv' ? 'tv' : 'movie';
        navigate(`/${mediaType}/${movieId}`);
    };

    if (isLoading) {
        return <p className="loading-message">Loading trending {category === 'tv' ? 'TV Shows' : 'Movies'}...</p>;
    }

    if (error) {
        return <p className="error-message">Error: {error.message}. Please try again later.</p>;
    }

    if (!movies || movies.length === 0) {
        return <p className="no-movies-message">No trending {category === 'tv' ? 'TV Shows' : 'Movies'} available right now.</p>;
    }

    // Framer Motion variants for slide content entrance (optional)
    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    // Framer Motion variants for button hover
    const buttonVariants = {
        hover: { scale: 1.1, color: 'white'},
        tap: { scale: 0.95 },
    };

    return (
        <div className="carousel-wrapper">
            <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'} // Use 'auto' to respect CSS width
                spaceBetween={20} // Space between slides
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper"
                loop={true}
                breakpoints={{
                    1024: {
                        slidesPerView: 'auto',
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 'auto',
                        spaceBetween: 15,
                    },
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                }}
                onSlideChange={(swiper) => {
                    swiper.slides.forEach((slideEl, index) => {
                        if (index === swiper.realIndex) {
                            slideEl.classList.add('active-slide-custom');
                        } else {
                            slideEl.classList.remove('active-slide-custom');
                        }
                    });
                }}
                onAfterInit={(swiper) => {
                    swiper.slides.forEach((slideEl, index) => {
                        if (index === swiper.realIndex) {
                            slideEl.classList.add('active-slide-custom');
                        } else {
                            slideEl.classList.remove('active-slide-custom');
                        }
                    });
                }}
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie.id}>
                        {/* Use motion.div for the slide content */}
                        <motion.div
                            className="swiper-slide-content"
                            // Initial and animate for entrance animation (optional, but good for first load)
                            initial="hidden"
                            animate="visible"
                            variants={slideVariants}
                            // Add a slight delay based on index for staggered effect (optional)
                            custom={index}
                            whileHover={{ scale: 1.01, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.8)" }} // Hover effect for the entire card
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <img
                                className="slide-image"
                                src={apiConfig.w1280Image(movie.backdrop_path || movie.poster_path)}
                                alt={movie.title || movie.name}
                            />
                            <div className="slide-overlay">
                                <h3 className="slide-title">{movie.title || movie.name}</h3>
                                <div className="slide-actions">
                                    {/* Use motion.button for action buttons */}
                                    <motion.button
                                        onClick={() => handlePlayClick(movie.title || movie.name, movie.id)}
                                        className="action-button play-button"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <PlayIcon />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleDetailClick(movie.id)}
                                        className="action-button detail-button"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <DetailIcon />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MovieExpand;

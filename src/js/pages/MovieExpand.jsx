import React, { useState , useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // core Swiper styles
// Optionally, import additional Swiper styles for Material Design look
// import 'swiper/css/material'; 

import './movie-expand.css';

const MovieImage = ({ imageUrl, movieName, rank }) => {
  const [expanded, setExpanded] = useState('');

  const handleImageClick = () => {
    setExpanded('expanded');
  };

  const handleImageHover = () => {
    setExpanded(true);
  };

  const handleImageLeave = () => {
    setExpanded(false);
  };

  return (
    <div className="movie-container">
      <img
        className={'movie-image'}
        src={imageUrl}
        alt={movieName}
        onClick={handleImageClick}
        onMouseEnter={handleImageHover}
        onMouseLeave={handleImageLeave}
      />
      {expanded && <div className="movie-overlay">{movieName}</div>}
    </div>
  );
};
const API_KEY = '31f273c5acc4188f2db532211d99f1db'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=';


const MovieExpand = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}${API_KEY}`);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="movie-list">
      <Swiper>
        <SwiperSlide>
          
        </SwiperSlide>
      </Swiper>
      {movies.map((movie) => (
        <MovieImage
          key={movie.id}
          imageUrl={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`} // Adjust image size as needed
          movieName={movie.title}
          rank={movie.vote_average} // Assuming rank is based on vote_average
        />
      ))}
    </div>
  );
};

export default MovieExpand;

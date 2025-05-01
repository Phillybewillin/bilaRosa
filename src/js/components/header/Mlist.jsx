import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import apiConfig from '../../api/apiConfig';
import './mlist.scss';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

const Mlist = ({ movies, value }) => {
  const [showMovies, setShowMovies] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
   const navigate = useNavigate();

  useEffect(() => {
    setShowMovies(true);
    setSelectedMovie(movies[0]);
  }, [movies]);

  

  const handleCardClick = (id, category, title, poster_path) => {
    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) continueWatching = [];

    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
      continueWatching.push({ id, category, title, poster_path });
      localStorage.setItem('ContinueWatching', JSON.stringify(continueWatching));
    }

    navigate(`/${category || 'tv'}/${id}`);
  };

  return (
    <>
      <div
        className="bzbaner"
        style={{
          backgroundImage: `url(${apiConfig.w200Image(selectedMovie?.poster_path)})`,
        }}
      ></div>

      {showMovies && (
        <div className="moviez">
          {movies.map((movie, index) => {
            const isValid = movie.title !== 'Conclave' && movie.name !== 'Conclave';
            const movieTitle = movie.title || movie.name;
            const imageSrc = movie.poster_path
              ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
              : '';

            return isValid ? (
              <motion.div
                key={movie.id}
                className="movieimg"
                onClick={() =>
                  handleCardClick(movie.id, movie.category || movie.media_type, movieTitle, movie.poster_path)
                }
                onMouseEnter={() => setSelectedMovie(movie)}
                onMouseLeave={() => setSelectedMovie(movie)}
                initial={{ opacity: 0, transform: 'translateY(10px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                transition={{ duration: 0.3, easing: 'ease-out' }}
              >
                <img className="moviezabs" src={imageSrc} alt={movieTitle} />
                <p className="movititlesearch">{movieTitle}</p>
              </motion.div>
            ) : null;
          })}
        </div>
      )}
    </>
  );
};

Mlist.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
      poster_path: PropTypes.string,
      id: PropTypes.number,
      media_type: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.string,
};

export default Mlist;

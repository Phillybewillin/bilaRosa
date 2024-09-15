import React from "react";
import apiConfig from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './mlist.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const Mlist = ({ movies , value }) => {
  const [showMovies, setShowMovies] = React.useState(true);
  

  const navigate = useNavigate();
  
  
  const handleClick = (type, id) => {
    navigate(`/${type}/${id}`);

    
  };
  
  const handleImageClick = () => {
    setShowMovies(false);
  };

 
  useEffect(() => {
    setShowMovies(true);
  }, [movies]);
 
  const handlecardClick = (id, category , title, poster_path) => {
    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) {
        continueWatching = [];
    }
    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
        continueWatching = [...continueWatching, {id,category, title, poster_path}];
        localStorage.setItem('ContinueWatching' , JSON.stringify(continueWatching));
        //console.log(continueWatching);
    }
    navigate(`/${category || 'tv'}/${id}`);
}

  return (
    <>
      {showMovies && (
        <>
        <div className="moviez" onClick={handleImageClick}>
          {movies && movies.map((movie, index) => (
            <div className="movieimg" key={index} onClick={() => handlecardClick(movie.id,movie.category || movie.media_type, movie.title || movie.name, movie.poster_path,)} >
              <img
                onClick={() => handleClick(movie.media_type, movie.id , movie.title || movie.name)}
                style={{ padding: "2px", height: "110px", width: "90px", objectFit: "cover", borderRadius: "10px" }}
                src={movie?.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : ""}
                 alt=""
              />
               <div className="dets">
               <p className="movietitlez">{movie.title || movie.name}</p>
              <p className="overviewseries">{movie.overview}</p>
              <div className="date"> <p className="ratingz">• {(new Date(movie.release_date || movie.first_air_date)).getFullYear()}</p><p className="type">{movie.media_type === 'tv' ? 'Show' : 'Movie'}</p> {movie.vote_average && <p className="ratingz">{movie.vote_average}</p>} 
              </div>
                
              </div>
            </div>
          ))}
        </div>
        <div className="search" onClick={handleImageClick}>
  <Link to={`/search/${value}`} state={{ movies , value }}>
    view all results
  </Link>
</div> </>
      )}
      
    </>
  );
};
Mlist.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
      // ... other expected properties ...
    })
  ),
};

export default Mlist;

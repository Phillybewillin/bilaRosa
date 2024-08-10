import React from "react";
import apiConfig from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Mlist = ({ movies }) => {
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
        <div className="moviez" onClick={handleImageClick} style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", flexDirection: "row", overflow: "auto", borderRadius: "10px" }}>
          {movies && movies.map((movie, index) => (
            <div className="movieimg" key={index} onClick={() => handlecardClick(movie.id,movie.category || movie.media_type, movie.title || movie.name, movie.poster_path,)} >
              <img
                onClick={() => handleClick(movie.media_type, movie.id , movie.title || movie.name)}
                style={{ padding: "6px", height: "180px", width: "120px", objectFit: "cover", borderRadius: "20px" }}
                src={movie?.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : ""}
                 alt=""
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Mlist;

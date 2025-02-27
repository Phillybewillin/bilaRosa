import React ,{ useState } from "react";
import apiConfig from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './mlist.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { useFirestore } from '../../Firestore';
import { toast } from "react-toastify";
//import { category } from "../../api/tmdbApi";
const Mlist = ({ movies , value }) => {
  const [showMovies, setShowMovies] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const {user} = UserAuth();
  const { addToWatchlist, checkIfInWatchlist} = useFirestore();
  const [ saved ,setSaved] = useState(false);
  //console.log(selectedMovie);
  const navigate = useNavigate();
  
  
  const handleClickza = (selectedMovie) => {
    //console.log('handlePlayer function called', selectedMovie.id, selectedMovie.media_type);
    const titlechange = selectedMovie.title || selectedMovie.name;
    const encodedTitle = encodeURIComponent(titlechange.replace(/ /g, '-').toLowerCase());
    //console.log(`Navigating to: /watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
   
    if (selectedMovie.media_type === 'tv') {
        navigate(`/watch/${encodedTitle}/${selectedMovie.id}/1/1`);
  
    } else {
      navigate(`/watch/${encodedTitle}/${selectedMovie.id}`);
     }
    

    
  };
  
  const handleImageClick = () => {
    setShowMovies(false);
  };

 
  useEffect(() => {
    setShowMovies(true);
    setSelectedMovie(movies[0]);
  }, [movies]);

  const saveShow = async (movies) => {
        if (!user) {
          toast.error('Access denied. Please logIn to add this to your Watchlist');
          return;
        }
    
        const data = {
          id: movies?.id,
          title: movies?.title || movies?.name,
          category: movies?.media_type,
          poster_path: movies?.poster_path,
          release_date: movies?.release_date || movies?.first_air_date,
          vote_average: movies?.vote_average,
          //overview: details?.overview,
        };
    
        const dataId = movies?.id?.toString();
        await addToWatchlist(user?.uid, dataId, data);
        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
        setSaved(isSetToWatchlist);
      };
    
      useEffect(() => {
        if (!user) {
          setSaved(false);
          return;
        }
    
        checkIfInWatchlist(user?.uid, movies?.id).then((data) => {
          setSaved(data);
          //console.log(saved)
        });
        
        
      }, [selectedMovie , user, checkIfInWatchlist ]);
 
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
    <div className="bzbaner" style={{
    backgroundImage: `url(${apiConfig.w200Image(selectedMovie.poster_path)})`,
  }}></div>
  
    <div className="containermodz">
          <div className="modalsearchcontent">
       
        <div className="detaizza" >
        <div className="background-image" style={{
    backgroundImage: `url(${apiConfig.w500Image(selectedMovie.poster_path)})`,
    
  }} />  
        <h2 className="movietitleza">{selectedMovie.title || selectedMovie.name}</h2>
        <p className="overviewseries">{selectedMovie.overview}</p>
        <div className="date">
                <p className="ratingz">
                  {selectedMovie.media_type === "tv" ? "Show" : "Movie"}
                </p>
                {selectedMovie.vote_average && (
                  <p className="ratingz">{selectedMovie.vote_average.toFixed(1)}</p>
                )}
                <p className="ratingz">
                  {(new Date(selectedMovie.release_date || selectedMovie.first_air_date))
                    .getFullYear()}
                </p>
                <p className="ratingz">
                 {selectedMovie.original_language.toUpperCase()}
                </p>
          </div>
           <div className="showwet">
             <div className="szz">
            {
                                        saved ? (
                                            <div className="languagezz" onClick={() => setSaved(false)}><i class='bx bxs-add-to-queue' style={{fontSize:'17px'}} ></i> Added To Watchlist</div>
                               
                                        ):(
                                            <div className="languagez" onClick={() => saveShow(selectedMovie)}><i class='bx bx-add-to-queue' style={{fontSize:'17px'}} ></i> Add To Watchlist</div>
                              
                                        )
               }
              </div> 
              
              <button className="shobuttn2" onClick={() => handlecardClick(selectedMovie.id,selectedMovie.category || selectedMovie.media_type, selectedMovie.title || selectedMovie.name, selectedMovie.poster_path,)}><i className='bx bx-info-circle'></i></button>
           
              <button className="shobuttn" onClick={() => handleClickza(selectedMovie)}>
              <i className='bx bx-play'></i> Watch
            </button>
                          
           </div>
          
        
        </div>
            
      </div>
    </div>
    
      {showMovies && (
        <>
        <div className="moviez" onClick={handleImageClick}>
          {movies && movies.map((movie, index) => (
            <div className="movieimg" key={index} onClick={() => handlecardClick(movie.id,movie.category || movie.media_type, movie.title || movie.name, movie.poster_path,)} >
              <img
                onMouseEnter={(e) => setSelectedMovie(movie) }
                onMouseLeave={(e) => setSelectedMovie(movie)}
                className="moviezabs"
                 src={movie?.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : ""}
                 alt={movie.title || movie.name}
              />
              <p className="movititlesearch">{movie.title || movie.name}</p>
              
            </div>
          ))}
        </div>
      </>
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

import React, { useEffect, useRef, useState , Suspense} from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';
import MovieList from '../components/movie-list/MovieList';
import { FixedSizeList } from 'react-window'; 
import { category, movieType, tvType } from '../api/tmdbApi';
import apiConfig from '../api/apiConfig';
import './home.scss';
import { toast, ToastContainer } from 'react-toastify';
import MovieCard from '../components/movie-card/MovieCard';
import BoxOffice from '../components/movie-list/BoxOffice';
import { UserAuth } from '../context/AuthContext';
import { useFirestore } from '../Firestore';
import '../pages/authpages/savedshows.scss'
import Button from '../components/button/Button';
const Home = () => {
  document.title = 'Home ~ Viva la Zilla';

  // Top of your component
const listRef = useRef(null);        // Anime list
const Movieref = useRef(null);       // Movie list
const historyRef = useRef(null);     // Continue Watching section
const watchlistRef = useRef(null);   // Watchlist section

  const { user } = UserAuth();
  
  const{ getWatchlist } = useFirestore();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [tv, setTv] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [continueWatching, setContinueWatching] = useState(
    JSON.parse(localStorage.getItem('ContinueWatching')) || []
  );
  const navigate = useNavigate();
 
  const continueWatchingRef = useRef(null);

  useEffect(() => {
    if(!user){
      setIsLoading(false)
    }
    if (user?.uid) {
      getWatchlist(user?.uid)
      .then((data) => {
        const shuffledData = [...data];
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
        }
        setWatchlist(shuffledData);
        //setWatchlist(data);
       // console.log(movies, "tv", tv, "watchlist", watchlist.all);
     
      })

        .catch((err) => {
          toast.error('fuck , something wrong happened ')
          //console.log(err, "error getting Favourites");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.uid, getWatchlist]);
 
  const getTVresults = async (timewindow) => {
    const url = `https://api.themoviedb.org/3/trending/tv/${timewindow}?api_key=${apiConfig.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setTv(data.results);
  };

  const getMovieresults = async (timewindow) => {
    const url = `https://api.themoviedb.org/3/trending/movie/${timewindow}?api_key=${apiConfig.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setMoviesData(data.results);
  };

  // const getAnimeResults = async () => {
  //   const url = `https://api.jikan.moe/v4/seasons/now?sfw&limit=20`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   setAnime(data.data);
  // };
 
  useEffect(() => {
    // Fetch TV results
    getTVresults('day');
   // getAnimeResults();
    // Fetch movie results
    getMovieresults('day');
    //hasMounted.current = true;
  }, []);
  

  const handleCardClick = (id, category, title, poster_path) => {
    let continueWatchingList = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatchingList)) {
      continueWatchingList = [];
    }
    const foundItem = continueWatchingList.find((item) => item.id === id);
    if (!foundItem) {
      continueWatchingList = [...continueWatchingList, { id, category, title, poster_path }];
      localStorage.setItem('ContinueWatching', JSON.stringify(continueWatchingList));
    }
    navigate(`/${category === 'tv' ? 'tv' : 'movie'}/${id}`);
  };

  const handleDelete2 = (id) => {
    const newContinueWatching = continueWatching.filter((item) => item.id !== id);
    localStorage.setItem('ContinueWatching', JSON.stringify(newContinueWatching));
    setContinueWatching(newContinueWatching);
  };

  const [history, setHistory] = useState([]);
 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("playerDataList");
    if (stored) {
      const items = Object.values(JSON.parse(stored));
      // Sort items by lastWatched descending (most recent first)
      items.sort((a, b) => b.lastWatched - a.lastWatched);
      setHistory(items);
    }
  }, []);

  // Opens the modal for the clicked history item.
  const openModal = (item, e) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // Delete the selected item from localStorage and update the history state.
  const handleDelete = () => {
    if (!selectedItem) return;
    const stored = localStorage.getItem("playerDataList");
    const playerDataList = stored ? JSON.parse(stored) : {};
    // Delete the entry by its id (assuming your keys are just the id)
    delete playerDataList[selectedItem.id];
    localStorage.setItem("playerDataList", JSON.stringify(playerDataList));
    // Update local state
    setHistory((prev) => prev.filter((item) => item.id !== selectedItem.id));
    closeModal();
    toast.success("Item deleted");
  };

  // Navigate to details: if item has a seasonNumber, then it's tv, else movie.
  const handleDetails = () => {
    if (!selectedItem) return;
    const category = selectedItem.seasonNumber ? "tv" : "movie";
    navigate(`/${category}/${selectedItem.id}`);
    closeModal();
  };

  // Calculate the progress percentage for an item.
  const getProgress = (item) => {
    if (item.runtime > 0) {
      return Math.min((item.timeSpent / item.runtime) * 100, 100);
    }
    return 0;
  };

  useEffect(() => {
    // Retrieve the stored player data from localStorage
    const stored = localStorage.getItem("playerDataList");
    if (stored) {
      // Convert the stored object to an array
      const items = Object.values(JSON.parse(stored));
      // Sort items by lastWatched descending (most recent first)
      items.sort((a, b) => b.lastWatched - a.lastWatched);
      setHistory(items);
    }
  }, []);

  const handleScrollLeft = (ref) => {

    ref.current?.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  
  };
  
  const handleScrollRight = (ref) => {
  
    ref.current?.scrollBy({
      left: 1000,
      behavior: "smooth",
    });
  
  
  };
  

  return (
    <>
      <Spotlight />

      
{history.length > 7 && (
      <div className="alignerbutts">
      <button className="left" onClick={() => handleScrollLeft(historyRef)}>
        <i className="bx bx-left-arrow-alt"></i>
      </button>
      <button className="right" onClick={() => handleScrollRight(historyRef)}>
        <i className="bx bx-right-arrow-alt"></i>
      </button>
    </div>
      )}
      <div className="player-history" ref={historyRef}>
      

      {history.length > 0 && (
        <div className="divconw">
          <h4 className="favaziwwr">Continue Watching</h4>
          <img className="backdrophome" src={apiConfig.w200Image(history[0]?.poster_path)} alt="" />
            <i className="bx bx-cheese" style={{fontSize : '30px' , position : 'absolute' , right : '10px', top : '10px'}}></i>
         
        </div>
      )}

      {history.map((item) => {
        const progress = getProgress(item);
        return (
          <div
            key={`${item.id}_${item.seasonNumber || ""}_${item.lastEpisode || ""}`}
            className="player-history-item"
            onClick={() => navigate(item.currentUrl)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {/* Poster Image */}
            <img
              src={apiConfig.w200Image(item.poster_path)}
              alt={item.title}
              className="player-history-item__poster"
            />
            <div className="player-history-item__info">
              <h4 className="player-history-item__title">{item.title}</h4>
              <div className="player-history-item__episode2">
                <span>{item.lastSrc}</span>
              </div>
              {/* Progress Bar */}
              <div
                style={{
                  background: "#ffffff4a",
                  width: "100%",
                  height: "2.5px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  marginTop: "0.1rem",
                }}
              >
                <div
                  style={{
                    background: "white",
                    width: `${progress}%`,
                    height: "100%",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
                 
                <div className="spacebtween">
                <div className="player-history-item__episode">
                    {item.seasonNumber ? "Show" : "Movie"}
              </div>
             
              {item.seasonNumber && (
                <div className="player-history-item__episode">
                 
                  <span className="player-history-item__episode-label">
                    SN {item.seasonNumber} • EP {item.lastEpisode}
                  </span>
                </div>
              )}
                </div>
             
            </div>
            {/* Action Icon Button to open the modal */}
            <button
              className="history-item-action-btn"
              onClick={(e) => openModal(item, e)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                color: "white",
                right: "10px",
              }}
            >
              <i className="bx bx-dots-horizontal-rounded"></i>
            </button>
          </div>
        );
      })}

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              //background: "#000000d1",
              padding: "1.5rem",
              borderRadius: "8px",
              minWidth: "300px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              className="modal-close-btn"
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "white",
                cursor: "pointer",
              }}
            >

              <i className='bx bx-x'></i>
             
            </button>
            <div className="modal-options" style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
              <div
                className="modal-option"
                onClick={handleDelete}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <i className="bx bx-trash" style={{ fontSize: "2rem", color: "red" }}></i>
                <div style={{ color: "red" , fontSize : '16px' }}>Delete</div>
              </div>
              <div
                className="modal-option"
                onClick={handleDetails}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <i className="bx bx-info-circle" style={{ fontSize: "2rem", color: "grey" }}></i>
                <div style={{ color: "grey" , fontSize : '16px' }}>Details</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="trendmovue" style={{position : 'relative' , minWidth : '200px'}}>
    {
          continueWatching.length > 7 && (
            <div className="alignerbutts" >
            <button className="left" style={{top : '-27px'}} onClick={() => handleScrollLeft(continueWatchingRef)}>
              <i className="bx bx-left-arrow-alt"></i>
            </button>
            <button className="right" style={{top : '-27px'}} onClick={() => handleScrollRight(continueWatchingRef)}>
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
            
          )
        }


    <div className="continue_watchingcontainer" ref={continueWatchingRef}>
        {
          continueWatching.length > 0 && (
            <div className="divconw">
            <h4 className="favaziwwr">Recently Viewed</h4>
          <img className="backdrophome" src={apiConfig.w200Image(continueWatching[continueWatching.length - 1]?.poster_path)} alt="" />
            <i className="bx bx-history" style={{fontSize : '30px' , position : 'absolute' , right : '10px', top : '10px'}}></i>
         
        </div>
            
          )
        }
      
        <div className="contin">
          {continueWatching.map((item) => (
            <div className="continuewatching" key={item.id}>
              <img
                className="movieimage"
                loading='lazy'
                src={`${apiConfig.w200Image(item.poster_path)}`}
                onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                alt={item.title}
              />
              <p className="movietitle"  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
               >{item.category==='tv' ? 'Show' : 'Movie'}</p>
              <i
                onClick={() => handleDelete2(item.id)}
                className="bx bx-trash"
                style={{
                  color: 'rgba(0, 0, 0, 0.9)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  bottom: '5px',
                  right: '1px'
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>

  
    </div>

      <div className="container">

      
         {/* Trending Movies Section */}
        <div className="section mb-3">
                <div className="section-tit">
            </div>
          <div className="trendMovie">
          <div className="spacegia">
          <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(Movieref)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '52px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(Movieref)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '52px'}}></i>
  </button>
</div>
<div className="divconws">
          <h4 className="favaziwwr">Trending Movies</h4>
          <img className="backdrophome" src={apiConfig.w200Image(moviesData[0]?.poster_path)} alt="" />
            <i className="bx bxs-hot" style={{fontSize : '32px' , position : 'absolute' , right : '1px', top : '1px'}}></i>
            <i className="bx bx-movie" style={{fontSize : '25px' , position : 'absolute' , right : '3px', bottom: '10px'}}></i>
        
        </div>
          
        </div> 
        
   
        <div className="movie-lists" ref={Movieref}>
                           
                                         {
                   moviesData.filter(itemzmovie => itemzmovie.poster_path).map((itemzmovie, ia) => (
                         <Suspense fallback={null}>
                          
                           <MovieCard item={itemzmovie} category={category.movie} key={itemzmovie.id}/>
                         
                          
                         </Suspense>
                            
                    ))
                  }
                  </div>
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div className="section mb-3">
                 <div className="section-tit">
            </div>
          <div className="trendMovie">
            <div className="spacegia">
            <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(listRef)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '52px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(listRef)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '52px'}}></i>
  </button>
</div>
<div className="divconws">
<h4 className="favaziwwr">Trending Shows</h4>
          <img className="backdrophome" src={apiConfig.w200Image(tv[0]?.poster_path)} alt="" />
            <i className="bx bx-water" style={{fontSize : '32px' , position : 'absolute' , right : '1px', top : '1px'}}></i>
            <i className="bx bx-tv" style={{fontSize : '25px' , position : 'absolute' , right : '3px', bottom : '1px'}}></i>
       
            </div>
   

          
        </div> 
            <div className="movie-lists" ref={listRef}>
                       
                                  {
            tv.filter(itemztv => itemztv.poster_path).map((itemztv, ia) => (
                  <Suspense fallback={null}>
                    
                    <MovieCard item={itemztv} category={category.tv} key={itemztv.id} />
                  
                 
                  </Suspense>
                     
             ))
           }
           </div>
          </div>
        </div>
      
        { user && isLoading && (
        <div className="load">loading</div>
      )}
      {user && !isLoading && watchlist?.length > 0 && (
            <>
                <div className="alignerbutts" style={{position : 'relative'}} >
  <button className="left" style={{top : '-27px'}}  onClick={() => handleScrollLeft(watchlistRef)}>
    <i className="bx bx-left-arrow-alt"></i>
  </button>
  <button className="right" style={{top : '-27px'}} onClick={() => handleScrollRight(watchlistRef)}>
    <i className="bx bx-right-arrow-alt"></i>
  </button>
</div><div className="watchlisthome" style={{color : 'white'}} ref={watchlistRef}>
          

        <div className="divconw">
          <h4 className="favaziwwr"> From My Watchlist</h4>
          <img className="backdrophome" src={apiConfig.w200Image(watchlist[0]?.poster_path)} alt="" />
          <i class='bx bx-library' style={{fontSize : '30px' , position : 'absolute' , right : '10px', top : '10px'}}></i>
         
        </div>
            {
           watchlist.map((item, i) => 
              <div  
               key={i}
               className="watchlistcardhome"  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
               >
                  
                  <div className="watchlistimgcontainer">
                  {
                      item ? (<img  className="watchlistimg" 
                      src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                      alt=""
                      
                      />) : (  <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular"  className="watchlistimg" />
                      </SkeletonTheme>
                      )
                    }
              </div>
              <div className="feature">
              
              <div className="featuretitlezi"> <h4 className="r">{item.title}</h4> </div>

                     
                 </div>
            
             </div>  
              
           )}
           </div>
            </>
           
      )}

        <BoxOffice />
        
      </div>
  </>
    );
}

export default Home;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';
import MovieList from '../components/movie-list/MovieList';
import { FixedSizeList } from 'react-window'; // Import FixedSizeList from react-window
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
  const { user } = UserAuth();
  
  const{ getWatchlist } = useFirestore();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [tv, setTv] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const navigate = useNavigate();
  const listRef = useRef(null);
  const Movieref = useRef(null);
 
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
  const hasMounted = useRef(false);
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

  useEffect(() => {
    // Fetch TV results
    getTVresults('day');
    
    // Fetch movie results
    getMovieresults('day');
    //hasMounted.current = true;
  }, []);
  

  const handleClick = (event, category, type) => {
    navigate(`/z/${category}?type=${type}`, { replace: true });
  };

  const [continueWatching, setContinueWatching] = useState(
    JSON.parse(localStorage.getItem('ContinueWatching')) || []
  );

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

  const handleDelete = (id) => {
    const newContinueWatching = continueWatching.filter((item) => item.id !== id);
    localStorage.setItem('ContinueWatching', JSON.stringify(newContinueWatching));
    setContinueWatching(newContinueWatching);
  };

  
  const divId = 'message';

  const [isVisible, setIsVisible] = useState(() => {
    // Check if the user has already viewed the div
    const viewedDivs = JSON.parse(localStorage.getItem('message') || '[]');
    return !viewedDivs.includes(divId);
  });
  
  useEffect(() => {
    // Update local storage when isVisible changes
    if (!isVisible) {
      const viewedDivs = JSON.parse(localStorage.getItem('message') || '[]');
      viewedDivs.push(divId);
      localStorage.setItem('message', JSON.stringify(viewedDivs));
    }
  }, [isVisible, divId]);
  // Common function to render a list of movies or TV shows
  const renderList = (items, category) => ({ index, style }) => {
    const item = items[index];
    return (
      <div
        style={style}
        key={item.id}
        className="wrappwezadd"
        //onClick={() => navigate(`/${category}/${item.id}`)}
      >
        <MovieCard key={item.id} item={item} category={category} />
      </div>
    );
  };
  const smoothScroll = (targetOffset) => {
    const startOffset = listRef.current.state.scrollOffset || Movieref.current.state.scrollOffset;
    const distance = targetOffset - startOffset;
    const duration = 500; // Duration in milliseconds
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Progress: 0 to 1

      const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease function
      const scrollOffset = startOffset + distance * easeInOutQuad(progress);

      listRef.current.scrollTo(scrollOffset) || Movieref.current.scrollTo(scrollOffset);    

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleScrollLeft = () => {
    const currentOffset = listRef.current.state.scrollOffset || Movieref.current.state.scrollOffset;
    smoothScroll(currentOffset - 700); // Adjust the scroll distance as needed
  };

  const handleScrollRight = () => {
    const currentOffset = listRef.current.state.scrollOffset || Movieref.current.state.scrollOffset;
    smoothScroll(currentOffset + 1000); // Adjust the scroll distance as needed
  };
  const handleClose = () => {
    setIsVisible(false);
    const viewedDivs = JSON.parse(localStorage.getItem('message') || '[]');
    const newViewedDivs = [...viewedDivs, divId];
    localStorage.setItem('message', JSON.stringify(newViewedDivs));
  };

  return (
    <>
      <Spotlight />


<div className="continue_watchingcontainer">
        {
          continueWatching.length > 0 && (
            <div className="divcon">
                <h4 className="favazi">Recently Viewed</h4>
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
               >{item.title || item.name}</p>
              <i
                onClick={() => handleDelete(item.id)}
                className="bx bxs-trash"
                style={{
                  color: 'rgba(255, 245, 245, 0.354)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  bottom: '7px',
                  right: '1px'
                  
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>
      
      { user && isLoading && (
        <div className="load">loading</div>
      )}
      {user && !isLoading && watchlist?.length > 0 && (
        
           <div className="watchlisthome" style={{color : 'white'}}>
            <div className="favew"><h3 className="fava">From Your Watchlist</h3></div>
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
      )}

      <div className="container">
      
     
      

        {/* Trending Movies Section */}
        <div className="section mb-3">
          <div className="section-tit">
            <div className='villa'> <div className="spo">~</div> TRENDING MOVIES <h6 className="catx">#Today's Trending Movies</h6></div>
            <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.popular)}>view all--+</h5>
          </div>
          <div className="trendMovie">
          <div className="alignerbutts">
       <button  className="left" onClick={handleScrollLeft}><i className='bx bxs-left-arrow'></i></button>
      <button className="right" onClick={handleScrollRight}><i className='bx bxs-right-arrow'></i></button>
        </div>
            {/* Replacing Swiper with FixedSizeList */}
            <FixedSizeList
              ref={Movieref}
              className="movie-list"
              margin={10}
              height={310} // Adjust height as needed
              width={window.innerWidth - 20} // Adjust width dynamically
              itemSize={210} // Width of each item
              layout="horizontal"
              itemCount={moviesData.length}
            >
              {renderList(moviesData, category.movie)}
            </FixedSizeList>
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div className="section mb-3">
          <div className="section-tit">
            <div  className='villa'> <div className="spo">~</div> TRENDING TV SHOWS<h6 className="catx"> #Today's Trending TV shows</h6></div>
            <h5 className="bluez" onClick={(event) => handleClick(event, category.tv, tvType.popular)}>view all--+</h5>
          </div>
          <div className="trendMovie">
          <div className="alignerbutts">
       <button  className="left" onClick={handleScrollLeft}><i className='bx bxs-left-arrow'></i></button>
      <button className="right" onClick={handleScrollRight}><i className='bx bxs-right-arrow'></i></button>
        </div>
            {/* Replacing Swiper with FixedSizeList */}
            <FixedSizeList
              ref={listRef}
              className="movie-list"
              height={320} // Adjust height as needed
              width={window.innerWidth - 20} // Adjust width dynamically
              itemSize={210} // Width of each item
              layout="horizontal"
              itemCount={tv.length}
            >
              {renderList(tv, category.tv)}
            </FixedSizeList>
          </div>
        </div>

        <BoxOffice />
        
      </div>
      <ToastContainer theme="dark" position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#1eff00', color: 'white', borderRadius: '10px' }} />
     </>
    );
}

export default Home;

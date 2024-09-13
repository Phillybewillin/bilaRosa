import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';
import MovieList from '../components/movie-list/MovieList';
import { FixedSizeList } from 'react-window'; // Import FixedSizeList from react-window
import { category, movieType, tvType } from '../api/tmdbApi';
import apiConfig from '../api/apiConfig';
import './home.scss';
import { ToastContainer } from 'react-toastify';
import MovieCard from '../components/movie-card/MovieCard';


const Home = () => {
  document.title = 'Home - ZillaXR';

  const [tv, setTv] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const navigate = useNavigate();
  const listRef = useRef(null);
  const Movieref = useRef(null);
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

  const clearContinueWatching = () => {
    localStorage.removeItem('ContinueWatching');
    setContinueWatching([]);
  };

  // Common function to render a list of movies or TV shows
  const renderList = (items, category) => ({ index, style }) => {
    const item = items[index];
    return (
      <div
        style={style}
        key={item.id}
        className="wrappwe"
        onClick={() => navigate(`/${category}/${item.id}`)}
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
    smoothScroll(currentOffset - 200); // Adjust the scroll distance as needed
  };

  const handleScrollRight = () => {
    const currentOffset = listRef.current.state.scrollOffset || Movieref.current.state.scrollOffset;
    smoothScroll(currentOffset + 200); // Adjust the scroll distance as needed
  };

  return (
    <>
      <Spotlight />
      <h4 className="continue-watching-title">Recently Viewed</h4>
      <div className="continue_watchingcontainer">
        <i
          className='bx bxs-brush-alt'
          onClick={clearContinueWatching}
          style={{ color: 'red', paddingLeft: '2px', cursor: 'pointer' }}
        ></i>
        <div className="contin">
          {continueWatching.map((item) => (
            <div className="continuewatching" key={item.id}>
              <img
                loading='lazy'
                src={`${apiConfig.w200Image(item.poster_path)}`}
                onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                alt={item.title}
              />
              <p className="movietitle"  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
               >{item.title || item.name}</p>
              <i
                onClick={() => handleDelete(item.id)}
                className="bx bx-trash"
                style={{
                  color: 'red',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '5px',
                  right: '3px'
    
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Trending Movies Section */}
        <div className="section mb-3">
          <div className="section-tit">
            <p className='villa'>• TRENDING MOVIES <h6 className="catx">#Today's Trending Movies</h6></p>
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
              height={430} // Adjust height as needed
              width={window.innerWidth - 20} // Adjust width dynamically
              itemSize={250} // Width of each item
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
            <h3 className='villa'>• TRENDING TV SHOWS<h6 className="catx"> #Today's Trending TV shows</h6></h3>
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
              height={420} // Adjust height as needed
              width={window.innerWidth - 20} // Adjust width dynamically
              itemSize={250} // Width of each item
              layout="horizontal"
              itemCount={tv.length}
            >
              {renderList(tv, category.tv)}
            </FixedSizeList>
          </div>
        </div>

        {/* Additional Movie Sections */}
        <div className="section mb-3">
          <div className="section-tit">
            <h3 className='villa'>• POPULAR MOVIES <h6 className="catx"># Most Popular movies this year</h6></h3>
            <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.upcoming)}>view all--+</h5>
          </div>
          <MovieList category={category.movie} type={movieType.popular} />
        </div>

        {/* More Sections */}
        <div className="section mb-3">
          <div className="section-tit">
            <h3 className='villa'>• TOP RATED MOVIES <h6 className="catx">• Fan Favourites Movies</h6></h3>
            <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.top_rated)}>view all--+</h5>
          </div>
          <MovieList category={category.movie} type={movieType.top_rated} />
        </div>

        <div className="section mb-3">
          <div className="section-tit">
            <h3 className='villa'>• TOP RATED TV SHOWS <h6 className="catx">• Fan Favourites Shows</h6></h3>
            <h5 className="bluez" onClick={(event) => handleClick(event, category.tv, tvType.top_rated)}>view all--+</h5>
          </div>
          <MovieList category={category.tv} type={tvType.top_rated} />
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer theme="dark" position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#1eff00', color: 'white', borderRadius: '10px' }} />
     </>
    );
}

export default Home;

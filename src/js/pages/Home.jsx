import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';
import MovieList from '../components/movie-list/MovieList';
import { FixedSizeList } from 'react-window'; // Import FixedSizeList from react-window
import { category, movieType, tvType } from '../api/tmdbApi';
import tmdbApi from '../api/tmdbApi';
import apiConfig from '../api/apiConfig';
import './home.scss';
import { toast, ToastContainer } from 'react-toastify';
import MovieCard from '../components/movie-card/MovieCard'; // Assuming MovieCard is a functional component
import BoxOffice from '../components/movie-list/BoxOffice';
import { UserAuth } from '../context/AuthContext';
import { useFirestore } from '../Firestore';
import '../pages/authpages/savedshows.scss';
import { Link } from 'react-router-dom';
import Button from '../components/button/Button';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import Footer from '../components/footer/Footer';

const Home = () => {
  document.title = 'Home ~ Viva la Zilla';

  // Top of your component
  const listRef = useRef(null); // Anime list
  const Movieref = useRef(null); // Movie list
  // Continue Watching section
  const watchlistRef = useRef(null); // Watchlist section
  const Edref = useRef(null);
  const mEdref = useRef(null);
  const { user } = UserAuth();

  const { getWatchlist } = useFirestore();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [tv, setTv] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [continueWatching, setContinueWatching] = useState(
    JSON.parse(localStorage.getItem('ContinueWatching')) || []
  );
  const [editorsPicks, setEditorsPicks] = useState([]);
  const [popula, setPopula] = useState([]);
  const navigate = useNavigate();

  const continueWatchingRef = useRef(null);
  const [recommendations, setRecommendations] = useState([]);
  const recentScrollRef = useRef(null);
  const historyRef = useRef(null);
  const [history, setHistory] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const stored = localStorage.getItem('playerDataList');
      if (!stored) return;

      try {
        const parsed = Object.values(JSON.parse(stored))
          .filter(item => item?.id && item?.lastWatched)
          .sort((a, b) => b.lastWatched - a.lastWatched);

        if (!parsed.length) return;

        const recentItems = parsed.slice(0, 2);
        const allRecs = [];

        for (const item of recentItems) {
          const { id, seasonNumber, lastEpisode } = item;
          if (!id) continue;

          const type = seasonNumber && lastEpisode ? 'tv' : 'movie';

          try {
            const res = await tmdbApi.similar(type, id);
            if (Array.isArray(res.results)) {
              allRecs.push(...res.results);
            }
          } catch (err) {
            console.error(`Failed to fetch similar for ID ${id}`, err);
          }
        }

        if (!allRecs.length) return;

        const shuffled = allRecs.sort(() => Math.random() - 0.5);
        setRecommendations(shuffled);
      } catch (err) {
        console.error('Error processing localStorage for WatchNext:', err);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
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
          toast.error('fuck , something wrong happened ');
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

  const getEditorsPicks = async () => {
    const similae = await tmdbApi.similar('tv', '60574');
    const shuffleded = similae.results.sort(() => Math.random() - 0.5);

    setEditorsPicks(shuffleded);
    //console.log(poplar);
  };
  const getEditorsPickas = async () => {
    const params = {};
    const poplar = await tmdbApi.getMoviesList(movieType.popular, { params });
    const shuffledResults = poplar.results.sort(() => Math.random() - 0.5);

    setPopula(shuffledResults);
    //console.log(poplar);
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
    getEditorsPicks();
    getEditorsPickas();
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

  useEffect(() => {
    const stored = localStorage.getItem('playerDataList');
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
    const stored = localStorage.getItem('playerDataList');
    const playerDataList = stored ? JSON.parse(stored) : {};
    // Delete the entry by its id (assuming your keys are just the id)
    delete playerDataList[selectedItem.id];
    localStorage.setItem('playerDataList', JSON.stringify(playerDataList));
    // Update local state
    setHistory((prev) => prev.filter((item) => item.id !== selectedItem.id));
    closeModal();
    toast.success('Item deleted');
  };

  // Navigate to details: if item has a seasonNumber, then it's tv, else movie.
  const handleDetails = () => {
    if (!selectedItem) return;
    const category = selectedItem.seasonNumber ? 'tv' : 'movie';
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
    const stored = localStorage.getItem('playerDataList');
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
      behavior: 'smooth',
    });
  };

  const handleScrollRight = (ref) => {
    ref.current?.scrollBy({
      left: 1000,
      behavior: 'smooth',
    });
  };

  // Framer Motion variants for staggered animation of movie cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child's animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <Spotlight />

       <motion.div className="movie-nav"  variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="movie-nav-item" variants={itemVariants}>
          <Link to="/z/movie">
           <h3>Movies</h3>
          </Link>
        </motion.div>
        <motion.div className="movie-nav-item" variants={itemVariants}>
          <Link to="/z/tv">
           <h3>TV Shows</h3>
          </Link>
        </motion.div>
      </motion.div>
   
      <div className="conconwa">
        {history.length > 0 && (
          <div className="spacegia">
            {history.length > 6 && (
              <div className="alignerbutts">
                <button className="leftgia" onClick={() => handleScrollLeft(historyRef)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '25px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(historyRef)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '25px' }}></i>
                </button>
              </div>
            )}
            <div className="divconw">
              <h4 className="favaziwwr">Continue Watching</h4>
              <i className="bx bx-cheese" style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px' }}></i>
            </div>
          </div>
        )}

        <motion.div className="player-history" ref={historyRef} variants={containerVariants} initial="hidden" animate="visible">
          {history.map((item) => {
            const progress = getProgress(item);
            return (
              <motion.div
                key={`${item.id}_${item.seasonNumber || ''}_${item.lastEpisode || ''}`}
                className="player-history-item"
                onClick={() => navigate(item.currentUrl)}
                style={{ cursor: 'pointer', position: 'relative' }}
                variants={itemVariants}
                whileHover={{ scale: 1 }} // Scale up on hover
                whileTap={{ scale: 0.95 }} // Scale down on tap
              >
                {/* Poster Image */}
                <img
                  src={apiConfig.w500Image(item.poster_path)}
                  alt={item.title}
                  className="player-history-item__poster"
                />
                <div className="player-history-item__info">
                  <div className="spacebtween">
                    <div className="player-history-item__title">{item.title}</div>

                    {item.seasonNumber && (
                      <div className="player-history-item__episode">
                        <span className="player-history-item__episode-label">
                          S{item.seasonNumber} • E{item.lastEpisode}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div
                    style={{
                      background: '#ffffff1a',
                      width: '100%',
                      height: '2.3px',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      //margin: "0rem .5rem",
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(to right,rgb(126, 126, 126),rgb(237, 237, 237))',
                        width: `${progress}%`,
                        height: '100%',
                        borderRadius: '5px',
                      }}
                    ></div>
                  </div>
                </div>
                {/* Action Icon Button to open the modal */}
                <button
                  className="history-item-action-btn"
                  onClick={(e) => openModal(item, e)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '5px',
                    color: 'white',
                    right: '5px',
                  }}
                >
                  <i className="bx bx-dots-horizontal-rounded"></i>
                </button>
              </motion.div>
            );
          })}

          {/* Modal */}
          <AnimatePresence>
            {modalOpen && selectedItem && (
              <motion.div
                className="modal-overlay"
                onClick={closeModal}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.79)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                }}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="modal-contentw"
                  onClick={(e) => e.stopPropagation()}
                 
                >
                  <button
                    className="modal-close-btn"
                    onClick={closeModal}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '1rem',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bx bx-x"></i>
                  </button>
                  <div
                    className="modal-options"
                    style={{ display: 'flex', justifyContent: 'space-around', margin: '.5rem' }}
                  >
                    <div
                      className="modal-option"
                      onClick={handleDelete}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                      <i className="bx bx-trash" style={{ fontSize: '1.5rem', color: 'red' }}></i>
                      <div style={{ color: 'red', fontSize: '13px' }}>Remove</div>
                    </div>
                    <div
                      className="modal-option"
                      onClick={handleDetails}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                      <i className="bx bx-info-square" style={{ fontSize: '1.5rem', color: 'grey' }}></i>
                      <div style={{ color: 'grey', fontSize: '13px' }}>Details</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {recommendations.length > 0 && (
        <div className="section mb-3">
          <div className="section-tit"></div>
          <div className="trendMovie">
            <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(recentScrollRef)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(recentScrollRef)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>

              <div className="divconws">
                <h4 className="favaziwwr">You may also like</h4>
                <img
                  className="backdrophome"
                  src={apiConfig.w200Image(recommendations[0]?.poster_path)}
                  alt=""
                />
                <i
                  className="bx bx-pulse"
                  style={{
                    fontSize: '22px',
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    opacity: '0.6',
                  }}
                />
              </div>
            </div>

            <motion.div className="movie-lists" ref={recentScrollRef} variants={containerVariants} initial="hidden" animate="visible">
              {recommendations
                .filter((show) => show.poster_path)
                .map((show) => (
                  <Suspense fallback={null} key={show.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1 , zIndex: 100}}>
                      <MovieCard item={show} category={show.media_type} />
                    </motion.div>
                  </Suspense>
                ))}
            </motion.div>
          </div>
        </div>
      )}

      <div className="trendmovue" style={{ position: 'relative', minWidth: '200px' }}>
        {continueWatching.length > 0 && (
          <div className="spacegia">
            {continueWatching.length > 20 && (
              <div className="alignerbutts">
                <button className="leftgia" style={{ top: '-27px' }} onClick={() => handleScrollLeft(continueWatchingRef)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" style={{ top: '-27px' }} onClick={() => handleScrollRight(continueWatchingRef)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
            )}
            <div className="divconw">
              <h4 className="favaziwwr">Recently Viewed</h4>
              <i
                className="bx bx-history"
                style={{ fontSize: '23px', position: 'absolute', right: '10px', top: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              ></i>
            </div>
          </div>
        )}

        <motion.div className="continue_watchingcontainer" ref={continueWatchingRef} variants={containerVariants} initial="hidden" animate="visible">
          <div className="contin">
            {continueWatching.map((item) => (
              <motion.div className="continuewatching" key={item.id} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <img
                  className="movieimage"
                  loading="lazy"
                  src={`${apiConfig.w200Image(item.poster_path)}`}
                  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                  alt={item.title}
                />
                <p
                  className="movietitle"
                  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                >
                  {item.category === 'tv' ? 'Show' : 'Movie'}
                </p>
                <i
                  onClick={() => handleDelete2(item.id)}
                  className="bx bx-trash"
                  style={{
                    color: 'rgba(0, 0, 0, 0.9)',
                    fontSize: '20px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '5px',
                    right: '1px',
                  }}
                ></i>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="container">
        {/* Trending Movies Section */}
        <div className="section mb-3">
          <div className="section-tit"></div>
          <div className="trendMovie">
            <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(Movieref)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(Movieref)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
              <div className="divconws">
                <h4 className="favaziwwr">Trending Movies</h4>
                <img className="backdrophome" src={apiConfig.w200Image(moviesData[0]?.poster_path)} alt="" />
                <i
                  className="bx bx-meteor"
                  style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px', opacity: '0.6' }}
                ></i>
              </div>
            </div>

            <motion.div className="movie-lists" ref={Movieref} variants={containerVariants} initial="hidden" animate="visible">
              {moviesData
                .filter((itemzmovie) => itemzmovie.poster_path)
                .map((itemzmovie, ia) => (
                  <Suspense fallback={null} key={itemzmovie.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1 , zIndex: 100}}>
                      <MovieCard item={itemzmovie} category={category.movie} />
                    </motion.div>
                  </Suspense>
                ))}
            </motion.div>
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div className="section mb-3">
          <div className="section-tit"></div>
          <div className="trendMovie">
            <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(listRef)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(listRef)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
              <div className="divconws">
                <h4 className="favaziwwr">Trending Shows</h4>
                <img className="backdrophome" src={apiConfig.w200Image(tv[0]?.poster_path)} alt="" />
                <i
                  className="bx bxs-bowling-ball"
                  style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px', opacity: '0.6' }}
                ></i>
              </div>
            </div>
            <motion.div className="movie-lists" ref={listRef} variants={containerVariants} initial="hidden" animate="visible">
              {tv
                .filter((itemztv) => itemztv.poster_path)
                .map((itemztv, ia) => (
                  <Suspense fallback={null} key={itemztv.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1 , zIndex: 100}}>
                      <MovieCard item={itemztv} category={category.tv} />
                    </motion.div>
                  </Suspense>
                ))}
            </motion.div>
          </div>
        </div>

        <div className="section mb-3">
          <div className="section-tit"></div>
          <div className="trendMovie">
            <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(Edref)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(Edref)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
              <div className="divconws">
                <h4 className="favaziwwr">Editors Picks </h4>
                <img className="backdrophome" src={apiConfig.w200Image(editorsPicks[0]?.poster_path)} alt="" />
                <i
                  className="bx bxs-cat"
                  style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px', opacity: '0.6' }}
                ></i>
              </div>
            </div>

            <motion.div className="movie-lists" ref={Edref} variants={containerVariants} initial="hidden" animate="visible">
              {editorsPicks
                .filter((itemzmovied) => itemzmovied.poster_path)
                .map((itemzmovied, ia) => (
                  <Suspense fallback={null} key={itemzmovied.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1 , zIndex: 100}}>
                      <MovieCard item={itemzmovied} category={category.tv} />
                    </motion.div>
                  </Suspense>
                ))}
            </motion.div>
          </div>
        </div>
        <BoxOffice />
        <div className="section mb-3">
          <div className="section-tit"></div>
          <div className="trendMovie">
            <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(mEdref)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(mEdref)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
              <div className="divconws">
                <h4 className="favaziwwr">Popular Movies</h4>
                <img className="backdrophome" src={apiConfig.w200Image(popula[0]?.poster_path)} alt="" />
                <i
                  className="bx bx-heart"
                  style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px', opacity: '0.6' }}
                ></i>
              </div>
            </div>

            <motion.div className="movie-lists" ref={mEdref} variants={containerVariants} initial="hidden" animate="visible">
              {popula
                .filter((itemzmovied) => itemzmovied.poster_path)
                .map((itemzmovied, ia) => (
                  <Suspense fallback={null} key={itemzmovied.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1 , zIndex: 100}}>
                      <MovieCard item={itemzmovied} category={category.movie} />
                    </motion.div>
                  </Suspense>
                ))}
            </motion.div>
          </div>
        </div>
        {user && isLoading && <div className="load">loading</div>}
        {user && !isLoading && watchlist?.length > 0 && (
          <>
           <div className="spacegia">
              <div className="alignerbig">
                <button className="leftgia" onClick={() => handleScrollLeft(watchlistRef)}>
                  <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
                <button className="rightgia" onClick={() => handleScrollRight(watchlistRef)}>
                  <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
              <div className="divconws">
                <h4 className="favaziwwr">From My Watchlist</h4>
                <img className="backdrophome" src={apiConfig.w200Image(watchlist[0]?.poster_path)} alt="" />
                <i
                  className="bx bx-heart"
                  style={{ fontSize: '22px', position: 'absolute', right: '10px', top: '10px', opacity: '0.6' }}
                ></i>
              </div>
            </div>

            <div className="watchlisthome" style={{ color: 'white' ,padding : ' 10px 50px'}} ref={watchlistRef}>
            
              {watchlist.map((item, i) => (
                <motion.div
                  key={i}
                  className="watchlistcardhome"
                  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: i * 0.05 }} // Staggered animation for watchlist items
                >
                  <div className="watchlistimgcontainer">
                    {item ? (
                      <img
                        className="watchlistimg"
                        src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                        alt=""
                      />
                    ) : (
                      <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular" className="watchlistimg" />
                      </SkeletonTheme>
                    )}
                  </div>
                  <div className="feature">
                    <div className="featuretitlezi">
                      <h4 className="r">{item.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        

        <Footer />
      </div>
    </>
  );
};

export default Home;

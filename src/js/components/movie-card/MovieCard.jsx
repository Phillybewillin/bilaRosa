// MovieCard.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './movie-card.scss';
import PropTypes from 'prop-types';
import apiConfig from '../../api/apiConfig';
import { UserAuth } from '../../context/AuthContext';
import tmdbApi from '../../api/tmdbApi';
import { useFirestore } from '../../Firestore';
import { toast } from 'react-toastify';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const MovieCard = React.memo(({ item = {}, category }) => {
  const { user } = UserAuth();
  const { addToWatchlist, checkIfInWatchlist } = useFirestore();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const modalRef = useRef(null);

  // Framer Motion MotionValue for mobile drag
  const y = useMotionValue(0); // Tracks current drag Y offset
  // Simpler transforms for mobile drag to avoid heavy animation
  const scaleY = useTransform(y, [0, window.innerHeight * 0.4], [1, 0.95]);
  const opacity = useTransform(y, [0, window.innerHeight * 0.4], [1, 0.5]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [bg, setBg] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [videos, setVideos] = useState([]);
  const [choice, setChoice] = useState(false);

  // Viewport resize logic
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preload poster (IntersectionObserver)
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !item.poster_path) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => {
            setBg(apiConfig.w500Image(item.poster_path));
            setIsLoading(false);
          };
          img.src = apiConfig.w500Image(item.poster_path);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [item.poster_path]);

  // Watchlist check
  useEffect(() => {
    if (!user) return setIsInWatchlist(false);
    checkIfInWatchlist(user.uid, item.id).then(setIsInWatchlist);
  }, [user, item, checkIfInWatchlist]);

  // Handle modal close
  const triggerClose = useCallback(() => {
    setShowModal(false);
    setChoice(false);
    setVideos(null);
    y.set(0); // Reset mobile drag Y position on close
  }, [y]);

  const getVideos = async () => {
    try {
      const res = await tmdbApi.getVideos(category, item.id);
      const trailer = res.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        setVideos(trailer.key);
        setChoice(true);
      } else {
        toast.error('No trailer found');
        setVideos(null);
        setChoice(false);
      }
    } catch (err) {
      console.error('Failed to fetch trailer:', err);
      setVideos(null);
      setChoice(false);
    }
  };

  const cancelwatchTrailer = useCallback((e) => {
    e.stopPropagation();
    setChoice(false);
    setVideos(null);
  }, []);

  // Browser history management for mobile modal (back button/swipe)
  const pushedModalState = useRef(false);
  const skipBack = useRef(false);

  useEffect(() => {
    if (!showModal) return;

    const onKey = e => {
      if (e.key === 'Escape') triggerClose();
    };

    const onPopState = () => {
      if (isMobile && showModal) {
        triggerClose();
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPopState);

    if (isMobile) {
      if (!pushedModalState.current && history.state?.modalOpen !== true) {
        history.pushState({ modalOpen: true }, '');
        pushedModalState.current = true;
      }
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPopState);

      if (isMobile && pushedModalState.current && !skipBack.current && history.state?.modalOpen) {
        history.back();
      }
      pushedModalState.current = false;
      skipBack.current = false;
    };
  }, [showModal, isMobile, triggerClose]);

  // Lock scroll on mobile when modal is open
  useEffect(() => {
    if (showModal && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [showModal, isMobile]);

  // Mobile swipe-down to close
  const onMobileDragStart = useCallback(() => {
    y.set(0); // Reset Y to 0 at the start of drag
  }, [y]);

  const onMobileDrag = useCallback((event, info) => {
    if (info.offset.y > 0) {
      y.set(info.offset.y); // Update motion value for visual feedback
    } else {
      y.set(0); // Prevent dragging upwards past initial point
    }
  }, [y]);

  const onMobileDragEnd = useCallback((event, info) => {
    const deltaY = info.offset.y;
    // Immediately close if drag is past threshold
    if (deltaY > 100) { // Adjust threshold as needed
      triggerClose();
    } else {
      // Snap back to initial position if not past threshold
      y.set(0);
    }
  }, [triggerClose, y]);


  // Save to watchlist (unchanged)
  const saveShow = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save a movie');
      return;
    }
    await addToWatchlist(user.uid, item.id.toString(), {
      id: item.id,
      title: item.title || item.name,
      category,
      poster_path: item.poster_path,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
    });
    const inList = await checkIfInWatchlist(user.uid, item.id);
    setIsInWatchlist(inList);
  };

  // Navigate to details page (unchanged)
  const goToDetails = (id, category, title, poster_path) => {
    skipBack.current = true;
    setShowModal(false);

    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) {
      continueWatching = [];
    }
    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
      continueWatching = [...continueWatching, { id, category, title, poster_path }];
      localStorage.setItem('ContinueWatching', JSON.stringify(continueWatching));
    }
    navigate(`/${category}/${id}`);
  };

  // Cinema status (unchanged)
  const inCinema = (releaseDate) => {
    const today = new Date();
    const fourWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (4 * 7));
    if (category === 'movie') {
      if (releaseDate < today) {
        return releaseDate > fourWeeksAgo ? 'In Cinema' : '';
      }
      else {
        return 'Coming Soon';
      }
    }
    return '';
  };
  const cinemaStatus = inCinema(new Date(item.release_date || item.first_air_date));

  // Handle card click (mobile opens modal, PC navigates)
  const onCardClick = () => {
    if (isMobile) {
       y.set(0);
      setShowModal(true);
      // Ensure y is reset when opening a new modal for mobile
     
    } else {
      goToDetails(item.id, category, item.title || item.name, item.poster_path);
    }
  };

  // Handle player navigation (unchanged)
  const handlePlayer = (id, name, type) => {
    if (!id || !name) return;
    skipBack.current = true;
    setShowModal(false);
    const detailslug = encodeURIComponent(name.trim().replace(/ /g, "-").toLowerCase());
    const path = `/watch/${detailslug}/${id}${type === 'tv' ? '/1/1' : ''}`;
    navigate(path);
  };

  // Timers for desktop hover
  const showTimerRef = useRef(null);

  // Desktop hover logic
  const handleMouseEnter = useCallback(() => {
    if (!containerRef.current || isMobile) return;

    clearTimeout(showTimerRef.current);
    showTimerRef.current = setTimeout(() => {
      setShowModal(true);
    }, 150);
  }, [isMobile]);

  const handleMouseLeave = useCallback((e) => {
    if (isMobile) return;

    if (choice) {
      return;
    }

    clearTimeout(showTimerRef.current);

    const to = e.relatedTarget;
    if (to && (
      containerRef.current.contains(to) ||
      (modalRef.current && modalRef.current.contains(to))
    )) {
      return;
    }

    triggerClose();
  }, [isMobile, choice, triggerClose]);


  // Derived properties (unchanged)
  const year = new Date(item.release_date || item.first_air_date).getFullYear();
  const votePct = (item.vote_average || 0) * 10;
  const getColor = (p) =>
    p >= 86 ? '#9b59b6' :
      p >= 70 ? '#2ecc71' :
        p >= 60 ? '#f1c40f' :
          p >= 55 ? '#e67e22' : '#e74c3c';

  if (item.title === 'Conclave') return null;

  const genreMap = {
    movie: {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
      53: 'Thriller', 10752: 'War', 37: 'Western'
    },
    tv: {
      10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      10762: 'Kids', 9648: 'Mystery', 10763: 'News', 10764: 'Reality',
      10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk',
      10768: 'War & Politics', 37: 'Western'
    }
  };

  // Framer Motion Variants for PC
  const pcVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      width: '100%',
      height: '100%',
    },
    visible: {
      opacity: 1,
      scale: 1,
      width: '335px',
      height: '250px',
      transition: {
        type: "tween",
        duration: 0.2,
        ease: "easeOut",
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      width: '100%',
      height: '100%',
      transition: {
        type: "tween",
        duration: 0.2,
        ease: "easeOut",
        when: "afterChildren",
      },
    },
  };

  // Framer Motion Variants for Mobile
  const mobileVariants = {
    hidden: {
      y: '100vh', // Start completely off-screen at the bottom
      opacity: 0,
    },
    visible: {
      y: '0vh', // Slide up to `top: 52vh` (relative to its fixed position)
      opacity: 1,
      transition: {
        type: 'tween',
        stiffness: 300,
        damping: 30,
        delayChildren: 0.2,
        staggerChildren: 0.07,
      },
    },
    exit: {
      y: '100vh', // Slide down completely off-screen
      opacity: 0,
      transition: {
        type: "tween",
        stiffness: 300,
        damping: 30,
        when: "afterChildren",
      },
    },
  };

  // Variants for inner modal content animations
  const childVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.15 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.1 } },
  };
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
  };


  // Dynamic style for PC modal positioning and transform-origin
  const getPCModalStyle = useCallback(() => {
    if (!containerRef.current) return {};

    const cardRect = containerRef.current.getBoundingClientRect();
    const modalW = 335;
    const padding = 10;

    let leftOffset = cardRect.width - 167; // Default: opens to the right
    let transformOriginX = '0%'; // Origin from left of modal

    const spaceRight = window.innerWidth - (cardRect.right + modalW);
    const spaceLeft = cardRect.left - modalW;

    if (spaceRight >= padding) {
      // Sufficient space on the right, keep default
    } else if (spaceLeft >= padding) {
      // Not enough space on right, but enough on left
      leftOffset = -modalW + 168; // Offset to place modal left of card
      transformOriginX = '100%'; // Origin from right of modal
    } else {
      // Not enough space on either side, default to opening right (may go off-screen)
      leftOffset = cardRect.width - 167;
      transformOriginX = '0%';
    }

    return {
      position: 'absolute',
      top: '0px',
      left: `${leftOffset}px`,
      transformOrigin: `${transformOriginX} 50%`,
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showModal && isMobile && (
          <motion.div
            className="modal-backdrop"
            onClick={triggerClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <div
        className="movie-card-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading ? (
          <SkeletonTheme baseColor="#ffffff11" enableAnimation={false}>
            <div className="movie-card">
              <Skeleton
                style={{ width: '100%', height: '100%', borderRadius: '10px' }}
              />
            </div>
          </SkeletonTheme>
        ) : (
          <div
            className="movie-card"
            onClick={onCardClick}
            style={{ backgroundImage: `url(${bg})` }}
          />
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              ref={modalRef}
              className={`movie-modal ${isMobile ? 'mobile' : ''}`}
              // Mobile: Apply `y` MotionValue for drag, and `scaleY`, `opacity` transforms
              style={isMobile ? { y,} : getPCModalStyle()}
              variants={isMobile ? mobileVariants : pcVariants}
              initial="hidden" // Ensure it starts from hidden
              animate="visible" // Animate to visible
              exit="exit"       // Animate to exit
              drag={isMobile ? "y" : false}
              dragConstraints={isMobile ? { top: 0 } : false}
              onDragStart={isMobile ? onMobileDragStart : undefined}
              onDrag={isMobile ? onMobileDrag : undefined}
              onDragEnd={isMobile ? onMobileDragEnd : undefined}
            >
              {choice && videos && (
                <div className="choicesmod" onClick={cancelwatchTrailer}>
                  <div className="video-wrapper">
                    <iframe
                      className="videoframemod"
                      src={`https://www.youtube.com/embed/${videos}?autoplay=1&controls=0&modestbranding=1`}
                      title={item.name}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  <motion.div
                    className="cancel"
                    onClick={cancelwatchTrailer}
                    variants={childVariants}
                  >
                    <i className="bx bx-x"></i>
                  </motion.div>
                </div>
              )}

              <motion.img
                src={apiConfig.w1280Image(item.backdrop_path || item.poster_path)}
                alt={item.title || item.name}
                onClick={() => goToDetails(item.id, category, item.title || item.name, item.poster_path)}
                variants={imageVariants}
              />
              <div className="modaldetails">
                <motion.h2 variants={childVariants}>{item.title || item.name}</motion.h2>
                <motion.p variants={childVariants}>{item.overview}</motion.p>
                <motion.div className="modal-row info" variants={childVariants}>
                  <div className="genremenuholder">
                    {item.genre_ids?.map(id => (
                      <span
                        key={id}
                        className="genremenutag"
                      >
                        {genreMap[category]?.[id] || 'Unknown'}
                      </span>
                    ))}
                  </div>
                  <div className="inforight">
                    <span className="year">{year}</span>
                    {cinemaStatus && <div className="inCinema">
                      {cinemaStatus}
                    </div>}
                    <span className="rating" style={{ color: getColor(votePct) }}>
                      {votePct.toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
                <motion.div className="modal-row controls" variants={childVariants}>
                  <button
                    className="icon-btn play-btn"
                    data-tooltip="Play"
                    onClick={() => handlePlayer(item.id, item.title || item.name, category)}
                  >
                    <i className="bx bx-play" />
                  </button>
                  <button
                    className="icon-btn trailer-btn"
                    data-tooltip="Watch Trailer"
                    onClick={getVideos}
                  >
                    <i className='bx bx-joystick-alt'></i>
                  </button>
                  <button
                    className="icon-btn watchlist-btn"
                    data-tooltip={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    onClick={saveShow}
                  >
                    {isInWatchlist ? (
                      <i className="bx bxs-bookmark-plus" />
                    ) : (
                      <i className="bx bx-bookmark-plus" />
                    )}
                  </button>
                  <button
                    className="icon-btn info-btn"
                    data-tooltip="More Info"
                    onClick={() => goToDetails(item.id, category, item.title || item.name, item.poster_path)}
                  >
                    <i className="bx bx-info-square" />
                  </button>
                  <button
                    className="icon-btn close-btn"
                    data-tooltip="Close"
                    onClick={triggerClose}
                  >
                    <i className="bx bx-x" />
                  </button>
                </motion.div>
                <div className="modal-row extra" ></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

MovieCard.propTypes = {
  category: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default MovieCard;

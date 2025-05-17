// MovieCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './movie-card.scss';
import PropTypes from 'prop-types';
import apiConfig from '../../api/apiConfig';
import { UserAuth } from '../../context/AuthContext';
import tmdbApi from '../../api/tmdbApi';
import { useFirestore } from '../../Firestore';
import { toast } from 'react-toastify';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


const MovieCard = React.memo(({ item = {}, category }) => {
  const { user } = UserAuth();
  const { addToWatchlist, checkIfInWatchlist } = useFirestore();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const modalRef     = useRef(null);
  const touchStartY = useRef(null);

  // state
  const [isLoading, setIsLoading]         = useState(true);
  const [bg, setBg]                       = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [isClosing, setIsClosing]         = useState(false);
  const [modalPos, setModalPos]           = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile]           = useState(window.innerWidth < 800);
  const [videos , setVideos] = useState([]);
    const [choice, setChoice] = useState(false);

  // viewport
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // preload poster
  // lazy load poster using IntersectionObserver
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
        observer.disconnect(); // only load once
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(node);
  return () => observer.disconnect();
}, [item.poster_path]);

  // watchlist
  useEffect(() => {
    if (!user) return setIsInWatchlist(false);
    checkIfInWatchlist(user.uid, item.id).then(setIsInWatchlist);
  }, [user, item, checkIfInWatchlist]);

  // handle close (with mobile animation)
  const triggerClose = () => {
    
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        setShowModal(false);
      }, 250);
   
  };
 const getVideos = async () => {
  try {
    const res = await tmdbApi.getVideos(category, item.id);
    const trailer = res.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
      setVideos(trailer.key);
      setChoice(true); // show iframe
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

const cancelwatchTrailer = (e) => {
  e.stopPropagation();
  setChoice(false);
  setVideos(null);
};


  // ESC to close
  useEffect(() => {
  if (!showModal) return;

  const onKey = (e) => {
    if (e.key === 'Escape') triggerClose();
  };

  const onPopState = () => {
    if (isMobile && showModal) {
      triggerClose();
    }
  };

  window.addEventListener('keydown', onKey);
  window.addEventListener('popstate', onPopState);

  // Push a dummy state to history when modal opens (enables back gesture)
  if (isMobile) {
    history.pushState({ modalOpen: true }, '');
  }

  return () => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('popstate', onPopState);

    // Go back one step if the modal was open (cleanup pushed state)
    if (isMobile) {
      history.back();
    }
  };
}, [showModal, isMobile]);


  // lock scroll on mobile
  useEffect(() => {
    if (showModal && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showModal, isMobile]);

  // swipe-down to close on mobile
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  const onTouchMove = (e) => {
    if (touchStartY.current == null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
  
    if (deltaY > 60) {
      e.preventDefault(); // prevent pull-to-refresh
      touchStartY.current = null;
      triggerClose();
    }
  };
  

  // save watchlist
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

  // details
  const goToDetails = (id,category, title, poster_path) => {
    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) {
        continueWatching = [];
    }
    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
        continueWatching = [...continueWatching, {id,category, title, poster_path }];
        localStorage.setItem('ContinueWatching' , JSON.stringify(continueWatching));
        //console.log(continueWatching);
    }
    navigate(`/${category}/${id}`);
}
const inCinema = (releaseDate) => {
    const today = new Date();
    const threeWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (4 * 7));
    if (category === 'movie') {
        if (releaseDate < today) {
            return releaseDate > threeWeeksAgo ? '  In Cinema' : '';
        }
        else{
            return 'Coming Soon';
        }
    }
    return '';
}

const cinemaStatus = inCinema(new Date(item.release_date || item.first_air_date));
  const onCardClick = () => {
    if (isMobile) setShowModal(true);
    else goToDetails( item.id, category, item.title, item.poster_path);
  };

  // player
  const handlePlayer = (id, name, type) => {
    if (!id || !name) return;
    const detailslug = encodeURIComponent(name.trim().replace(/ /g, "-").toLowerCase());
    const path = `/watch/${detailslug}/${id}${type === 'tv' ? '/1/1' : ''}`;
    navigate(path);
  };

  const showTimerRef = useRef(null);
 const hideTimerRef = useRef(null);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
     clearTimeout(showTimerRef.current);
     clearTimeout(hideTimerRef.current);
    };
  }, []);

  // hover desktop
  const handleMouseEnter = () => {
       if (!containerRef.current || isMobile) return;
       // cancel any pending hide
       clearTimeout(hideTimerRef.current);
       // schedule show
       showTimerRef.current = setTimeout(() => {
         const rect = containerRef.current.getBoundingClientRect();
         const modalW = 300;
         let leftOffset = rect.width - 170;
         if (rect.left + rect.width + modalW + 10 > window.innerWidth) {
           leftOffset = -modalW + 145;
         }
         setModalPos({ top: 0, left: leftOffset });
         setShowModal(true);
       }, 150);
     };
    
     const handleMouseLeave = (e) => {
      if(choice){
        setChoice(false);
        setVideos(null);
      }
      if (isMobile) return;
      const to = e.relatedTarget;
      // Check if to is not null before calling contains
      if (to && (
        containerRef.current.contains(to) ||
        (modalRef.current && modalRef.current.contains(to))
      )) {
        return;
      }
      // If we reach here, the mouse has left the viewport or the element
      // cancel any pending show
      clearTimeout(showTimerRef.current);
      // schedule hide
      hideTimerRef.current = setTimeout(() => {
        triggerClose();
      }, 150);
    };
  // derived
  const year    = new Date(item.release_date || item.first_air_date).getFullYear();
  const votePct = (item.vote_average || 0) * 10;
  const getColor = (p) =>
    p >= 86 ? '#9b59b6' :
    p >= 70 ? '#2ecc71' :
    p >= 60 ? '#f1c40f' :
    p >= 55 ? '#e67e22' : '#e74c3c';
  const runtime = category === 'movie' && item.runtime
    ? `${Math.floor(item.runtime/60)}h ${item.runtime%60}m`
    : null;
  const seasons = category === 'tv' && item.number_of_seasons
    ? `${item.number_of_seasons} season${item.number_of_seasons>1?'s':''}`
    : null;

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

  return (
    <>
      {showModal && isMobile && (
        <div className="modal-backdrop" onClick={triggerClose} />
      )}

      <div
        className="movie-card-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        //onClick={onCardClick}
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
           
        {showModal && (
          <div
            ref={modalRef}
            className={`movie-modal${isMobile ? ' mobile' : ''}${isClosing ? ' closing' : ''}`}
            style={isMobile ? {} : { top: 0, left: `${modalPos.left}px` }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={isMobile ? onTouchStart : null}
            onTouchMove={isMobile ? onTouchMove : null}
          >
            {choice && videos && (
  <div className="choicesmod" onClick={cancelwatchTrailer}>
  <div className="video-wrapper">
    <iframe
      className="videoframemod"
      src={`https://www.youtube.com/embed/${videos}?autoplay=1`}
      title={item.name}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </div>
  <div className="cancel" onClick={cancelwatchTrailer}><i className="bx bx-x"></i></div>
</div>

)}

            <img
              src={apiConfig.w1280Image(item.backdrop_path || item.poster_path)}
              alt={item.title}
              onClick={()=> goToDetails( item.id, category, item.title, item.poster_path)}
            />
            <div className="modaldetails">
              <h2>{item.title || item.name}</h2>
              
              <p>{item.overview}</p>
              <div className="modal-row info">
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
                 { cinemaStatus && <div className="inCinema">
                   { cinemaStatus}
                </div>}
                
               <span className="rating" style={{ color: getColor(votePct) }}>
                  {votePct.toFixed(0)}%
              </span>
          </div>
              
                
                 </div>
              <div className="modal-row controls">
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
    onClick={() => goToDetails(item.id, category, item.title, item.poster_path)}
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
</div>


              

              <div className="modal-row extra" >
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

MovieCard.propTypes = {
  category: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default MovieCard;

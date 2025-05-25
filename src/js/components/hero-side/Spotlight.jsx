// Spotlight.jsx (Embla Carousel with Autoplay + Fade)
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import axios from "axios"; // Import axios
import Button from "../button/Button";
import "./spotlight.scss";
import "../../pages/home.scss";
import Skeleton , { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import apiConfig from "../../api/apiConfig";
import { fetchGenres , fetchSpotlightData } from "../../hooks/LocalStorageCache";


const Spotlight = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const historyRef = useRef(null);

  // New state for carousel slides, loading, and errors
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieGenres, setMovieGenres] = useState({});
  const [tvGenres, setTvGenres] = useState({});

  const autoplay = useRef(Autoplay({ delay: 7500, stopOnInteraction: true }));
  const fade = useRef(Fade());

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1 },
    [autoplay.current, fade.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect(); // update on mount
  }, [emblaApi, onSelect]);

 useEffect(() => {
    const loadGenres = async () => {
      try {
        const movieG = await fetchGenres("movie");
        setMovieGenres(movieG);
        const tvG = await fetchGenres("tv");
        setTvGenres(tvG);
      } catch (err) {
        console.error("Failed to load genres:", err);
        setError("Failed to load genre data.");
      }
    };
    loadGenres();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch and process TMDB data for carousel using the cached utility
  useEffect(() => {
    // Only fetch spotlight data once genres are loaded
    if (Object.keys(movieGenres).length === 0 || Object.keys(tvGenres).length === 0) {
      return;
    }

    const loadSpotlight = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSpotlightData(movieGenres, tvGenres);
        setCarouselSlides(data);
      } catch (err) {
        console.error("Failed to fetch spotlight data:", err);
        setError("Failed to load spotlight data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSpotlight();
  }, [movieGenres, tvGenres]); // Re-run if genres change (ensures data processing has genres)


  useEffect(() => {
    const stored = localStorage.getItem("playerDataList");
    if (stored) {
      const items = Object.values(JSON.parse(stored));
      items.sort((a, b) => b.lastWatched - a.lastWatched);
      setHistory(items);
    }
  }, []);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index) => {
    if (emblaApi) {
      emblaApi.scrollTo(index, true); // true for snap, false for smooth
    }
  };
  
  const openModal = (item, e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    const stored = localStorage.getItem("playerDataList");
    const list = stored ? JSON.parse(stored) : {};
    delete list[selectedItem.id]; // Assuming selectedItem.id is the key used in localStorage
    localStorage.setItem("playerDataList", JSON.stringify(list));
    setHistory(prev => prev.filter(i => i.id !== selectedItem.id));
    closeModal();
  };

  const handleDetails = () => {
    if (!selectedItem) return;
    // Assuming selectedItem has media_type from TMDB ('movie' or 'tv')
    const category = selectedItem.media_type || (selectedItem.seasonNumber ? "tv" : "movie");
    navigate(`/${category}/${selectedItem.tmdb_id || selectedItem.id}`); // Use tmdb_id if available
    closeModal();
  };

  const handleEpisodeClick = (id, title, season, episode, mediaType = 'tv') => {
    if (title && id && season && episode) {
      const encoded = encodeURIComponent(title.replace(/ /g, "-").toLowerCase());
      navigate(`/watch/${encoded}/${id}/${season}/${episode}`);
    } else if (mediaType === 'movie' && title && id) {
        handlePlayer(id, title); // Fallback to movie player if season/episode missing
    }
  };

  const handlePlayer = (id, name) => {
    if (name && id) {
      const encoded = encodeURIComponent(name.replace(/ /g, "-").toLowerCase());
      navigate(`/watch/${encoded}/${id}`);
    }
  };

  const getProgress = item => item.runtime > 0
    ? Math.min((item.timeSpent / item.runtime) * 100, 100)
    : 0;
  
    const handleScrollLeft = (ref) => {
      ref.current?.scrollBy({
        left: -1000,
        behavior: "smooth",
      });
    };
    
    const handleScrollRight = (ref) => {
      ref.current?.scrollBy({
        left: 1000,
        behavior: "smooth",
      });
    };

  if (isLoading) {
      <SkeletonTheme baseColor="#ffffff11" enableAnimation={false}>
                 return <div className="embla__slide">
      <Skeleton
        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
      />
    </div>; // Or a proper spinner
              </SkeletonTheme>
   
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (carouselSlides.length === 0) {
    return <div className="info-container">No spotlight items available at the moment.</div>;
  }

  return (
    <div className="spotlight">
      <div className="modalhome">
        <h1 className="homenama">HOME</h1>
      </div>

      {/* Embla Spotlight Carousel */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {carouselSlides.map((slide, i) => (
            
            <div className="embla__slide" key={slide.id || i}> {/* Use unique slide.id */}
             <div className="spotlight-backdropblur" style={{ backgroundImage: `url(${slide.image})` }}></div>
           
              <div className="spotlight-item">
                <h1 className="spotlight-number">{slide.media_type === 'tv' ? 'TV-MA' : 'R'}</h1> {/* Example rating */}
                <img
                  loading="lazy"
                  src={slide.image}
                  alt={slide.title}
                  className="spotlight-image"
                />
                <div className="spotlight-content">
                  {slide.logo && (
                    <div className="spotlight-name">
                      <img loading="lazy" className="spotim" src={slide.logo} alt={`${slide.title} logo`} />
                      <h1 className="spotlight-title-text">{slide.title}</h1>
                    </div>
                  )}
                  {!slide.logo && <h2 className="spotlight-title-text">{slide.title}</h2>} {/* Fallback if no logo */}
                  <div className="spotty">
                    <p className="spotlight-genres">
                      {slide.genres.map((g, idx) => (
                        <span key={idx} className="genre a">{g}</span>
                      ))}
                    </p>
                    <h5 className="genre a">{slide.media_type === 'tv' ? 'TV | ' : 'MOVIE | '}{slide.date}</h5>
                    <h5 className="genre a">{slide.score}</h5>
                  </div>
                  <p className="spotlight-overview">{slide.overview}</p>
                  <div className="spotty">
                    <Button className="spotlight-watch-btn" onClick={() => navigate(`/${slide.media_type}/${slide.id}`)}>
                      <i className='bx bx-info-circle'></i>
                    </Button>
                    <Button className="spotlight-watch-btn" onClick={() =>
                      slide.media_type === 'tv'
                        ? handleEpisodeClick(slide.id, slide.title, slide.season, slide.episode, slide.media_type)
                        : handlePlayer(slide.id, slide.title)
                    }>
                      <i className='bx bx-play'></i> Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="caroselnav">
          {/* ARROWS */}
          <div className="embla__buttons">
          <button className="embla__button embla__button--prev" onClick={scrollPrev}>
            <i className='bx bx-left-arrow-alt'></i>
          </button>
          <button className="embla__button embla__button--next" onClick={scrollNext}>
            <i className='bx bx-right-arrow-alt'></i>
          </button>
        </div>

        {/* PAGINATION DOTS */}
        <div className="embla__dots">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`embla__dot ${index === selectedIndex ? "is-selected" : ""}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>


      {/* Continue Watching Section (remains mostly unchanged) */}
        <div className="conconwa">
            {history.length > 0 && (
              <div className="spacegia">
                  {history.length > 8 && (
            <div className="alignerbutts">
            <button className="leftgia" onClick={() => handleScrollLeft(historyRef)}>
              <i className="bx bx-left-arrow-alt" style={{fontSize : '25px'}}></i>
            </button>
            <button className="rightgia"  onClick={() => handleScrollRight(historyRef)}>
              <i className="bx bx-right-arrow-alt" style={{fontSize : '25px'}}></i>
            </button>
          </div>
            )}
          <div className="divconw">
          <h4 className="favaziwwr">Continue Watching</h4>
            <i className="bx bx-cheese" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' , color : 'rgba(255, 255, 255, 0.49)'}}></i>
        
        </div>
              </div>
        
      )}
            
      <div className="player-history" ref={historyRef}>
      {history.map((item) => {
        const progress = getProgress(item);
        return (
          <div
            key={`${item.id}_${item.seasonNumber || ""}_${item.lastEpisode || ""}`}
            className="player-history-item"
            onClick={() => navigate(item.currentUrl)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <img
              src={apiConfig.w500Image(item.poster_path)} // Ensure this path is correct for history items
              alt={item.title}
              loading="lazy"
              className="player-history-item__poster"
            />
            <div className="player-history-item__info">
              
              <div className="spacebtween">
                <div className="player-history-item__title">
                {item.title}
              </div>
              
              {item.seasonNumber && (
                <div className="player-history-item__episode">
                  
                  <span className="player-history-item__episode-label">
                    S{item.seasonNumber} • E{item.lastEpisode}
                  </span>
                </div>
              )}
                </div>
              <div
                style={{
                  background: "#ffffff1a",
                  width: "100%",
                  height: "2.9px",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(to right,rgb(255, 0, 47),rgb(241, 57, 57))",
                    width: `${progress}%`,
                    height: "100%",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
            <button
              className="history-item-action-btn"
              onClick={(e) => openModal(item, e)} // Make sure 'item' here has 'id' and 'media_type' or similar
              style={{
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                color: "white",
                right: "5px",
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
                <div style={{ color: "red" , fontSize : '16px' }}>Remove</div>
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
    </div>
    </div>
  );
};

export default Spotlight;

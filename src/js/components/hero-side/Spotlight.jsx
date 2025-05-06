import { useRef , useEffect , useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay , Pagination ,Mousewheel , FreeMode ,} from "swiper/modules";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/autoplay';
import '../../pages/home.scss';
import apiConfig from "../../api/apiConfig";
// import tmdbApi from "../../api/tmdbApi";

import "swiper/scss/effect-coverflow";
const Spotlight = () => {
  
             const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

             const historyRef = useRef(null); 
  const sliderRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const touchStartTimeRef = useRef(null);
  const touchStartXRef = useRef(null);
    const navigate = useNavigate();
    const ACTIVE_WIDTH = 800;    // Active slide width when fully active.
    const INACTIVE_WIDTH = 300;  // All other slides width.
    const WIDTH_DIFF = ACTIVE_WIDTH - INACTIVE_WIDTH; // 500 px.
    const MAX_DURATION = 500;    // Duration (ms) for a full transition (t=1).
    const COMMIT_THRESHOLD = 0.5; // If computed factor ≥ 0.5, commit to the neighbor.
    const TRANSITION_SPEED = 1000; // ms for a slow, gradual transition.
     const [history, setHistory] = useState([]);
    
     const [modalOpen, setModalOpen] = useState(false);
     const [selectedItem, setSelectedItem] = useState(null);
   

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
      
  
      const handleEpisodeClick = (id , title ,selectedSeason, episodeNumber) => {
      //console.log(selectedSeason , episodeNumber);
      //console.log(id , title  )
        //console.log('handlePlayer function called', id, title , selectedSeason , episodeNumber);

        if (title && id && selectedSeason && episodeNumber) {
            const encodedTitle = encodeURIComponent(title.replace(/ /g, '-').toLowerCase());
            //console.log(`Navigating to: /watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            //console.log(id, title );
        }
    };
    const handlePlayer = (itemId, itemName) => {
      //console.log('handlePlayer function called', itemId, itemName);

      if (itemName && itemId) {
          const encodedTitle = encodeURIComponent(itemName.replace(/ /g, '-').toLowerCase());
         // console.log(`Navigating to: /watch/${encodedTitle}/${itemId}`);
          navigate(`/watch/${encodedTitle}/${itemId}`);
          //console.log(itemId);
      }
  };

    return (
      <>
        <div className="spotlight">
          <div className="modalhome">
            <h1 className="homenama">HOME</h1>
          </div>
        
      
    <Swiper
      ref={sliderRef}
      spaceBetween={4}
      slidesPerView={isDesktop ? 4 : 2}
      initialSlide={0} // Start with slide index 1 as active.
      navigation={{
        prevEl: navigationPrevRef.current,
        nextEl: navigationNextRef.current,
      }}
      onSwiper={(swiper) => {
        // Delay navigation setup so refs are defined.
        setTimeout(() => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }, 0);
      }}
      loop={true}
      slideToClickedSlide={true}
      speed={TRANSITION_SPEED}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4500 }}
      modules={[Navigation, Autoplay, Pagination, Mousewheel, FreeMode]}
      mousewheel={{ forceToAxis: true, sensitivity: 0.5, releaseOnEdges: true }}
      freeMode={false}
      watchSlidesProgress={isDesktop} // Enable custom progress handling only on desktop.
      {...(isDesktop && {
        // These custom event handlers are only added on desktop.
        onTouchStart: (swiper, event) => {
          touchStartTimeRef.current = Date.now();
          touchStartXRef.current = swiper.touches.startX;
        },
        onTouchMove: (swiper, event) => {
          const currentTime = Date.now();
          const duration = currentTime - touchStartTimeRef.current;
          let t = duration / MAX_DURATION;
          if (t > 1) t = 1;
          const deltaX = swiper.touches.currentX - touchStartXRef.current;
          const swipeDirection = deltaX < 0 ? 'next' : 'prev';
          const activeIndex = swiper.activeIndex;
          const activeSlide = swiper.slides[activeIndex];
          if (!activeSlide) return;
          let neighborSlide = null;
          if (swipeDirection === 'next' && swiper.slides[activeIndex + 1]) {
            neighborSlide = swiper.slides[activeIndex + 1];
            activeSlide.style.transformOrigin = 'right center';
            neighborSlide.style.transformOrigin = 'left center';
          } else if (swipeDirection === 'prev' && swiper.slides[activeIndex - 1]) {
            neighborSlide = swiper.slides[activeIndex - 1];
            activeSlide.style.transformOrigin = 'left center';
            neighborSlide.style.transformOrigin = 'right center';
          }
          const newActiveWidth = ACTIVE_WIDTH - WIDTH_DIFF * t;
          activeSlide.style.width = `${newActiveWidth}px`;
          if (neighborSlide) {
            const newNeighborWidth = INACTIVE_WIDTH + WIDTH_DIFF * t;
            neighborSlide.style.width = `${newNeighborWidth}px`;
          }
          // Ensure all other slides are set to the inactive width.
          swiper.slides.forEach((slide, idx) => {
            if (idx !== activeIndex && slide !== neighborSlide) {
              slide.style.width = `${INACTIVE_WIDTH}px`;
            }
          });
        },
        onTouchEnd: (swiper, event) => {
          const currentTime = Date.now();
          const duration = currentTime - touchStartTimeRef.current;
          let t = duration / MAX_DURATION;
          if (t > 1) t = 1;
          const activeIndex = swiper.activeIndex;
          const deltaX = swiper.touches.currentX - touchStartXRef.current;
          const swipeDirection = deltaX < 0 ? 'next' : 'prev';
          if (t >= COMMIT_THRESHOLD) {
            if (swipeDirection === 'next' && swiper.slides[activeIndex + 1]) {
              swiper.slideNext(TRANSITION_SPEED);
            } else if (swipeDirection === 'prev' && swiper.slides[activeIndex - 1]) {
              swiper.slidePrev(TRANSITION_SPEED);
            } else {
              swiper.slideTo(activeIndex, TRANSITION_SPEED);
            }
          } else {
            swiper.slideTo(activeIndex, TRANSITION_SPEED);
          }
        },
        onSetTransition: (swiper, speed) => {
          swiper.slides.forEach((slide) => {
            slide.style.transitionDuration = `${speed}ms`;
          });
        },
      })}
      className="swiper"
    >
       <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/cJvUJEEQ86LSjl4gFLkYpdCJC96.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(70, 49, 0, 0.566))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="http://image.tmdb.org/t/p/w500/eTWOGyx6CbsR4ItUFssyCqAx9ej.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ACTION</span>
                    <span className="genre a">WAR</span>
                   
                  </p>
                  <h5 className="genre a"> MOVIE | 11 APR 2025 </h5> <h5 className="genre a"> 71%</h5>
                  </div>
                  <p className="spotlight-overview">
                 A platoon of Navy SEALs embarks on a dangerous mission in Ramadi, Iraq, with the chaos and brotherhood of war retold through their memories of the event.


</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1241436')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1241436, "WARFARE")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
       
     <SwiperSlide>
  <div className="spotlight-item">
    <h1 className="spotlight-number">TV-MA</h1>
    <img
      loading="lazy"
      src="https://image.tmdb.org/t/p/w1280/zz6DywhCTRHxrRXCjXU71edNOUX.jpg"
      alt="Death of a Unicorn"
      className="spotlight-image"
      style={{ filter: 'drop-shadow(0 0 3rem rgba(255, 255, 255, 0.52))' }}
    />
    <div className="spotlight-content">
      <h2 className="spotlight-name">
        <img
          loading="lazy"
          className="spotim"
          src="https://image.tmdb.org/t/p/w500/yumy3enQh3Ag14WFCp0MtWBROtU.png"
          alt="Death of a Unicorn logo"
        />
      </h2>
      <div className="spotty">
        <p className="spotlight-genres">
          <span className="genre a">HORROR</span>
          <span className="genre a">FANTASY</span>
          <span className="genre a">COMEDY</span>
        </p>
        <h5 className="genre a">MOVIE | 03 MAR 2025</h5>
        <h5 className="genre a">66%</h5>
      </div>
      <p className="spotlight-overview">
        A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat,
      </p>
      <div className="spotty">
        <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1153714')}>
          <i className="bx bx-info-circle"></i>
        </Button>
        <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1153714, "death of a unicorn")}>  <i className='bx bx-play'></i> Watch Now</Button>
                 
      </div>
    </div>
  </div>
</SwiperSlide>

<SwiperSlide>
  <div className="spotlight-item">
    <h1 className="spotlight-number">TV-MA</h1>
    <img
      loading="lazy"
      src="https://image.tmdb.org/t/p/original/cS8QuTToYejetylQDHMGc8jjPIj.jpg"
      alt="DROP"
      className="spotlight-image"
      style={{ filter: 'drop-shadow(0 0 3rem rgba(119, 12, 0, 0.59))' }}
    />
    <div className="spotlight-content">
      <h2 className="spotlight-name">
        <img
          loading="lazy"
          className="spotim"
          src="https://image.tmdb.org/t/p/w500/c9FDFca7YITIOdNz57BF0dEGyEG.png"
          alt="DROP logo"
        />
      </h2>
      <div className="spotty">
        <p className="spotlight-genres">
          <span className="genre a">HORROR</span>
          <span className="genre a">MYSTERY</span>
          <span className="genre a">THRILLER</span>
        </p>
        <h5 className="genre a">MOVIE | 04 APR 2025</h5>
        <h5 className="genre a">65%</h5>
      </div>
      <p className="spotlight-overview">
        A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat,
      </p>
      <div className="spotty">
        <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1249213')}>
          <i className="bx bx-info-circle"></i>
        </Button>
        <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1249213, "drop")}>  <i className='bx bx-play'></i> Watch Now</Button>
                 
      </div>
    </div>
  </div>
</SwiperSlide>

<SwiperSlide>
  <div className="spotlight-item">
    <h1 className="spotlight-number">TV-MA</h1>
    <img
      loading="lazy"
      src="https://image.tmdb.org/t/p/original/wY1US9I51xxkwDJXQp6ktmhfh2Z.jpg"
      alt="YOU"
      className="spotlight-image"
      style={{ filter: 'drop-shadow(0 0 3rem rgba(152, 0, 0, 0.59))' }}
    />
    <div className="spotlight-content">
      <h2 className="spotlight-name">
        <img
          loading="lazy"
          className="spotim"
          src="https://image.tmdb.org/t/p/w500/VeNCc4i7LbRQpwC1mYl5jtBzFM.png"
          alt="YOU logo"
        />
      </h2>
      <div className="spotty">
        <p className="spotlight-genres">
          <span className="genre a">MYSTERY</span>
          <span className="genre a">DRAMA</span>
        </p>
        <h5 className="genre a">TV | 04 DEC 2018</h5>
        <h5 className="genre a">80%</h5>
      </div>
      <p className="spotlight-overview">
        A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by..
      </p>
      <div className="spotty">
        <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/78191')}>
          <i className="bx bx-info-circle"></i>
        </Button>
        <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(78191, "YOU", 1, 1)}>
          <i className="bx bx-play"></i> Watch Now
        </Button>
      </div>
    </div>
  </div>
</SwiperSlide>

<SwiperSlide>
  <div className="spotlight-item">
    <h1 className="spotlight-number">TV-MA</h1>
    <img
      loading="lazy"
      src="https://image.tmdb.org/t/p/original/3hPKf2eriMi6B2L5brfQH0A7MNe.jpg"
      alt="ANDOR"
      className="spotlight-image"
      style={{ filter: 'drop-shadow(0 0 3rem rgba(77, 77, 77, 0.59))' }}
    />
    <div className="spotlight-content">
      <h2 className="spotlight-name">
        <img
          loading="lazy"
          className="spotim"
          src="https://image.tmdb.org/t/p/w500/xwuSAZHLsalFcOut36SDvBPDhZO.png"
          alt="ANDOR logo"
        />
      </h2>
      <div className="spotty">
        <p className="spotlight-genres">
          <span className="genre a">ACTION</span>
          <span className="genre a">DRAMA</span>
          <span className="genre a">SCI-FI & FANTASY</span>
        </p>
        <h5 className="genre a">TV | 04 DEC 2023</h5>
        <h5 className="genre a">83%</h5>
      </div>
      <p className="spotlight-overview">
        In an era filled with danger, deception and intrigue, Cassian Andor will discover the difference he can make in the struggle against the tyrannical Galactic Empire...
      </p>
      <div className="spotty">
        <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/83867')}>
          <i className="bx bx-info-circle"></i>
        </Button>
        <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(83867, "ANDOR", 1, 1)}>
          <i className="bx bx-play"></i> Watch Now
        </Button>
      </div>
    </div>
  </div>
</SwiperSlide>

     <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 3rem rgba(6, 48, 1, 0.3))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/msYtgZbEo8tAOJ37T50kgqulpKf.png"/></h2>
                  
              
      
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">MYSTERY</span>
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">SCI-FI</span>

                  </p>
                  <h5 className="genre a"> TV | 04 DEC 2023 </h5> <h5 className="genre a"> 83%</h5>
                </div>
                  
                  <p className="spotlight-overview">Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both .</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/100088')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(100088, "LOU" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
     </SwiperSlide>
     <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/9KSGUPHZpqhqkRXE2eebu701ONU.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(176, 28, 48, 0.3))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/qCBgsC4rM1szdtRt2AoB07KoGpA.png"/></h2>
                  
              
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">FANTASY</span>
                    <span className="genre a">HORROR</span>

                  </p>
                  <h5 className="genre a"> MOVIE | 21 MAR 2025 </h5> <h5 className="genre a"> 67%</h5>
               </div>
                  
                  <p className="spotlight-overview">A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, causing untold horror in its wake.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/931349')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 931349, "ash")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
           
       <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/dg3OindVAGZBjlT3xYKqIAdukPL.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 3rem rgba(33, 206, 200, 0.3))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/hmS9vRMSyzYK3D2fLoM97O4liqZ.png"/></h2>
                  
              
      
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">MYSTERY</span>
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">SCI-FI & FANTASY</span>

                  </p>
                  <h5 className="genre a"> TV | 04 DEC 2011 </h5> <h5 className="genre a"> 83%</h5>
                </div>
                  
                  <p className="spotlight-overview">Twisted tales run wild in this mind-bending anthology series that reveals humanity's worst traits, greatest innovations and more...</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/42009')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(42009, "BLACK MIRROR" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
       <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">15</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/2P0PUkQ1tNHNYTEmtbBmM8MfXBG.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(14, 165, 165, 0.26))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/ffJVoywEy5F838YkqBljNm0yyit.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">SCIENCE FICTION</span>
                    <span className="genre a">COMEDY</span>
                    <span className="genre a">ADVENTURE</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 03 MAR 2025 </h5> <h5 className="genre a"> 69%</h5>
                  </div>
                  <p className="spotlight-overview">
                  Unlikely hero Mickey Barnes finds himself in the extraordinary circumstance of working for an employer who demands the ultimate commitment to the job… to die, for a living.
</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/696506')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 696506, "mickey 17")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
        </SwiperSlide> 
        <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/a4FjjSKOHcUW6gtEYruc3o4fLIw.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(103, 81, 50, 0.34))'}}/>
                
                <div className="spotlight-content">
                              
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/iPITIm26Qpt5dFhaLIXxCg7z7zy.png"/></h2>
                    <div className="spotty">
                       
                   <p className="spotlight-genres">
                       <span className="genre a">DRAMA</span>
                    </p>    
               
                    <h5 className="genre a"> MOVIE | 20 DEC 2024 </h5> <h5 className="genre a"> 59%</h5>
                    </div>
                  <p className="spotlight-overview"> Escaping post-war Europe, visionary architect László Toth arrives in America to rebuild his life, his work, and his marriage to his wife Erzsébet after being forced apart during wartime by shifting borders and regimes. On his own in a strange new country, </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1045938')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1045938, " g20")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                    </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/8eBj4WgFTsQOb8Moicf0I9sBgDE.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(65, 107, 179, 0.36))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/4ClU26cEqeEYTj6Da7ADgO5HVUq.png"/></h2>
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ACTION</span>
                    <span className="genre a">ADVENTURE</span>
                    <span className="genre a">COMEDY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 13 MAR 2024 </h5> <h5 className="genre a"> 69%</h5>
                </div>
                  <p className="spotlight-overview">

Mufasa, a cub lost and alone, meets a sympathetic lion named Taka, the heir to a royal bloodline. The chance meeting sets in motion an expansive journey of a group of misfits searching for their destiny.

</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1195506')}>  <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1195506, "MR FEEL NO PAIN")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
      <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/kpgbsuBLAz865wXEnAapkAtnVNB.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 3rem rgba(0, 119, 255, 0.2))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/ct4zQL0VHxww0fG0rIw4k8i9jue.png"/></h2>
                  
              
      
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">ACTION & ADVENTURE</span>
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">SCI-FI & FANTASY</span>

                  </p>
                  <h5 className="genre a"> TV | 03 APR 2025 </h5> <h5 className="genre a"> 83%</h5>
                </div>
                  
                  <p className="spotlight-overview">When a mysterious villain threatens to open the gates of Hell, a devilishly handsome demon hunter could be the world's best hope for salvation.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/235930')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 235930, "devil may cry" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
        </SwiperSlide> 
        <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/xXv87ECdpvLbmHlZD7HhyyYhVMP.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 3rem rgba(132, 125, 2, 0.3))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/sZQ4d6PsMVJqNhZnxAx7G3BZbQV.png"/></h2>
                  
              
      
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">ACTION & ADVENTURE</span>
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">SCI-FI & FANTASY</span>

                  </p>
                  <h5 className="genre a"> TV | 03 APR 2025 </h5> <h5 className="genre a"> 83%</h5>
                </div>
                  
                  <p className="spotlight-overview">Backwoods bounty hunter Hub Halloran comes back from the dead with an unexpected second chance at life, love, and a nearly-forgotten musical career — only to find that his old job now has a demonic new twist..</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/229711')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(229711, "THE BONDSMAN" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/5OsiT39OiZNdD0v2LiAcI2TpSYj.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgba(26, 131, 193, 0.25))'}} />
                
                <div className="spotlight-content">
              
                
                <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/yyS1tALk7t3YdTNMOvR5gsnXINA.png"/></h2>
                
                
                  
       
                  <div className="spotty">
                  <p className="spotlight-genres">
                       <span className="genre a">SCI-FI</span>
                        <span className="genre a">DRAMA</span>
              
                  </p>  
                  <h5 className="genre a"> SHOW | 17 FEB 2022 </h5> <h5 className="genre a"> 86%</h5>
                </div>
                  <p className="spotlight-overview">Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('tv/95396')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 95396, "Severance" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
          
      <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG-13</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/qfAfE5auxsuxhxPpnETRAyTP5ff.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.5rem rgba(211, 54, 54, 0.3))'}}/>
                
                <div className="spotlight-content">
                
            
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/5nzUYEgvDqrDWTCD1Bf4uX6S5I3.png"/></h2>
                
              
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ACTION</span>
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">THRILLER</span>
                    <span className="genre a">SCIENCE FICTION</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 02 FEB 2025 </h5> <h5 className="genre a"> 62%</h5>
               </div>
                  
                  <p className="spotlight-overview">After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/822119')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 822119 , "CAPTAIN AMERICA BRAVE NEW WORLD")}>  <i className='bx bx-play'></i> Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide>
           
        
          
            
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/7bNw4yfFQOWXZKKMFxFWIbFmsys.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(236, 236, 236, 0.25))'}}/>
                
                <div className="spotlight-content">
                
                 
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/23zbPU6u5TUdyrYXWs8Jxhqhiy9.png"/></h2>
                
               
                
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                  
                   
                 
                  <span className="genre a">DRAMA</span>
                  <span className="genre a">CRIME</span>
              

                </p>
                <h5 className="genre a"> SHOW | 04 MAR 2025 </h5> <h5 className="genre a"> 86%</h5>
                </div>
                  
                  <p className="spotlight-overview">Matt Murdock, a blind lawyer with heightened abilities, is fighting for justice through his bustling law firm, while former mob boss Wilson Fisk pursues his own political endeavors in New York. When their past identities begin to emerge, both men find themselves on an inevitable collision course.

</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/202555')}> <i className='bx bx-info-circle'></i>  </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 202555, "Daredevil born Again" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/ihzMEmq7Yc6ZfgEhagdDKnhGBgX.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(195, 121, 56, 0.25))'}}/>
                
                <div className="spotlight-content">
                
                 
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/original/rNTY34G4jfaT7YUiSRFw8vtSOjG.png"/></h2>
                
               
                
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                  
                   
                  <span className="genre a">DRAMA</span>
                  <span className="genre a">THRILLER</span>
                  <span className="genre a">MYSTERY</span>
              

                </p>
                  <h5 className="genre a"> SHOW | 01 JAN 2021 </h5> <h5 className="genre a"> 71%</h5>
               </div>
                  
                  <p className="spotlight-overview">This equal parts survival epic, psychological horror story and coming-of-age drama tells the saga of a team of wildly talented high school girls soccer players who become the (un)lucky survivors of a plane crash deep in the remote northern wilderness. The series chronicles their descent from a complicated but thriving team to savage clans, while also tracking the lives they’ve  </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/117488')}> <i className='bx bx-info-circle'></i>  </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 117488, "yellow jackets" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
           </SwiperSlide>
           

           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/rCTLaPwuApDx8vLGjYZ9pRl7zRB.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.9rem rgba(8, 46, 11, 0.5))'}}/>
                
                <div className="spotlight-content">
              
                
                <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/2SwIOcXZ4you4EjPCAw7IucCsgX.png"/></h2>
                
                
                  
                     
                  <div className="spotty">
                  <p className="spotlight-genres">
                       <span className="genre a">COMEDY</span>
                       <span className="genre a">MYSTERY</span>
                        <span className="genre a">DRAMA</span>
                        

                  </p> 
                  <h5 className="genre a"> SHOW | 04 MAR 2021 </h5> <h5 className="genre a"> 76%</h5>
                </div>
                  <p className="spotlight-overview">Follow the exploits of various guests and employees at an exclusive tropical resort over the span of a week as with each passing day, a darker complexity emerges in these picture-perfect travelers, the hotel’s cheerful employees and the idyllic locale itself..</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('tv/111803')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 111803, "the white lotus" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
       
           
            </SwiperSlide>
         
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/4drV6iluttgjZmU1Q0xDqjrBQ1.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgba(252, 252, 252, 0.25))'}} />
                
                <div className="spotlight-content">
              
                
                <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/9REjxZW5p1ORYXEIY1tpfzm1GmM.png"/></h2>
                
                
                  
                    
                  <div className="spotty">
                  <p className="spotlight-genres">
                       <span className="genre a">COMEDY</span>
                        <span className="genre a">DRAMA</span>
                        

                  </p> 
                  <h5 className="genre a"> SHOW | 02 FEB 2025 </h5> <h5 className="genre a"> 86%</h5>
                  </div>
                  <p className="spotlight-overview">

Former high school lab partners Marshall and Frances begin to unravel a conspiracy involving big pharma and the federal government to suppress knowledge of a rare mushroom that may hold the key to curing all the world’s diseases.

</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('tv/228878')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 228878, "Common Side Efffects" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
          
     
         
            
          
            
            <div className="alignerbutts2">
            <div className="buttsr" ref={navigationPrevRef} > <i className="bx bx-left-arrow-alt"></i></div>
            <div className="buttsl" ref={navigationNextRef} > <i className="bx bx-right-arrow-alt"></i></div>
          
            </div>
            
            </Swiper>
            <div className="conconwa">
            {history.length > 0 && (
              <div className="spacegia">
                 {history.length > 6 && (
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
             <i className="bx bx-cheese" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' }}></i>
         
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
            {/* Poster Image */}
            <img
              src={apiConfig.w200Image(item.poster_path)}
              alt={item.title}
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
              {/* Progress Bar */}
              <div
                style={{
                  background: "#ffffff1a",
                  width: "100%",
                  height: "2.9px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  //margin: "0rem .5rem",
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
            {/* Action Icon Button to open the modal */}
            <button
              className="history-item-action-btn"
              onClick={(e) => openModal(item, e)}
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
      </>
      
    );
};
export default Spotlight;

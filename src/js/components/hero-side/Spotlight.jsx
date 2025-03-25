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
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/25CY0FggI3YXy7AS4xIfVBcRaMq.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(117, 0, 0, 0.35))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/4ErxI9hrCWYewkZODZHOwmn43xe.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">HORROR</span>
                    <span className="genre a">COMEDY</span>
                    <span className="genre a">MYSTERY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 21 FEB 2025 </h5> <h5 className="genre a"> 60%</h5>
                  </div>
                  <p className="spotlight-overview">
                  When twin brothers find a mysterious wind-up monkey, a series of outrageous deaths tear their family apart. Twenty-five years later, the monkey begins a new killing spree forcing the estranged brothers to confront the cursed toy.

</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1124620')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1124620, "the monkey")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
        <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/5cSwaCiTjvUqMTkCTI4msG7Tahy.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(14, 165, 165, 0.26))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/3ytYkpRKXPdUO90Jom4QOkVTRLY.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">SCIENCE FICTION</span>
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">ADVENTURE</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 14 MAR 2025 </h5> <h5 className="genre a"> 69%</h5>
                  </div>
                  <p className="spotlight-overview">
                  An orphaned teen hits the road with a mysterious robot to find her long-lost brother, teaming up with a smuggler and his wisecracking sidekick.
</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/777443')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 777443, "THE ELECTRIC STATE")}>  <i className='bx bx-play'></i> Watch Now </Button>
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
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/voKEhzb4ExOmR0WSvQgLTTqRUEu.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgba(26, 131, 193, 0.25))'}} />
                
                <div className="spotlight-content">
              
                
                <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/2YkCVT6opPxKh2ogEqxVrCiFgsr.png"/></h2>
                
                
                  
       
                  <div className="spotty">
                  <p className="spotlight-genres">
                       <span className="genre a">ACTION</span>
                       <span className="genre a">CRIME</span>
                        <span className="genre a">DRAMA</span>
              
                  </p>  
                  <h5 className="genre a"> SHOW | 17 FEB 2022 </h5> <h5 className="genre a"> 81%</h5>
                </div>
                  <p className="spotlight-overview">Jack Reacher, a veteran military police investigator, has just recently entered civilian life. Reacher is a drifter, carrying no phone and the barest of essentials as he travels the country and explores the nation he once served.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('tv/108978')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 108978, "Reacher" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
       
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/dfmPbyeZZSz3bekeESvMJaH91gS.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(41, 14, 14, 0.3))'}}/>
                
                <div className="spotlight-content">
                
                 
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/kYtNJOwCs7jcGRxLH9IUklAVAXc.svg"/></h2>
                
                
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">SCI-FI</span>
                    <span className="genre a">ACTION</span>
                  </p>
                  <h5 className="genre a"> SHOW | 05 MAR 2021 </h5> <h5 className="genre a"> 86%</h5>
                  </div>
                  
                  <p className="spotlight-overview">Mark Grayson is a normal teenager except for the fact that his father is the most powerful superhero on the planet. Shortly after his seventeenth birthday, Mark begins to develop powers ..</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/95557')}>  <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(95557, "INVINCIBLE" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG-13</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/hmZnqijPaaACjenDkrbWcCmcADI.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(26, 51, 96, 0.34))'}}/>
                
                <div className="spotlight-content">
                              
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/t5mbFmw6IH69nqi2Xdt0zSaikeG.png"/></h2>
                    <div className="spotty">
                       
                   <p className="spotlight-genres">
                       <span className="genre a">DRAMA</span>
                    </p>    
               
                    <h5 className="genre a"> MOVIE | 20 DEC 2024 </h5> <h5 className="genre a"> 71%</h5>
                    </div>
                  <p className="spotlight-overview"> Escaping post-war Europe, visionary architect László Toth arrives in America to rebuild his life, his work, and his marriage to his wife Erzsébet after being forced apart during wartime by shifting borders and regimes. On his own in a strange new country, </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/549509')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 549509, " the brutalist")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                    </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/cVh8Af7a9JMOJl75ML3Dg2QVEuq.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(141, 50, 11, 0.36))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/hPBv7wPNhtDDmWJzReybVPqfkzt.png"/></h2>
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">ADVENTURE</span>
                    <span className="genre a">FAMILY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 28 DEC 2024 </h5> <h5 className="genre a"> 64%</h5>
                </div>
                  <p className="spotlight-overview">

Mufasa, a cub lost and alone, meets a sympathetic lion named Taka, the heir to a royal bloodline. The chance meeting sets in motion an expansive journey of a group of misfits searching for their destiny.

</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/762509')}>  <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 762509, "Mufasa The Lion King")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
         
           
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
              <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/sc1abgWNXc29wSBaerrjGBih06l.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgba(255, 185, 229, 0.15)'}}/>
              
                <div className="spotlight-content">
                              

                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/vGpzm4eeKLZzIn70CmmfLragiUa.png"/></h2>
                
                  
                  
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">HORROR</span>
          
                    <span className="genre a">THRILLER</span>
                    <span className="genre a">SCI-FI</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 22 JAN 2025 </h5> <h5 className="genre a"> 71%</h5>
                </div>
                  
                  <p className="spotlight-overview">During a weekend getaway at a secluded lakeside estate, a group of friends finds themselves entangled in a web of secrets, deception, and advanced technology. As tensions rise and loyalties are tested, they uncover unsettling truths about themselves </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1084199')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1084199, "companion" )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/AdGdjsogmPLZMrY3YfpPw7dhaCQ.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(15, 13, 96, 0.35))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/iuCgpPWt4TZF1rwWyhHBK0XRycV.png"/></h2>
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">HORROR</span>
                    <span className="genre a">ACTION</span>
                    <span className="genre a">FANTASY</span>
                    <span className="genre a">ROMANCE</span>
                    <span className="genre a">SCI-FI</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 13 FEB 2025 </h5> <h5 className="genre a"> 78%</h5>
               </div>
                  <p className="spotlight-overview">Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/950396')}>  <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 950396, " the gorge")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>

          
             <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/wwARk7hRIfHfh2n2ubN6N7lvTne.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.5rem rgba(9, 35, 18, 0.47))'}}/>
                
                <div className="spotlight-content">
                
            
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/yhHEba7O7ZB2kPBVavtvjeJ7iO7.png"/></h2>
                
              
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">HORROR</span>
                    <span className="genre a">THRILLER</span>
                    
                  </p>
                  <h5 className="genre a"> MOVIE | 04 JAN 2025 </h5> <h5 className="genre a"> 69%</h5>
                  </div>
                  
                  <p className="spotlight-overview"> With his marriage fraying, Blake persuades his wife Charlotte to take a break from the city and visit his remote childhood home in rural Oregon. As they arrive at the farmhouse in the dead of night, they're attacked by an unseen animal and</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/710295')}> <i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 710295 , "wolf man")}>  <i className='bx bx-play'></i> Watch Now</Button></div>
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
           <SwiperSlide  >
            <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/q3Rgy4pQlPBou8ilYaVdHmjylyV.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(30, 30, 30, 0.52)'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/yQHdfdKHhymh5a49urg8qyiOMjw.png"/></h2>
                
                  
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ACTION</span>
                    <span className="genre a">CRIME</span>
                    <span className="genre a">THRILLER</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 01 JAN 2025 </h5> <h5 className="genre a"> 68%</h5>
               </div>
                  <p className="spotlight-overview">

Big Nick is back on the hunt in Europe and closing in on Donnie, who is embroiled in the treacherous and unpredictable world of diamond thieves and the infamous Panther mafia, as they plot a massive heist of the world's largest diamond exchange.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/604685')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 604685, "Den of Thieves pantera")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide >
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/x9ilTQBUn2GPULANbnUQy26bPvK.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(0, 138, 162, 0.2))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/w3VxtldVo4c77jBxVtJBGH4ps3f.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">ADVENTURE</span>
                    <span className="genre a">FAMILY</span>
                    <span className="genre a">COMEDY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 04 DEC 2024 </h5> <h5 className="genre a"> 63%</h5>
               </div>
                  <p className="spotlight-overview">After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1241982')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1241982, "Moana 2")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          
         
          
          
           <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/fYnEbgoNCxW9kL0IgOgtJb9JTBU.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 255, 252, 0.3))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/wpGrTiLVoBAR2qsbCN0W4KFBPs2.png"/></h2>
                  
              
                
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">DRAMA</span>
                    <span className="genre a">FANTASY</span>
                    <span className="genre a">HORROR</span>

                  </p>
                  <h5 className="genre a"> MOVIE | 04 NOV 2024 </h5> <h5 className="genre a"> 67%</h5>
               </div>
                  
                  <p className="spotlight-overview">A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, causing untold horror in its wake.</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/426063')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 426063, "Nosferatu")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/rRLQRYOkAPKqs2mL4IYKdntwUgr.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 3rem rgba(255, 0, 0, 0.2))'}}/>
                
                <div className="spotlight-content">
                               
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/hituKZkdeiqCpYIfsFRNUbWIVjZ.png"/></h2>
                  
              
      
                  <div className="spotty">
                  <p className="spotlight-genres">
                    
                    <span className="genre a">ACTION</span>
                    <span className="genre a">FAMILY</span>
                    <span className="genre a">SCI-FI</span>

                  </p>
                  <h5 className="genre a"> MOVIE | 04 DEC 2024 </h5> <h5 className="genre a"> 72%</h5>
                </div>
                  
                  <p className="spotlight-overview">Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek out an  </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/939243')}><i className='bx bx-info-circle'></i> </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 939243, "Sonic 3")}>  <i className='bx bx-play'></i> Watch Now</Button>
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
            {history.length > 7 && (
      <div className="alignerbuttsco">
      <button className="leftgia" onClick={() => handleScrollLeft(historyRef)}>
        <i className="bx bx-left-arrow-alt" style={{fontSize : '25px'}}></i>
      </button>
      <button className="rightgia"  onClick={() => handleScrollRight(historyRef)}>
        <i className="bx bx-right-arrow-alt" style={{fontSize : '25px'}}></i>
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
                  height: "2.2px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  marginTop: "0.1rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(to right,rgb(255, 0, 47),rgb(107, 2, 255))",
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
            </div>
        </div>
      </>
      
    );
};
export default Spotlight;

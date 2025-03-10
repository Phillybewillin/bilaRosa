import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay , Pagination ,Mousewheel , FreeMode ,} from "swiper/modules";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/autoplay';
import { EffectCoverflow } from "swiper/modules";

import "swiper/scss/effect-coverflow";
const Spotlight = () => {
  
             const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;


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
      slidesPerView={4}
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
              <h1 className="spotlight-number">R</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/vh5FIqfosYaLWxCmZfSPjgUWWfn.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(214, 7, 7, 0.26))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/a4FM8iWOafaGIpHPcNDtit290tV.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">HORROR</span>
                    <span className="genre a">COMEDY</span>
                    <span className="genre a">MYSTERY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 06 FEB 2025 </h5> <h5 className="genre a"> 62%</h5>
                  </div>
                  <p className="spotlight-overview">
                  When the "Heart Eyes Killer" strikes Seattle, a pair of co-workers pulling overtime on Valentine's Day are mistaken for a couple by the elusive couple-hunting killer. Now, they must spend the most 
</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1302916')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1302916, "Heart eyes")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/864XHE8HbkeNiegmMQCmsjHcMBm.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0rem 1rem 2rem rgba(14, 165, 165, 0.26))'}}/>
                
                <div className="spotlight-content">
                                
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/xYo2LM6iYg1lsxWImV9IWewa0oz.png"/></h2>
                
                  
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                    <span className="genre a">ANIMATION</span>
                    <span className="genre a">COMEDY</span>
                    <span className="genre a">FAMILY</span>
                  </p>
                  <h5 className="genre a"> MOVIE | 03 MAR 2025 </h5> <h5 className="genre a"> 71%</h5>
                  </div>
                  <p className="spotlight-overview">
                  Plankton's tangled love story with his sentient computer wife goes sideways when she takes a stand — and decides to destroy the world without him.
</p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/movie/1104845')}>  <i className='bx bx-info-circle'></i></Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1104845, "PLANKTON the movie")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
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
                <h1 className="spotlight-number">TV-MA</h1>
                <img loading='lazy' src={'https://image.tmdb.org/t/p/original/jmcRdwSOb1Bo1snMtxTSWOqbvgR.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(195, 121, 56, 0.25))'}}/>
                
                <div className="spotlight-content">
                
                 
                  <h2 className="spotlight-name"><img loading='lazy' className="spotim" src="https://image.tmdb.org/t/p/w500/dfqnNvicjlul2LAZzet1AePHIAg.png"/></h2>
                
               
                
                 
                  <div className="spotty">
                  <p className="spotlight-genres">
                  
                   
                  <span className="genre a">DRAMA</span>
                  <span className="genre a">ACTION</span>
                  <span className="genre a">MYSTERY</span>
              

                </p>
                  <h5 className="genre a"> SHOW | 01 JAN 2025 </h5> <h5 className="genre a"> 86%</h5>
               </div>
                  
                  <p className="spotlight-overview">In 1991 Miami, Dexter Morgan transitions from student to avenging serial killer. When his bloodthirsty urges can't be ignored any longer, Dexter must learn to channel his inner darkness. With the guidance of his father, Harry, he adopts a Code designed to help him find and kill people who deserve to be eliminated from society without getting on law enforcements' radar. This is </p>
                  <div className="spotty">
                  <Button className="spotlight-watch-btn" onClick={() => navigate('/tv/219937')}> <i className='bx bx-info-circle'></i>  </Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 219937, "Dexter original sin" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
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
                <img loading='lazy' src={'https://image.tmdb.org/t/p/w1280/rRLQRYOkAPKqs2mL4IYKdntwUgr.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(255, 0, 0, 0.14))'}}/>
                
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
          
            
            <div className="alignerbutts">
            <div className="butts" ref={navigationPrevRef} ><i className='bx bxs-left-arrow'></i></div>
            <div className="butts" ref={navigationNextRef} ><i className='bx bxs-right-arrow'></i></div>
          
            </div>
            </Swiper>
        </div>
      </>
      
    );
};
export default Spotlight;

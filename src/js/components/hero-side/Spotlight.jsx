import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay , Pagination} from "swiper/modules";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/autoplay';
const Spotlight = () => {
  const sliderRef = useRef(null);
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
    const navigate = useNavigate();
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
        
          <Swiper
            ref={sliderRef}
            spaceBetween={20}
            slidesPerView={4}
            lazy={true}
            preloadImages={false}
            navigation={{
              // Both prevEl & nextEl are null at render so this does not work
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onSwiper={(swiper) => {
              // Delay execution for the refs to be defined
              setTimeout(() => {
                // Override prevEl & nextEl now that refs are defined
                swiper.params.navigation.prevEl = navigationPrevRef.current
                swiper.params.navigation.nextEl = navigationNextRef.current
      
                // Re-init navigation
                swiper.navigation.destroy()
                swiper.navigation.init()
                swiper.navigation.update()
              })
            }}
            loop = {true}
            slideToClickedSlide = {true}
            speed={500}
            pagination={{ clickable: true }}
            modules={[Navigation , Autoplay , Pagination]}
            className="swiper"
            //cssMode = {true}
            grabCursor = {true}
            autoplay={{ delay: 7000 }}
          > 
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/v9acaWVVFdZT5yAU7J2QjwfhXyD.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(12, 237, 204, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .1</h4>
                
                  <h2 className="spotlight-name">WILD ROBOT</h2>
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Animation & Family </span>
                          <span className="genre a">Science Fiction</span>

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Animation</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview"> After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh ....</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1184918')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1184918, "WILD ROBOT")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                    </div>
              </div>
            </SwiperSlide>
          <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 0, 0, 0.3)'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1</h4>
                
                  <h2 className="spotlight-name">ALIEN ROMULUS</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Horror</span>
                    <span className="genre a">SCI-FI</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/945961')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 945961, "Alien Romulus")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
              <img src={'https://image.tmdb.org/t/p/w1280/32DyfprhjiqVmJbdtLRaVo5gzyr.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgba(54, 122, 181, 0.4)'}}/>
              <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2</h4>
              

                  <h2 className="spotlight-name">THE SUBSTANCE</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Horror</span>
          
                    <span className="genre a">Drama</span>
                    <span className="genre a">SCI-FI</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/933260')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 933260, "The Substance" )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/vbAIe8DgAfrhkfwK8uiujXQEIoZ.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(108, 75, 46, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3</h4>
               
                  <h2 className="spotlight-name">CADDO LAKE</h2>
                 
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Mystery</span>
                    <span className="genre a">Thriller</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">When an 8-year-old girl mysteriously vanishes, a series of past deaths and disappearances begins to link together. </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/863873')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 863873, "Caddo Lake")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
          
          <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/xi1VSt3DtkevUmzCx2mNlCoDe74.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(7, 41, 75, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3</h4>
                
                  <h2 className="spotlight-name">BEETLEJUICE BEETLEJUICE</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Comedy</span>
                    <span className="genre a">Horror</span>
                    <span className="genre a">Fantasy</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">After a family tragedy, three generations of the Deetz family return home to Winter River. Still haunted by Betelgeuse, Lydia's life is turned upside down when her teenage daughter, Astrid, accidentally opens the portal to the Afterlife...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/917496')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(917496, "Beetlejuice Beetlejuice")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/original/gFsheBr0csPaUja8aGrv4gTpyRI.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(137, 48, 50, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3</h4>
                
                  <h2 className="spotlight-name">DEADPOOL & WOLVERINE</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Thriller</span>
                    <span className="genre a">Horror</span>
                    <span className="genre a">Crime</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him..</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/533535')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(533535, "DEADPOOL & WOLVERINE")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/iKfYhpMqcpJgXqciWZOIZRRJDF6.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 255, 255, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .4</h4>
                 
                  <h2 className="spotlight-name">UZUMAKI</h2>
                
                  <p className="spotlight-genres">
                    <span className="genre a">Animation</span>
                   
                    <span className="genre a">Mystery</span>
                   
                    <span className="genre a">Horror</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">ANIME</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">A town of people slowly go insane over increasing obsessions with spiral shapes: patterns in the clouds, everyday objects, hair, insects, skin....</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/93241')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(93241, "Uzumaki" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/4TdmuuwiIiKw3JOjIuhdgYxRXnN.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem  rgba(144, 101, 63, 0.4))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .4</h4>
                  
                  <h2 className="spotlight-name">THE PENGUIN</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Crime</span>
                    
                    <span className="genre a">Drama</span>


                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">SERIES</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Witness the The Penguin's rise to power in Gotham's criminal underworld in the aftermath of the Riddler killings.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/194764')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(194764, "The Penguin" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/l9Qwe6v1NzgOweld95NdegQ5jsO.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(28, 73, 89, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .5</h4>
                 
                  <h2 className="spotlight-name">FROM</h2>
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                   
                    <span className="genre a">Crime</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2022</h6>
                  </div>
                  
                  <p className="spotlight-overview">Unravel the mystery of a nightmarish town in middle America that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they mo...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/124364')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 124364, "FROM" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/3flYugGbVGB1gxdG9KBJyMqiPcm.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgba(93, 53, 18, 0.6))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .6</h4>
                
                  <h2 className="spotlight-name">OUTERBANKS</h2>
                  
                  <p className="spotlight-genres">
                       <span className="genre a">mystery</span>
                        <span className="genre a">Drama</span>
                        <span className="genre a">Action & Adventure</span>

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2020</h6>
                  </div>
                  <p className="spotlight-overview">Gyeongseong, 1945. In Seoul's grim era under colonial rule, an entrepreneur and a sleuth fight for survival and face a monster born out of human greed...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/100757')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(100757, "OUTERBANKS" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/8IMDPLdpEDTqKZZti2MIYTwBP7d.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(155, 112, 92, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .7</h4>
                 
                  <h2 className="spotlight-name">THE LORD OF THE RINGS: THE RINGS OF POWER</h2>
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                   
                    <span className="genre a">Action & Adventure</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Beginning in a time of relative peace, we follow an ensemble cast of characters as they confront the re-emergence of evil to Middle-earth. From the darkest depths of the Misty Mountains, to the majestic forests of Lin...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/84773')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 84773, "The Lord of the Rings: The Rings of Power" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
           
            
          
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgba(128, 0, 128, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .9</h4>
            
                  <h2 className="spotlight-name">INSIDE OUT 2</h2>
              
                  <p className="spotlight-genres">
                    <span className="genre a">Animation</span>
                    <span className="genre a">Comedy</span>
                    <span className="genre a">Family</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful....</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1022789')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 1022789, "Inside Out 2")}>  <i className='bx bx-play'></i> Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide>
            
           
            
            
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/original/eLlglZsphAtqknkMsS39gswYaRn.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(143, 143, 143, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .10</h4>
                
                  <h2 className="spotlight-name">TWISTERS</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Drama</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">As storm season intensifies, the paths of former storm chaser Kate Carter and reckless social-media superstar Tyler Owens collide when terrifying phenomena never seen before are unleashed.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/718821')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 718821, "Twisters")}>  <i className='bx bx-play'></i> Watch Now </Button>
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

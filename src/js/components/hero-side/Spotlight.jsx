import React  , { useEffect, useRef } from "react";
import { register } from "swiper/element";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay , Pagination} from "swiper/modules";
register(Swiper, Navigation, Pagination, Autoplay);
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
                <h1 className="spotlight-number">#1</h1>
                <img src={'https://image.tmdb.org/t/p/original/6PnnfODvQfEIAdJ5PbqYMXKdfwX.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0  1rem rgba(143, 161, 159, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1</h4>
                
                  <h2 className="spotlight-name">Borderlands</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Comedy</span>
                    <span className="genre a">Crime</span>
                    <span className="genre a">Science FIction</span>
                    
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6> <h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Returning to her home planet, an infamous bounty hunter forms an unexpected alliance with a team of unlikely heroes.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/365177')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 365177, "Borderlands" )}>Watch Now </Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#2</h1>
                <img src={'https://image.tmdb.org/t/p/original/ukewRnKD05Si7DkED2tSKBTXeEd.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(83, 42, 16, 0.557))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2</h4>
                  
                  <h2 className="spotlight-name">The Lord of the Rings: The Rings of Power </h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action & Adventure</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>
                    <span className="genre a">Drama</span>


                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">SERIES</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> Beginning in a time of relative peace, we follow an ensemble cast of characters as they confront the re-emergence of evil to Middle-earth. From the darkest depths of the Misty Mountains, to the majestic forests of Lindon...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/84733')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(84733, "The Lord of the Rings: The Rings of Power " ,1 ,1)}>Watch Now</Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#3</h1>
                <img src={'https://image.tmdb.org/t/p/original/p5kpFS0P3lIwzwzHBOULQovNWyj.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0  1rem rgba(255, 0, 0, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .3</h4>
                
                  <h2 className="spotlight-name">Trap</h2>
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Action</span>
                          <span className="genre a">Horror</span>
                      <span className="genre a">Crime</span>
                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview"> A father and teen daughter attend a pop concert, where they realize they are at the center of a dark and sinister event.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1032823')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1032823, "Trap")}>Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#4</h1>
                <img src={'https://image.tmdb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1rem rgba(128, 0, 128, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .4</h4>
            
                  <h2 className="spotlight-name">Inside Out 2</h2>
              
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
                  <Button className="btnprime" onClick={() => navigate('/movie/1022789')}>Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 1022789, "Inside Out 2")}>Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide>
            
          <SwiperSlide>
          
              <div className="spotlight-item">
              <h1 className="spotlight-number">#5</h1>

                <img src={'https://image.tmdb.org/t/p/original/Avtx5jsdPuDa091jvx2Lye3ygke.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(83, 42, 16, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">Spotlight .5</h4>
                
                  <h2 className="spotlight-name">LongLegs</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Crime</span>
                    <span className="genre a">Horror</span>
                    <span className="genre a">Thriller</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">In pursuit of a serial killer, an FBI agent uncovers a series of occult clues that she must solve to end his terrifying killing spree.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1226578')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1226578, "LongLegs")}>Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          
           
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#6</h1>
                <img src={'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(254, 65, 2, 0.557))'}} />
                <div className="fuck"></div>
                <div className="spotlight-container">
                 <div className="spotlight-content">
                 
                  <h4 className="spon">#Spotlight .6</h4>
                  
                  <h2 className="spotlight-name">Deadpool & Wolverine </h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Comedy</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/533535')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(533535, "Deadpool & Wolverine")}>Watch Now</Button>
                  </div>
                 </div> 
                </div>
                
              </div>
            </SwiperSlide>

          <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#7</h1>
                <img src={'https://image.tmdb.org/t/p/original/8UT3WWsmhH5o2hRWTLs5jYTJm4v.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1rem rgba(100, 167, 173, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .7</h4>
               
                  <h2 className="spotlight-name">Fly Me to the Moon</h2>
                 
                  <p className="spotlight-genres">
                    <span className="genre a">Romance</span>
                    <span className="genre a">&</span>
                    <span className="genre a">Comedy</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Sparks fly in all directions as marketing maven Kelly Jones, brought in to fix NASA's public image, wreaks havoc on Apollo 11 launch director Cole Davis' already difficult task of putting a man on the moon.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/956842')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(956842, "Fly Me to the Moon")}>Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#8</h1>
                <img src={'https://image.tmdb.org/t/p/original/A7MEYn25BeGGrleczbCLNaNb9D1.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(143, 143, 143, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight 8</h4>
                
                  <h2 className="spotlight-name">Twisters</h2>
                  
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
                  <Button className="btnprime" onClick={() => navigate('/movie/718821')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 718821, "Twisters")}>Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#9</h1>
                <img src={'https://image.tmdb.org/t/p/original/lOv9qYklDC8mpMvg1WI0sQsmfTk.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(255, 47, 179, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .9</h4>
              

                  <h2 className="spotlight-name">Despicable Me 4</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Animation & Comedy</span>
          
                    <span className="genre a">Family</span>
                    <span className="genre a">Action</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Gru and Lucy and their girls—Margo, Edith and Agnes—welcome a new member to the Gru family, Gru Jr.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/519182')}>Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 519182, "Despicable Me 4" )}>Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#10</h1>
                <img src={'https://image.tmdb.org/t/p/original/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1rem rgba(20, 63, 27, 0.557))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .10</h4>
                 
                  <h2 className="spotlight-name">House Of The Dragon</h2>
                
                  <p className="spotlight-genres">
                    <span className="genre a">Sci-Fi</span>
                    <span className="genre a">Fantasy</span>
                    <span className="genre a">Drama</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">The Targaryen dynasty is at the absolute apex of its power,with 15 dragons, they start to fall when A son's birth throws the kingdom into chaos as the rightful heir is challenged.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/94997')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(94997, "House Of The Dragon" ,1 ,1 )}>Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <div className="alignerbutts">
              <div ref={navigationPrevRef} ><i className='bx bxs-left-arrow'></i></div>
            <div ref={navigationNextRef} ><i className='bx bxs-right-arrow'></i></div>
          
            </div>
            </Swiper>
        </div>
      </>
      
    );
};
export default Spotlight;

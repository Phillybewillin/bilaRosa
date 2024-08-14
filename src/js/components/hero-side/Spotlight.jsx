import React from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay , Pagination } from "swiper/modules";
//import { TMDBIdToUrlId } from "@/backend/metadata/tmdb";
const Spotlight = () => {

    const navigate = useNavigate();
    const handleEpisodeClick = (id , title ,selectedSeason, episodeNumber) => {
      console.log(selectedSeason , episodeNumber);
      console.log(id , title  )
        //console.log('handlePlayer function called', id, title , selectedSeason , episodeNumber);

        if (title && id && selectedSeason && episodeNumber) {
            const encodedTitle = encodeURIComponent(title.replace(/ /g, '-').toLowerCase());
            console.log(`Navigating to: /watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            console.log(id, title );
        }
    };
    const handlePlayer = (itemId, itemName) => {
      console.log('handlePlayer function called', itemId, itemName);

      if (itemName && itemId) {
          const encodedTitle = encodeURIComponent(itemName.replace(/ /g, '-').toLowerCase());
          console.log(`Navigating to: /watch/${encodedTitle}/${itemId}`);
          navigate(`/watch/${encodedTitle}/${itemId}`);
          console.log(itemId);
      }
  };
    return (
      <>
        <div className="spotlight">
        
          <Swiper
            spaceBetween={5}
            slidesPerView={1}
            navigation = {true}
            //pagination={{ clickable: true }}
            modules={[Navigation , Autoplay  ]}
            className="spotlight-swiper"
            cssMode = {true}
            grabCursor = {true}

            autoplay={{ delay: 15000 }}
            style={{ "--swiper-navigation-position": "absolute",
              "--swiper-navigation-margin-top": "10px",
              "--swiper-navigation-margin-bottom": "20px",
              "--swiper-navigation-left": "auto",
              "--swiper-navigation-right": "10px",
              "--swiper-navigation-size": "35px",
              "--swiper-navigation-color": "#1eff00",
            "--swiper-navigation-background-color": "#000000",}}
          >  
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#1</h1>
                <img src={'https://image.tmdb.org/t/p/original/wsgni4E1UnBuvFouUUanSdniQi0.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1</h4>
                
                  <h2 className="spotlight-name">Twisters</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Drama</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
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
                <h1 className="spotlight-number">#2</h1>
                <img src={'https://image.tmdb.org/t/p/original/j02v9Ylr1lctZ2NmCUvSfSMlBGu.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2</h4>
                 
                  <h2 className="spotlight-name">House Of The Dragon</h2>
                
                  <p className="spotlight-genres">
                    <span className="genre a">Sci-Fi</span>
                    <span className="genre a">Fantasy</span>
                    <span className="genre a">Drama</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">The Targaryen dynasty is at the absolute apex of its power,with 15 dragons, they start to fall when A son's birth throws the kingdom into chaos as the rightful heir is challenged.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/94997')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(94997, "House Of The Dragon" ,1 ,1 )}>Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
         
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#3</h1>
                <img src={'https://image.tmdb.org/t/p/original/8UT3WWsmhH5o2hRWTLs5jYTJm4v.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3</h4>
               
                  <h2 className="spotlight-name">Fly Me to the Moon</h2>
                 
                  <p className="spotlight-genres">
                    <span className="genre a">Romance</span>
                    <span className="genre a">&</span>
                    <span className="genre a">Comedy</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
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
                <h1 className="spotlight-number">#4</h1>
                <img src={'https://image.tmdb.org/t/p/original/qOdR46ymkVXuhnpnL2cBdjqjvnA.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .4</h4>
  
                  <h2 className="spotlight-name">MaXXXine</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Crime</span>
                    <span className="genre a">Mystery</span>
                    <span className="genre a">Horror</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1023922')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1023922, "MaXXXine")}>Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#5</h1>
                <img src={'https://image.tmdb.org/t/p/original/lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .5</h4>
              

                  <h2 className="spotlight-name">Despicable Me 4</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Animation & Comedy</span>
          
                    <span className="genre a">Family</span>
                    <span className="genre a">Action</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
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
                <h1 className="spotlight-number">#6</h1>
                <img src={'https://image.tmdb.org/t/p/original/zaWcEOR1pL0pgv0g3TIAN7p4OXK.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .6</h4>
            
                  <h2 className="spotlight-name">A Quiet Place: Day 1</h2>
              
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Horror</span>
                    <span className="genre a">Thriller</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> Forty years after his unforgettable first case in Beverly Hills, Detroit cop Axel Foley returns to do what he does best: solve crimes and cause chaos.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/762441')}>Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 762441, "A Quiet Place: Day 1")}>Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#7</h1>
                <img src={'https://image.tmdb.org/t/p/original/eLrtC7aXWE2WpAQEmetVAmmGHX4.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .7</h4>
                
                  <h2 className="spotlight-name">Bad Boys: Ride or Die</h2>
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Action</span>
                          <span className="genre a">Comedy</span>
                      <span className="genre a">Crime</span>
                  </p>    
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview"> After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/573435')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 573435, "Bad Boys: Ride or Die")}>Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
           
           
            
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">#8</h1>
                <img src={'https://image.tmdb.org/t/p/original/mBZZn19lrNnzr1341z7rnZ7cdCh.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .8</h4>
                
                  <h2 className="spotlight-name">A Good Girl's Guide to Murder</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Mystery</span>
                    <span className="genre a">Crime</span>
                    
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Five years after the death of schoolgirl Andie Bell, Pippa Fitz-Amobi sets out to uncover what really happened to her. Sal Singh, Andie's boyfriend, admitted to the murder before taking his own life.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/218342')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(218342, "A Good Girl's Guide to Murder" ,1 ,1 )}>Watch Now </Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#9</h1>
                <img src={'https://image.tmdb.org/t/p/original/kpIYvbD8uEw4wsYryGHfZORKzVM.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .9</h4>
                  
                  <h2 className="spotlight-name">The Umbrella Academy</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action & Adventure</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>
                    <span className="genre a">Drama</span>


                  </p>
                  <div className="spotty">
                   <h6 className="genre a">SERIES</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> A dysfunctional family of superheroes comes together to solve the mystery of their father's death, the threat of the apocalypse and more.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/75006')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(75006, "The Umbrella Academy" ,1 ,1)}>Watch Now</Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#10</h1>
                <img src={'https://image.tmdb.org/t/p/original/1cVt0Tm7erwYT5lyae9vUkPr4XY.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .10</h4>
                  
                  <h2 className="spotlight-name">Solar Opposites</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Comedy</span>
                    <span className="genre a">Animation</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>

                  </p>
                  <div className="spotty">
                   <h6 className="genre a">SERIES</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2019</h6>
                  </div>
                  
                  <p className="spotlight-overview">A family of aliens from a much better world must take refuge in middle America after the destruction of their planet. Their mission: protect the Pupa, a living super computer that will one day evolve into its true form, consume them and terraform the Earth.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/97645')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(97645, "Solar Opposites" ,1 ,1 )}>Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
          
            
           
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">#11</h1>
                <img src={'https://image.tmdb.org/t/p/original/dNkLpb8aWhYo5mNoxkgaDkQeFxq.jpg'} alt='D2' className="spotlight-image" />
                <div className="spotlight-content">
                  <h4 className="spon">Spotlight .11</h4>
                
                  <h2 className="spotlight-name">Kingdom of The Planet Of The Apes</h2>
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Science-Fiction</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Action</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Apes, Caesar's legacy, now dominant. Harmony reigns, but shadows hide remnants of humanity. A tyrant ape threatens peace. A young ape's perilous journey forces a reckoning with the past, shaping the future for both species.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/653346')}>Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 653346, "Kingdom of The Planet Of The Apes")}>Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </>
      
    );
};
export default Spotlight;

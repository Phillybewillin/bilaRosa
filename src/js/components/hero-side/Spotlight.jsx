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
            spaceBetween={14}
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
            pointCursor = {true}
            autoplay={{ delay: 5000 }}
          > 
           <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/tv1Nl8KKTkY9jrFuxxvXvBhFpWB.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(0, 89, 98 , 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1 #TV</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/9FrP9EOEOCq4kWfEQk9zFjEKaRG.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Animation</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Sci-Fi & Fantasy </span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Adult animated series of original short stories which are set within the worlds of beloved video games. Each episode serves as a gateway to a new adventure, unlocking exciting worlds from beloved gaming classics and highly anticipated new titles.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/261579')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 261579, "Secret Level" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/original/bzajGtlHlqYfB21lOAzZFwYUQqG.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(143, 143, 143, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/f2j9DtQXZBYpfUJ6nyON258aHRe.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Sci-Fi</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/912649')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 912649, "Venom: The Last Dance")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/original/5HJqjCTcaE1TFwnNh3Dn21be2es.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(137, 73, 0, 0.564))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/l6NDr1BbCBoIzLYLvfP55fCUCrY.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Horror</span>
                    <span className="genre a">Thriller</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">Two young missionaries are forced to prove their faith when they knock on the wrong door and are greeted by a diabolical Mr. Reed, becoming ensnared in his deadly game of cat-and-mouse.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1138194')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1138194, "Heretic")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/jkyQBtr0dU0uIaovQs3xoXHP9kV.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 0, 0, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2 #TV</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/zuFnfprVt0r5qE2IBWN8ewhqhsb.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Mystery</span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">An unrivalled and highly elusive lone assassin, the Jackal, makes his living carrying out hits for the highest fee. But following his latest kill, he meets his match in a tenacious British intelligence officer who starts to track down the Jackal in a thrilling cat-and-mouse chase across Europe, leaving destruction in its wake.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/222766')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 222766, "The Day of The Jackal" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
           </SwiperSlide>
           
            
          <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/zO5xURaYgMX6WpXolp83zVk03Yh.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgb(151, 68, 84, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/tg1NueHwd4lCAwAlhUA2I0n2Ci8.png"/></h2>
                
                
                  <p className="spotlight-genres">
                    <span className="genre a">Animation</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>
                    <span className="genre a">Action & Adventure</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">TV</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2021</h6>
                  </div>
                  
                  <p className="spotlight-overview">Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions...</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/94605')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(94605, "Arcane" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/my5vBrkapsY131myRoQw0Nw0yQN.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgb(88, 60, 23, 0.5))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .4</h4>
                
                <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/zvONe1taIlwyuvZwL43CscDZhci.png"/></h2>
                
                
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Sci-Fi & Fantasy</span>
                        <span className="genre a">Drama</span>
                        

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">Ten thousand years before the ascension of Paul Atreides, sisters Valya and Tula Harkonnen establish the fabled sect and female order that would become known as the Bene Gesserit to control the future of humankind.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/90228')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 90228, "Dune: Prophecy" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/fQGrzO0Iwo7CO4b2zVdJLkcnhwK.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.9rem rgb(118, 97, 78 , 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .5</h4>
                
                <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/orJ5TfInOu5CzgFIDs4avqEg0wu.png"/></h2>
                
                
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Sci-Fi & Fantasy</span>
                        <span className="genre a">Drama</span>
                        

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2023</h6>
                  </div>
                  <p className="spotlight-overview">In a ruined and toxic future, a community exists in a giant underground silo that plunges hundreds of stories deep. There, men and women live in a society full of regulations they believe are meant to protect them.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/125988')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 125988, "Silo" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/a2fqompEWB2GFp9GOdlqLcfEFfw.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem  rgba(144, 101, 63, 0.4))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .6</h4>
                  
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/lB9cFSWjPkM6dIFHczhgMZvytwM.png"/></h2>
                
                  
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
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/original/v0Q2uYARIqui1sEBF0bCLJaliDI.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(30, 43, 49, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .7</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/vbipZWH60X3h8RJIIgBYdDsBXwu.png"/></h2>
                
                  
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
                <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/vcZfDONCxoOU7mosZEnkhYujBEG.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(240, 206, 36 ,0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .8</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/w2vlBpxCh5b66WzLSzEuKcxGvf7.png"/></h2>
                  
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
                <img src={'https://image.tmdb.org/t/p/original/6fHZOiH81U4lyMVKvAQ2wcMMy6W.jpg'} alt='D2' className="spotlight-image" style={{ filter: 'drop-shadow(0 0 2rem rgb(12, 115, 113, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .9</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/cy6WlTXPsAZEIfNK2laJiSETwb1.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Drama</span>
                    <span className="genre a">Crime</span>
                    <span className="genre a">Thriller</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">While struggling with his dual identity, Arthur Fleck not only stumbles upon true love, but also finds the music that's always been inside him. </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/889737')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 889737, "Joker 2")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/iHPIBzrjJHbXeY9y7VVbEVNt7LW.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(255, 255, 252, 0.2))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .10</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/yvAWvXkxoOHY2d27osPSV9WKgXO.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Animation & Action</span>
                    <span className="genre a">Family</span>
                    <span className="genre a">SCI-FI</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">The untold origin story of Optimus Prime and Megatron, better known as sworn enemies, but once were friends bonded like brothers who changed the fate of Cybertron forever. </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/698687')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 698687, "Transformers One")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
            <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 0, 0, 0.3)'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .11</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/jidOIShLmA0p0GXGJfac5KWyj5d.png"/></h2>
                
                  
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
                <img src={'https://image.tmdb.org/t/p/w1280/ju10W5gl3PPK3b7TjEmVOZap51I.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(212, 195, 187, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .12</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/u7TP0vJkif4Cn2K8wKl5QY0OGRs.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Horror</span>
                    <span className="genre a">Gore</span>
                    <span className="genre a">Thriller</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Five years after surviving Art the Clown's Halloween massacre, Sienna and Jonathan are still struggling to rebuild their shattered lives. As the holiday season approaches, they try to embrace the Christmas spirit and leave the hor </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1034541')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1034541, "Terrifier 3")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
          
         
          
           
           
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
              <img src={'https://image.tmdb.org/t/p/w1280/he0gbZJUSzjn33KfOaiJhRJjgXd.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgb(221, 126, 84, 0.4)'}}/>
              <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .13</h4>
              

                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/yXMt7AkV2W5sZsq8DtFZaBUupZS.png"/></h2>
                
                  
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
                <img src={'https://image.tmdb.org/t/p/w1280/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(7, 41, 75, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .14</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/61Z6mL60ltShU393JkgBawAaeCw.png"/></h2>
                
                  
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
                <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.5rem rgb(170, 161, 176,0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .15</h4>
            
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/h40hblm8J1if7T2CBMjCD85HwuD.png"/></h2>
                
              
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
                <h1 className="spotlight-number">TV-14</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/gc8PfyTqzqltKPW3X0cIVUGmagz.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(143, 143, 143, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .16</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/chw44B2VnLha8iiTdyZcIW0ZELC.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                   
                    <span className="genre a">Crime</span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2008</h6>
                  </div>
                  
                  <p className="spotlight-overview">Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/1396')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 1396, "Breaking Bad " ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
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

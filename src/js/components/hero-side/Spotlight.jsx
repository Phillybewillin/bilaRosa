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
          <div className="modalhome">
            <h1 className="homenama">~HOME~</h1>
          </div>
        
          <Swiper
            ref={sliderRef}
            spaceBetween={3}
            slidesPerView={4}
           // lazy={true}
           // preloadImages={false}
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
            speed={550}
            pagination={{ clickable: true }}
            modules={[Navigation , Autoplay , Pagination]}
            className="swiper"
            //cssMode = {true}
            //pointCursor = {true}
            autoplay={{ delay: 4500 }}
          > 
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/original/cVh8Af7a9JMOJl75ML3Dg2QVEuq.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(141, 50, 11, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .8 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/hPBv7wPNhtDDmWJzReybVPqfkzt.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Animation</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Family</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">

Mufasa, a cub lost and alone, meets a sympathetic lion named Taka, the heir to a royal bloodline. The chance meeting sets in motion an expansive journey of a group of misfits searching for their destiny.

</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/762509')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 762509, "Mufasa The Lion King")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide> 
           <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/original/AdGdjsogmPLZMrY3YfpPw7dhaCQ.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(33, 27, 71, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .10 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w1280/iuCgpPWt4TZF1rwWyhHBK0XRycV.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Horror</span>
                    <span className="genre a">Action</span>
                    <span className="genre a">Fantasy</span>
                    <span className="genre a">Romance</span>
                    <span className="genre a">Sci-Fi</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2025</h6>
                  </div>
                  <p className="spotlight-overview">Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/950396')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 950396, " the gorge")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>

          
             <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/original/wwARk7hRIfHfh2n2ubN6N7lvTne.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.5rem rgba(9, 35, 18, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .1 #MOVIES</h4>
            
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/yhHEba7O7ZB2kPBVavtvjeJ7iO7.png"/></h2>
                
              
                  <p className="spotlight-genres">
                    <span className="genre a">Horror</span>
                    <span className="genre a">Thriller</span>
                    
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2025</h6>
                  </div>
                  
                  <p className="spotlight-overview"> With his marriage fraying, Blake persuades his wife Charlotte to take a break from the city and visit his remote childhood home in rural Oregon. As they arrive at the farmhouse in the dead of night, they're attacked by an unseen animal and</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/710295')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 710295 , "wolf man")}>  <i className='bx bx-play'></i> Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/5OsiT39OiZNdD0v2LiAcI2TpSYj.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgba(26, 131, 193, 0.25))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .1.5 #TVSHOWS</h4>
                
                <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w1280/yyS1tALk7t3YdTNMOvR5gsnXINA.png"/></h2>
                
                
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Sci-Fi & Fantasy</span>
                        <span className="genre a">Drama</span>
                        

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2022</h6>
                  </div>
                  <p className="spotlight-overview">Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/95396')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 95396, "Severance" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/fOetFgvvZxMgH2TC0ULlIrpgosH.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgb(151, 68, 84, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1 #TVSHOWS</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/u02n5UaGbsryj5krKDch54XakgA.png"/></h2>
                
                
                  <p className="spotlight-genres">
                    <span className="genre a">Comedy & Drama</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>
                    <span className="genre a">Action & Adventure</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">TV</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2025</h6>
                  </div>
                  
                  <p className="spotlight-overview">Jae-yoon, a late military enlistee, and his girlfriend, Young-joo, break up over the phone over growing misunderstandings. But a zombie outbreak rocks the world. A national emergency is declared, a plane crashes in the city center, and Jae-yoon and his unit get trapped on top of a Seoul skyscraper. Young-joo risks the zombie-filled streets to find him. Can their love survive the apocalypse?

..</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/233742')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(233742, "Newtopia" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/dfmPbyeZZSz3bekeESvMJaH91gS.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(41, 14, 14, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2 #TVSHOWS</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/kYtNJOwCs7jcGRxLH9IUklAVAXc.svg"/></h2>
                
                
                  <p className="spotlight-genres">
                    <span className="genre a">Animation</span>
                    <span className="genre a">Sci-Fi & Fantasy</span>
                    <span className="genre a">Action & Adventure</span>
                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">TV</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2021</h6>
                  </div>
                  
                  <p className="spotlight-overview">Mark Grayson is a normal teenager except for the fact that his father is the most powerful superhero on the planet. Shortly after his seventeenth birthday, Mark begins to develop powers ..</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/95557')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(95557, "INVINCIBLE" ,1 ,1 )}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/rCTLaPwuApDx8vLGjYZ9pRl7zRB.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.9rem rgba(8, 46, 11, 0.5))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .4 #TVSHOWS</h4>
                
                <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/2SwIOcXZ4you4EjPCAw7IucCsgX.png"/></h2>
                
                
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Comedy</span>
                       <span className="genre a">Mystery</span>
                        <span className="genre a">Drama</span>
                        

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2021</h6>
                  </div>
                  <p className="spotlight-overview">Follow the exploits of various guests and employees at an exclusive tropical resort over the span of a week as with each passing day, a darker complexity emerges in these picture-perfect travelers, the hotel’s cheerful employees and the idyllic locale itself..</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/111803')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 111803, "the white lotus" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
       
           
            </SwiperSlide>
         
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img src={'https://image.tmdb.org/t/p/original/4drV6iluttgjZmU1Q0xDqjrBQ1.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.9rem rgba(252, 252, 252, 0.25))'}} />
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .1 #TVSHOWS</h4>
                
                <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/9REjxZW5p1ORYXEIY1tpfzm1GmM.png"/></h2>
                
                
                  
                  <p className="spotlight-genres">
                       <span className="genre a">Comedy</span>
                        <span className="genre a">Drama</span>
                        

                  </p>    
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Show</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2025</h6>
                  </div>
                  <p className="spotlight-overview">

Former high school lab partners Marshall and Frances begin to unravel a conspiracy involving big pharma and the federal government to suppress knowledge of a rare mushroom that may hold the key to curing all the world’s diseases.

</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('tv/228878')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 228878, "Common Side Efffects" ,1 ,1)}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                   </div>
              </div>
            </SwiperSlide>
           <SwiperSlide  >
            <div className="spotlight-item">
              <h1 className="spotlight-number">PG13</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/q3Rgy4pQlPBou8ilYaVdHmjylyV.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(30, 30, 30, 0.52)'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .1.5 #MOVIES</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/yQHdfdKHhymh5a49urg8qyiOMjw.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Crime</span>
                    <span className="genre a">Thriller</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2025</h6>
                  </div>
                  <p className="spotlight-overview">

Big Nick is back on the hunt in Europe and closing in on Donnie, who is embroiled in the treacherous and unpredictable world of diamond thieves and the infamous Panther mafia, as they plot a massive heist of the world's largest diamond exchange.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/604685')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 604685, "Den of Thieves pantera")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide >
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/x9ilTQBUn2GPULANbnUQy26bPvK.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(0, 138, 162, 0.2))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .2 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/w3VxtldVo4c77jBxVtJBGH4ps3f.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Animation</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Family</span>
                    <span className="genre a">Comedy</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1241982')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer(1241982, "Moana 2")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/original/jmcRdwSOb1Bo1snMtxTSWOqbvgR.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(195, 121, 56, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .5 #TVSHOWS</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/dfqnNvicjlul2LAZzet1AePHIAg.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                    <span className="genre a">Action & Adventure</span>
                    <span className="genre a">Mystery</span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">In 1991 Miami, Dexter Morgan transitions from student to avenging serial killer. When his bloodthirsty urges can't be ignored any longer, Dexter must learn to channel his inner darkness. With the guidance of his father, Harry, he adopts a Code designed to help him find and kill people who deserve to be eliminated from society without getting on law enforcements' radar. This is </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/219937')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 219937, "Dexter original sin" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
           </SwiperSlide>
          
          
           <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/fYnEbgoNCxW9kL0IgOgtJb9JTBU.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(255, 255, 252, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3 #Movies</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/wpGrTiLVoBAR2qsbCN0W4KFBPs2.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Drama</span>
                    <span className="genre a">Fantasy</span>
                    <span className="genre a">Horror</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her, causing untold horror in its wake.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/426063')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 426063, "Nosferatu")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
           
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG</h1>
                <img src={'https://image.tmdb.org/t/p/original/rRLQRYOkAPKqs2mL4IYKdntwUgr.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 1.5rem rgba(255, 0, 0, 0.14))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .4 #Movies</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/hituKZkdeiqCpYIfsFRNUbWIVjZ.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Action</span>
                    <span className="genre a">Family & Comedy</span>
                    <span className="genre a">SCI-FI</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek out an  </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/939243')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 939243, "Sonic 3")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide> 
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/original/A8HbTd0FemZyFCh5qvJFpHGiwF8.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(23, 200, 188, 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .5 #MOVIES</h4>
               
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/2aeZl6djCEQsoHHI2B8a5wU8J4s.png"/></h2>
                  
              
                  <p className="spotlight-genres">
                    
                    <span className="genre a">Romance</span>
                    <span className="genre a">Drama</span>
                    <span className="genre a">Thriller</span>

                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movies</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">A high-powered CEO puts her career and family on the line when she begins a torrid affair with her much younger intern.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/1097549')}><i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 1097549, "Baby Girl")}>  <i className='bx bx-play'></i> Watch Now</Button>
                  </div>
                 </div>
              </div>
            </SwiperSlide>
        
            
          <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-14</h1>
                <img src={'https://image.tmdb.org/t/p/original/1swj9HxDkjzsO3yHlSwRA38hMFN.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(132, 248, 255, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .3 #TVSHOWS</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/original/g8K4oyyWD5azNd7ij0Ca0Mmj7E9.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Animation</span>
                    <span className="genre a">Drama</span>
                    <span className="genre a">Sci-Fi & Fantasy </span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2023</h6>
                  </div>
                  
                  <p className="spotlight-overview">In the thick of the French Revolution, members of the so-called lower classes are rising up to fight inequality. Meanwhile, Richter Belmont senses a far grimmer and greater danger. He's picked up his family's long-held tradition of vampire hunting</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/123548')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 123548, "CastleVania Nocturne" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/original/qF0Cz2toMzc6JsDxproYuETyElT.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 1.5rem rgb(211, 71, 54 , 0.3))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon"> #Spotlight .6 #Movies</h4>
            
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/oeSUu0CjuohGO6oIiFkxn4xHbrt.png"/></h2>
                
              
                  <p className="spotlight-genres">
                    <span className="genre a">Music</span>
                    <span className="genre a">Drama</span>
                    <span className="genre a">Romance</span>
                    <span className="genre a">Fantasy </span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview"> In the land of Oz, ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda at Shiz University, and the two's unlikely friendship is tested as they begin to fulfill their respective destinies as Glinda the Good and the Wicked Witch of the .</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/402431')}> <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="btn" onClick={() => handlePlayer( 402431 , "wicked")}>  <i className='bx bx-play'></i> Watch Now</Button></div>
                  </div>
                 </div>
            </SwiperSlide>
           
           <SwiperSlide>
              <div className="spotlight-item">
                <h1 className="spotlight-number">TV-MA</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/3xF78MnaTAoX3hkygglbCUEywU.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(195, 121, 56, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .5 #TVSHOWS</h4>
                 
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/oXr4itsh8CCcqQhyeeuW5Xf7bjG.png"/></h2>
                
               
                
                  <p className="spotlight-genres">
                  
                   
                    <span className="genre a">Drama</span>
                    <span className="genre a">Action & Adventure</span>
                    <span className="genre a">Mystery</span>
                

                  </p>
                  <div className="spotty">
                   <h6 className="genre b">HD</h6><h6 className="genre a">Series</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  
                  <p className="spotlight-overview">Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.</p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/tv/93405')}> <i className='bx bx-info-circle'></i>  Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick( 93405, "Squid Game" ,1 ,1 )}> <i className='bx bx-play' ></i> Watch Now</Button>
                  </div>
                  </div>
              </div>
           </SwiperSlide>
          <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">R</h1>
                <img src={'https://image.tmdb.org/t/p/w1280/8mjYwWT50GkRrrRdyHzJorfEfcl.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgb(155, 112, 80, 0.35))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .7 #Movies</h4>
                
                  <h2 className="spotlight-name"><img className="spotim" src="https://image.tmdb.org/t/p/w500/jwXk1c2esVoEzVLplPiQubNVyFC.png"/></h2>
                
                  
                  <p className="spotlight-genres">
                    <span className="genre a">Action</span>
                    <span className="genre a">Adventure</span>
                    <span className="genre a">Drama</span>
                  </p>
                  <div className="spotty">
                  <h6 className="genre b">HD</h6><h6 className="genre a">Movie</h6><h5 className="genre a">Overview</h5><h6 className="genre a">2024</h6>
                  </div>
                  <p className="spotlight-overview">Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. </p>
                  <div className="spotty">
                  <Button className="btnprime" onClick={() => navigate('/movie/558449')}>  <i className='bx bx-info-circle'></i> Details</Button>
                  <Button className="spotlight-watch-btn" onClick={() => handlePlayer( 558449, "Gladiator II")}>  <i className='bx bx-play'></i> Watch Now </Button>
                  </div>
                  </div>
              </div>
            </SwiperSlide>
          
          <SwiperSlide>
              <div className="spotlight-item">
              <h1 className="spotlight-number">PG-13</h1>
                <img src={'https://image.tmdb.org/t/p/original/vZG7PrX9HmdgL5qfZRjhJsFYEIA.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(170, 38, 51, 0.25))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .9 #Movies</h4>
                
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
                <img src={'https://image.tmdb.org/t/p/original/v0Q2uYARIqui1sEBF0bCLJaliDI.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(30, 43, 49, 0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .8 #MOVIES</h4>
                
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
                <img src={'https://image.tmdb.org/t/p/w1280/vcZfDONCxoOU7mosZEnkhYujBEG.jpg'} alt='D2' className="spotlight-image" style={{filter: 'drop-shadow(0 0 2rem rgba(240, 206, 36 ,0.4))'}}/>
                <div className="fuck"></div>
                <div className="spotlight-content">
                <h4 className="spon">#Spotlight .11 #MOVIES</h4>
                
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
              <img src={'https://image.tmdb.org/t/p/w1280/lqoMzCcZYEFK729d6qzt349fB4o.jpg'} alt='D2' className="spotlight-image"  style={{filter: 'drop-shadow(0 0 2rem rgba(255, 255, 255, 0.4)'}}/>
              <div className="fuck"></div>
                <div className="spotlight-content">
                  <h4 className="spon">#Spotlight .12 #MOVIES</h4>
              

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

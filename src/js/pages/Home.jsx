import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';

import MovieList from '../components/movie-list/MovieList';
import { SwiperSlide , Swiper } from "swiper/react";
import{category , movieType , tvType} from '../api/tmdbApi';
import apiConfig from '../api/apiConfig';
import './home.scss';
import { ToastContainer } from 'react-toastify';
import MovieCard from '../components/movie-card/MovieCard';
import "swiper/css";
import { FreeMode,Navigation } from "swiper/modules";
import 'swiper/css/navigation';


const Home = () => {
  
   document.title = 'Welcome to ZillaXR • Home of Movies ';
    
    const [tv, setTv] = React.useState([]);
    const [moviesData, setMoviesData] = React.useState([]);

    const getTVresults = async (timewindow) => {
        const url = `https://api.themoviedb.org/3/trending/tv/${timewindow}?api_key=${apiConfig.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        setTv(data.results);
    }


     const getMovieresults = async (timewindow) => {
        const url = `https://api.themoviedb.org/3/trending/movie/${timewindow}?api_key=${apiConfig.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        setMoviesData(data.results);
    }

    React.useEffect(() => {
      getTVresults('day');
    
    }, []);
    React.useEffect(() => {
          getMovieresults('day');
      }, []);
   

    const navigate = useNavigate();
    const handleClick = (event, category, type) => {
        navigate(`/z/${category}?=${type}`, { replace: true });
    }
    const [continuWatching, setContinueWatching] = React.useState([]);
    const continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];

const handlecardClick = (id, category, title, poster_path) => {
    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) {
        continueWatching = [];
    }
    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
        continueWatching = [...continueWatching, { id, category, title, poster_path }];
        localStorage.setItem('ContinueWatching', JSON.stringify(continueWatching));
        //console.log(continueWatching);
    }
    navigate(`/${category === 'tv' ? 'tv' : 'movie'}/${id}`);
    //navigate(`/${category === 'tv' ? 'tv' : 'movie'}/${id}`);
}
    
    
    const handleDelete = (id) => {
        const newContinueWatching = continueWatching.filter(item => item.id !== id);
        localStorage.setItem('ContinueWatching', JSON.stringify(newContinueWatching));
        setContinueWatching(newContinueWatching);
    }
    const mySwiperConfig = {
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
        },
        
        
    }
    const clearContonurWatching = () => {
        localStorage.removeItem('ContinueWatching');
        setContinueWatching([]);
    }
   
    return (
        <>  
            
             <Spotlight/>
            <h4 className="continue-watching-title">Continue Watching</h4>
        <div className="continue_watchingcontainer" >
        
          
        <i className='bx bxs-brush-alt' onClick={clearContonurWatching} style={{color: "red",paddingLeft : '10px',cursor : 'pointer'}}></i>
        <div className="contin">
             {continuWatching && Array.isArray(continueWatching) && continueWatching.map((item  ) => (
       
          <div className="continuewatching " key={item.id}>
            
            <img
              loading='lazy'
              //className="continue-watching"
              src={`${apiConfig.w200Image(item.poster_path)}`}
              onClick={() => handlecardClick( item.id, item.category, item.title || item.name, item.poster_path)}
              alt={item.title}
              
            />
            <i
              onClick={() => handleDelete(item.id, item.title, item.poster_path, item.type)}
              className="bx bx-trash"
              style={{
                color: 'red',
                fontSize: '20px',
                cursor: 'pointer',
                position: 'absolute',
                top: '5px',
                right: '5px'
              }}
            ></i>
          </div>
    
      ))}
        </div>
     
      
        </div>
        
             <div className="container">
             <div className="section mb-3">
                    <div className="section-tit">
                        <p className='villa'> • TRENDING MOVIES <h6 className="catx">#Today's Trending Movies</h6></p>
                        <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.popular)}>view all--+</h5>
                    </div>
                    <div className="trendTV">
                    <Swiper
               {...mySwiperConfig}
               //grabCursor={true}
                spaceBetween={8}
                slidesPerView={"auto"}
                lazy={true}
                preloadImages={false}
                //mousewheel={ forceTouchEvents ? true : false}
                height={"100%"}
                direction={'horizontal'}
               navigation={true}
               //freeMode={true}
               cssMode={true}
               speed={100}
               

                modules={[FreeMode ,Navigation]}
        style={{
            //width: '100%',
            minHeight: '300px',
            "--swiper-navigation-position": "absolute",
            "--swiper-navigation-margin-top": "10px",
            "--swiper-navigation-margin-bottom": "20px",
            "--swiper-navigation-left": "auto",
            "--swiper-navigation-right": "10px",
            "--swiper-navigation-size": "35px",
            "--swiper-navigation-color": "#1eff00",
          }}  
                
            >
                <div>
            {moviesData.map((movie,im) => (

<div className="wrappwe" key={im} onClick={() => navigate(`/movie/${tv.id}`)}>
<SwiperSlide key={movie.id}>
<MovieCard key={movie.id} item={movie} category={category.movie}/>
</SwiperSlide>
</div>
              
            ))}
        </div>
            </Swiper>
            </div>
                </div>
            
            
                <div className="section mb-3">
                    <div className="section-tit">
                        <h3 className='villa'>• TRENDING TV SHOWS<h6 className="catx"> #Today's Trending TV shows</h6></h3>
                        <h5 className="bluez" onClick={(event) => handleClick(event, category.tv, tvType.popular)}>view all--+</h5>
                    </div>
                    <div className="trendTV">
                    <Swiper
             {...mySwiperConfig}
             //grabCursor={true}
              spaceBetween={8}
              slidesPerView={"auto"}
              lazy={true}
              preloadImages={false}
              //mousewheel={ forceTouchEvents ? true : false}
              height={"100%"}
              direction={'horizontal'}
             navigation={true}
             //freeMode={true}
             cssMode={true}
             speed={100}
             

             modules={[FreeMode ,Navigation]}
        style={{
            //width: '100%',
            minHeight: '300px',
            "--swiper-navigation-position": "absolute",
            "--swiper-navigation-margin-top": "10px",
            "--swiper-navigation-margin-bottom": "20px",
            "--swiper-navigation-left": "auto",
            "--swiper-navigation-right": "10px",
            "--swiper-navigation-size": "35px",
            "--swiper-navigation-color": "#1eff00",
          }}  
                
            >
                <div>
            {tv.map((tv ,it) => (

<div className="wrappwe" key={it} onClick={() => navigate(`/tv/${tv.id}`)}>
<SwiperSlide key={tv.id}>
<MovieCard key={tv.id} item={tv} category={category.tv}/>
</SwiperSlide>
</div>
              
            ))}
        </div>
            </Swiper>
            </div>
        
                </div>
                <div className="section mb-3">
                    <div className="section-tit">
                        <h3 className='villa'>POPULAR MOVIES <h6 className="catx"># Most Popular movies this year</h6></h3>
                        <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.upcoming)}>view all--+</h5>
                    </div>
                    <MovieList category={category.movie} type={movieType.popular} />
            </div>
               
                <div className="section mb-3">
                    <div className="section-tit">
                        <h3 className='villa'>• TOP RATED MOVIES <h6 className="catx">• Fan Favourites Movies</h6></h3>
                        <h5 className="bluez" onClick={(event) => handleClick(event, category.movie, movieType.top_rated)}>view all--+</h5>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated} />
                </div>
              
                <div className="section mb-3">
                    <div className="section-tit">
                        <h3 className='villa'>• TOP RATED TV SHOWS <h6 className="catx">• Fan Favourites Shows</h6></h3>
                        <h5 className="bluez" onClick={(event) => handleClick(event, category.tv, tvType.top_rated)}>view all+</h5>
                    </div>
                    <MovieList category={category.tv} type={tvType.top_rated} />
                </div>

            
            </div>
            <ToastContainer theme="dark" position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#1eff00' , color : 'white', borderRadius : '10px'}}/>
            <h3 className='villa'><h6 className="catx">•Share Zilla-XR•</h6></h3>
             
            <div className="infoo" style={{width: '100%', backgroundColor: 'white' , padding: '10px', textAlign: 'center',color : 'black',display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h4><a href="https://www.buymeacoffee.com/zillaxr.xyz" target="_blank" rel="noreferrer"><i class='bx bxs-basketball'></i></a> </h4></div>
        </>
    );
}

export default Home;

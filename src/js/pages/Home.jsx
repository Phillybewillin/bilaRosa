import React, { useEffect, useRef, useState , Suspense} from 'react';
import { useNavigate } from 'react-router-dom';
import Spotlight from '../components/hero-side/Spotlight';
import MovieList from '../components/movie-list/MovieList';
//import { FixedSizeList } from 'react-window'; // Import FixedSizeList from react-window
import { category, movieType, tvType } from '../api/tmdbApi';
import tmdbApi from '../api/tmdbApi';
import apiConfig from '../api/apiConfig';
import './home.scss';
import { toast, ToastContainer } from 'react-toastify';
import MovieCard from '../components/movie-card/MovieCard';
import BoxOffice from '../components/movie-list/BoxOffice';
import { UserAuth } from '../context/AuthContext';
import { useFirestore } from '../Firestore';
import '../pages/authpages/savedshows.scss'
import Button from '../components/button/Button';
const Home = () => {
 //document.title = 'Home ~ Viva la Zilla';

  // Top of your component
const listRef = useRef(null);        // Anime list
const Movieref = useRef(null);       // Movie list
    // Continue Watching section
const watchlistRef = useRef(null);   // Watchlist section
const Edref = useRef(null);
const mEdref = useRef(null);
  const { user } = UserAuth();
  
  const{ getWatchlist } = useFirestore();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [tv, setTv] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [continueWatching, setContinueWatching] = useState(
    JSON.parse(localStorage.getItem('ContinueWatching')) || []
  );
  const [editorsPicks , setEditorsPicks] = useState([])
  const [popula , setPopula]  = useState([])
  const navigate = useNavigate();
 
  const continueWatchingRef = useRef(null);
    const [recommendations, setRecommendations] = useState([]);
  const recentScrollRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const stored = localStorage.getItem('playerDataList');
      if (!stored) return;

      try {
        const parsed = Object.values(JSON.parse(stored))
          .filter(item => item?.id && item?.lastWatched)
          .sort((a, b) => b.lastWatched - a.lastWatched);

        if (!parsed.length) return;

        const recentItems = parsed.slice(0, 2);
        const allRecs = [];

        for (const item of recentItems) {
          const { id, seasonNumber, lastEpisode } = item;
          if (!id) continue;

          const type = seasonNumber && lastEpisode ? 'tv' : 'movie';

          try {
            const res = await tmdbApi.similar(type , id);
            if (Array.isArray(res.results)) {
              allRecs.push(...res.results);
            }
          } catch (err) {
            console.error(`Failed to fetch similar for ID ${id}`, err);
          }
        }

        if (!allRecs.length) return;

        const shuffled = allRecs.sort(() => Math.random() - 0.5);
        setRecommendations(shuffled);
      } catch (err) {
        console.error('Error processing localStorage for WatchNext:', err);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    if(!user){
      setIsLoading(false)
    }
    if (user?.uid) {
      getWatchlist(user?.uid)
      .then((data) => {
        const shuffledData = [...data];
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
        }
        setWatchlist(shuffledData);
        //setWatchlist(data);
       // console.log(movies, "tv", tv, "watchlist", watchlist.all);
     
      })

        .catch((err) => {
          toast.error('fuck , something wrong happened ')
          //console.log(err, "error getting Favourites");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.uid, getWatchlist]);
 
  const getTVresults = async (timewindow) => {
    const url = `https://api.themoviedb.org/3/trending/tv/${timewindow}?api_key=${apiConfig.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setTv(data.results);
  };

  const getMovieresults = async (timewindow) => {
    const url = `https://api.themoviedb.org/3/trending/movie/${timewindow}?api_key=${apiConfig.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setMoviesData(data.results);
  };

  const getEditorsPicks = async() =>{
    const similae = await tmdbApi.similar('tv', '60574' )
    const shuffleded = similae.results.sort(() => Math.random() - 0.5);
   
    setEditorsPicks(shuffleded)
   //console.log(poplar);
     
  }
  const getEditorsPickas = async () => {
    const params = {};
    const poplar = await tmdbApi.getMoviesList(movieType.popular, { params });
    const shuffledResults = poplar.results.sort(() => Math.random() - 0.5);
    
    setPopula(shuffledResults);
    //console.log(poplar);
  };

  



  // const getAnimeResults = async () => {
  //   const url = `https://api.jikan.moe/v4/seasons/now?sfw&limit=20`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   setAnime(data.data);
  // };
 
  useEffect(() => {
    // Fetch TV results
    getTVresults('day');
    getEditorsPicks();
    getEditorsPickas();
   // getAnimeResults();
    // Fetch movie results
    getMovieresults('day');
    //hasMounted.current = true;
  }, []);
  

  const handleCardClick = (id, category, title, poster_path) => {
    let continueWatchingList = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatchingList)) {
      continueWatchingList = [];
    }
    const foundItem = continueWatchingList.find((item) => item.id === id);
    if (!foundItem) {
      continueWatchingList = [...continueWatchingList, { id, category, title, poster_path }];
      localStorage.setItem('ContinueWatching', JSON.stringify(continueWatchingList));
    }
    navigate(`/${category === 'tv' ? 'tv' : 'movie'}/${id}`);
  };

  const handleDelete2 = (id) => {
    const newContinueWatching = continueWatching.filter((item) => item.id !== id);
    localStorage.setItem('ContinueWatching', JSON.stringify(newContinueWatching));
    setContinueWatching(newContinueWatching);
  };

  



 

 

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
  

  return (
    <>
      <Spotlight />

      
      {
      recommendations.length > 0 &&(
        <div className="section mb-3">
        <div className="section-tit"></div>
        <div className="trendMovie">
          <div className="spacegia">
            <div className="alignerbig">
              <button className="leftgia" onClick={() => handleScrollLeft(recentScrollRef)}>
                <i className="bx bx-left-arrow-alt" style={{ fontSize: '26px' }}></i>
              </button>
              <button className="rightgia" onClick={() => handleScrollRight(recentScrollRef)}>
                <i className="bx bx-right-arrow-alt" style={{ fontSize: '26px' }}></i>
              </button>
            </div>
  
            <div className="divconws">
              <h4 className="favaziwwr">You may also like</h4>
              <img
                className="backdrophome"
                src={apiConfig.w200Image(recommendations[0]?.poster_path)}
                alt=""
              />
              <i
                className="bx bx-pulse"
                style={{
                  fontSize: '22px',
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  opacity: '0.6'
                }}
              />
            </div>
          </div>
  
          <div className="movie-lists" ref={recentScrollRef}>
            {recommendations
              .filter(show => show.poster_path)
              .map(show => (
                <Suspense fallback={null} key={show.id}>
                  <MovieCard item={show} category={show.media_type} />
                </Suspense>
              ))}
          </div>
        </div>
      </div>
      )
    }

    <div className="trendmovue" style={{position : 'relative' , minWidth : '200px'}}>
    {   
     
          continueWatching.length > 0 && (
            <div className="spacegia">
                {
          continueWatching.length > 20 && (
            <div className="alignerbutts" >
            <button className="leftgia" style={{top : '-27px'}} onClick={() => handleScrollLeft(continueWatchingRef)}>
              <i className="bx bx-left-arrow-alt" style={{fontSize : '26px'}}></i>
            </button>
            <button className="rightgia" style={{top : '-27px' }} onClick={() => handleScrollRight(continueWatchingRef)}>
              <i className="bx bx-right-arrow-alt" style={{fontSize : '26px'}}></i>
            </button>
          </div>
            
          )
        }
       <div className="divconw">
            <h4 className="favaziwwr">Recently Viewed</h4>
            <i className="bx bx-history" style={{fontSize : '23px' , position : 'absolute' , right : '10px', top : '12px' , color : 'rgba(255, 255, 255, 0.7)'}}></i>
            
        </div>
      
      </div>
           
            
          )
        }
    


    <div className="continue_watchingcontainer" ref={continueWatchingRef}>
        
      
        <div className="contin">
          {continueWatching.map((item) => (
            <div className="continuewatching" key={item.id}>
              <img
                className="movieimage"
                loading='lazy'
                src={`${apiConfig.w200Image(item.poster_path)}`}
                onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                alt={item.title}
              />
              <p className="movietitle"  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
               >{item.category==='tv' ? 'Show' : 'Movie'}</p>
              <i
                onClick={() => handleDelete2(item.id)}
                className="bx bx-trash"
                style={{
                  color: 'rgba(0, 0, 0, 0.9)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '5px',
                  right: '1px'
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>

  
    </div>
    
   

       <div className="container">

      
         {/* Trending Movies Section */}
        <div className="section mb-3">
                <div className="section-tit">
            </div>
          <div className="trendMovie">
          <div className="spacegia">
          <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(Movieref)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(Movieref)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
</div>
<div className="divconws">
          <h4 className="favaziwwr">Trending Movies</h4>
          <img className="backdrophome" src={apiConfig.w200Image(moviesData[0]?.poster_path)} alt="" />
            <i className="bx bx-meteor" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' , opacity : '0.6'}}></i>
           
        </div>
          
        </div> 
        
   
        <div className="movie-lists" ref={Movieref}>
                           
                                         {
                   moviesData.filter(itemzmovie => itemzmovie.poster_path).map((itemzmovie, ia) => (
                         <Suspense fallback={null}>
                          
                           <MovieCard item={itemzmovie} category={category.movie} key={itemzmovie.id}/>
                         
                          
                         </Suspense>
                            
                    ))
                  }
                  </div>
          </div>
        </div>

        {/* Trending TV Shows Section */}
        <div className="section mb-3">
                 <div className="section-tit">
            </div>
          <div className="trendMovie">
            <div className="spacegia">
            <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(listRef)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(listRef)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
</div>
<div className="divconws">
<h4 className="favaziwwr">Trending Shows</h4>
          <img className="backdrophome" src={apiConfig.w200Image(tv[0]?.poster_path)} alt="" />
            <i className="bx bxs-bowling-ball" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' , opacity : '0.6'}}></i>
           
            </div>
   

          
        </div> 
            <div className="movie-lists" ref={listRef}>
                       
                                  {
            tv.filter(itemztv => itemztv.poster_path).map((itemztv, ia) => (
                  <Suspense fallback={null}>
                    
                    <MovieCard item={itemztv} category={category.tv} key={itemztv.id} />
                  
                 
                  </Suspense>
                     
             ))
           }
           </div>
          </div>
        </div>

        <div className="section mb-3">
                <div className="section-tit">
            </div>
          <div className="trendMovie">
          <div className="spacegia">
          <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(Edref)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(Edref)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
</div>
<div className="divconws">
          <h4 className="favaziwwr">Editors Picks </h4>
          <img className="backdrophome" src={apiConfig.w200Image(editorsPicks[0]?.poster_path)} alt="" />
            <i className="bx bxs-cat" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' , opacity : '0.6'}}></i>
           
        </div>
          
        </div> 
        
   
        <div className="movie-lists" ref={Edref}>
                           
                                         {
                   editorsPicks.filter(itemzmovied => itemzmovied.poster_path).map((itemzmovied, ia) => (
                         <Suspense fallback={null}>
                          
                           <MovieCard item={itemzmovied} category={category.tv} key={itemzmovied.id}/>
                         
                          
                         </Suspense>
                            
                    ))
                  }
                  </div>
          </div>
        </div>
      
        <div className="section mb-3">
                <div className="section-tit">
            </div>
          <div className="trendMovie">
          <div className="spacegia">
          <div className="alignerbig">
  <button className="leftgia" onClick={() => handleScrollLeft(mEdref)}>
    <i className="bx bx-left-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
  <button className="rightgia" onClick={() => handleScrollRight(mEdref)}>
    <i className="bx bx-right-arrow-alt" style={{fontSize : '26px'}}></i>
  </button>
</div>
<div className="divconws">
          <h4 className="favaziwwr">Popular Movies</h4>
          <img className="backdrophome" src={apiConfig.w200Image(popula[0]?.poster_path)} alt="" />
            <i className="bx bx-heart" style={{fontSize : '22px' , position : 'absolute' , right : '10px', top : '10px' , opacity : '0.6'}}></i>
           
        </div>
          
        </div> 
        
   
        <div className="movie-lists" ref={mEdref}>
                           
                                         {
                   popula.filter(itemzmovied => itemzmovied.poster_path).map((itemzmovied, ia) => (
                         <Suspense fallback={null}>
                          
                           <MovieCard item={itemzmovied} category={category.movie} key={itemzmovied.id}/>
                         
                          
                         </Suspense>
                            
                    ))
                  }
                  </div>
          </div>
        </div>
        { user && isLoading && (
        <div className="load">loading</div>
      )}
      {user && !isLoading && watchlist?.length > 0 && (
            <>
                <div className="alignerbutts" style={{position : 'relative'}} >
  <button className="left" style={{top : '-27px'}}  onClick={() => handleScrollLeft(watchlistRef)}>
    <i className="bx bx-left-arrow-alt"></i>
  </button>
  <button className="right" style={{top : '-27px'}} onClick={() => handleScrollRight(watchlistRef)}>
    <i className="bx bx-right-arrow-alt"></i>
  </button>
</div><div className="watchlisthome" style={{color : 'white'}} ref={watchlistRef}>
          

        <div className="divconw">
          <h4 className="favaziwwr"> From My Watchlist</h4>
          <img className="backdrophome" src={apiConfig.w200Image(watchlist[0]?.poster_path)} alt="" />
          <i class='bx bx-library' style={{fontSize : '30px' , position : 'absolute' , right : '10px', top : '10px'}}></i>
         
        </div>
            {
           watchlist.map((item, i) => 
              <div  
               key={i}
               className="watchlistcardhome"  onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
               >
                  
                  <div className="watchlistimgcontainer">
                  {
                      item ? (<img  className="watchlistimg" 
                      src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                      alt=""
                      
                      />) : (  <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular"  className="watchlistimg" />
                      </SkeletonTheme>
                      )
                    }
              </div>
              <div className="feature">
              
              <div className="featuretitlezi"> <h4 className="r">{item.title}</h4> </div>

                     
                 </div>
            
             </div>  
              
           )}
           </div>
            </>
           
      )}

        <BoxOffice />
        
      </div>
  </>
    );
}

export default Home;

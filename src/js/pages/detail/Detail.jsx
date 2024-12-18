import React ,{ useState, useEffect, Suspense } from 'react';
import{  useParams , useNavigate } from 'react-router-dom';
import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import Button ,{OutlineButton}  from '../../components/button/Button';
import {UserAuth} from "../../context/AuthContext";
import { useFirestore } from '../../Firestore';
//import {db} from "../../Firebase";
//import{arrayUnion , doc , updateDoc} from "firebase/firestore";
import './detail.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
const MovieCard = React.lazy(() => import('../../components/movie-card/MovieCard'));
const Seasons = React.lazy(() => import('./Seasons'));
const CastList = React.lazy(() => import('./CastList'));

const Detail = () => {
      
    const { category, id } = useParams();
    const [choice , setChoice ] = useState(false)
    const [title , setTitle ] = useState('');
    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);
    const [videos , setVideos] = useState([]);
    const {user} = UserAuth();
    const { addToWatchlist, checkIfInWatchlist , addToFavourites , checkIfInFavourites } = useFirestore();
    //const [iframeSrc, setIframeSrc] = useState(''); 
    const [ saved ,setSaved] = useState(false);
    const [like , setLike] = useState(false);
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, {params: {}});
      const similar = await tmdbApi.similar(category, id )
      setItem(response);
      setItems(similar)
     //console.log(response);
  }
  const saveShow = async (item) => {
      if (!user) {
        toast.error('Please log in to save a movie');
        return;
      }
  
      const data = {
        id: item?.id,
        title: item?.title || item?.name,
        category: category,
        poster_path: item?.poster_path,
        release_date: item?.release_date || item?.first_air_date,
        vote_average: item?.vote_average,
        //overview: details?.overview,
      };
  
      const dataId = item?.id?.toString();
      await addToWatchlist(user?.uid, dataId, data);
      const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
      setSaved(isSetToWatchlist);
    };
  
    useEffect(() => {
      if (!user) {
        setSaved(false);
        return;
      }
  
      checkIfInWatchlist(user?.uid, item?.id).then((data) => {
        setSaved(data);
      });
    }, [item, user, checkIfInWatchlist]);

    const AddfavShow = async(item) => {

        if (!user) {
          toast.error('Please log in to save a movie');
          return;
        }
    
        const data = {
          id: item?.id,
          title: item?.title || item?.name,
          category: category,
          poster_path: item?.poster_path,
          release_date: item?.release_date || item?.first_air_date,
          vote_average: item?.vote_average,
          //overview: details?.overview,
        };
        //console.log(data)
    
        const dataId = item?.id?.toString();
        await addToFavourites(user?.uid, dataId, data);
        const isSetToWatchlist = await checkIfInFavourites(user?.uid, dataId);
        setLike(isSetToWatchlist);
      };
    
      useEffect(() => {
        if (!user) {
            setLike(false);
            return;
          }

        if (item) {
          checkIfInFavourites(user?.uid, item?.id).then((data) => {
            setLike(data);
          });
        }
      }, [user, checkIfInFavourites , AddfavShow , item ]);
  
  const Images = async () => {
    const responsei = await tmdbApi.Images(category, id, {params: {}});
    const logoi = responsei.logos.find(itemu => itemu.iso_639_1.includes('en'));
    if (logoi) {
      setTitle(logoi.file_path);
    }
  // console.log(logoi);
}
  const getVideos = async () => {
    const res = await tmdbApi.getVideos(category, id);
   // console.log(res);
    const trailer = res.results.find(video => video.type === 'Trailer');
    if (trailer) {
      setVideos(trailer.key);
    } else {
        toast.error('No trailer found')
       console.log('No trailer found');
    }
}
  useEffect(() => {
   
    Images();
    getVideos();
    getDetail();
   
  }, [category, id]);

  useEffect(() => {
    document.title =  item ? `${item?.title || item?.name} - Watch it on ZillaXR` : 'Weed With a movie or TV Show - Watch it on ZillaXR';
    scrollToTop();
    
    //console.log('items:', items);
  }, [category, id , item]);

  

    const getGenreColor = (genre) => {
        switch (genre) {
            case 'Action':
                return 'red';
            case 'Horror':
                return 'black';
            case 'Adventure':
                return 'orange';
            case 'Drama':
                return 'crimson';
            case 'Animation':
                return 'aquamarine';
            case 'Fantasy':
                return ' #f505a1';
            case 'Science Fiction':
                return 'silver';
            case 'Romance':
                return 'red';
            case 'Comedy':
                return 'yellow';
            case 'Crime':
                return 'darkgrey';
            case 'Thriller':
                return 'grey';
            case 'Family':
                return 'gold';
            case 'Mystery':
                return 'brown';
            case 'War':
                return 'junglegreen';
            case 'History':
                return 'brown';
            case 'Music':
                return 'pink';
            case 'Western':
                return 'lightorange';
            case 'Documentary':
                return 'brown';
            case 'TV Movie':
                return 'aqua';
            case 'Foreign':
                return 'lightgreen';
            case 'Action & Adventure':
                return ' #05f5bd';
            case 'Science Fiction & Action':
                return 'lightblue';
            case 'Science Fiction & Horror':
                return '#052f01';
            case 'Sci-Fi & Fantasy':
                return '#5b07c0';
            case 'Horror & Thriller':
                return 'black';
            case 'Action & Thriller':
                return 'red';
            case 'Sci-Fi':
                return 'silver';
            case 'Horror & Mystery':
                return 'darkred';
            case 'kids':
                return 'pink';
            case 'Drama & Horror':
                return 'black';
            case 'War & Politics':
                return 'rgb(98, 65, 0)';

            default:
                return 'white';
        }
    }
    //const {user} = UserAuth();
  
   
   
  
        
        const navigate = useNavigate();
  
        const handlePlayer = (itemId, itemName) => {
         // console.log('handlePlayer function called', itemId, itemName);

          if (itemName && itemId) {
              const encodedTitle = encodeURIComponent(itemName.replace(/ /g, '-').toLowerCase());
              //console.log(`Navigating to: /watch/${encodedTitle}/${itemId}`);
              navigate(`/watch/${encodedTitle}/${itemId}`);
              //console.log(itemId, itemName);
          }
      };
      const releaseYear = item?.release_date || item?.first_air_date;
      const year = (new Date(releaseYear)).getFullYear();
    
      const voteAverage = item?.vote_average;
      const votePercentage = voteAverage * 10; // convert to percentage
    const getColor = (votePercentage) => {
      if (votePercentage >= 86) {
          return 'magenta';
      } else if (votePercentage >= 70) {
          return 'rgb(9, 255, 0)';
      } 
      else if (votePercentage >= 55) {
          return 'yellow';
      } else {
        return 'red';
      }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    };
    const handlescrolldown = () => {
        window.scrollTo({
            top: 500,
            behavior: 'smooth'
          });
    }
    const watchTrailer = () => {
        setChoice(true);
    }
    const cancelwatchTrailer = () => {
        setChoice(false);
    }
   
      
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const releaseDate = item?.release_date;
      if (releaseDate && new Date(releaseDate) > new Date()) {
        const intervalId = setInterval(() => {
          const today = new Date();
          const releaseDateObj = new Date(releaseDate);
          const diffTime = releaseDateObj - today;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
          setTimeLeft(`${diffDays} days ~ ${diffHours} hours ~ ${diffMinutes} minutes ~ ${diffSeconds} seconds`);
        }, 1000);
    
        return () => clearInterval(intervalId);
      }
    }, [item?.release_date]);

      

    return (
        <>
           <div className="bigman">
           {
                item && (
                    <>
                    
                       <div className="detail-container">
                       <>
                    <div className="banner" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',position: 'fixed', top: '0' , left: '0' , width: '100%' , height: '55vh'}}></div>
                    </>
                        <div className="movie-content">
                           <div className="movie-content__info">
                            <div className="titleholder">
                              
                              {
                                title ? (<img className="postertitle" src={apiConfig.w500Image(title)} alt="" />) : (<h2 className="title">
                                   {item.title || item.name} 
                                   </h2>)
                              }
                               <div className="languandr">
                               <div className="langu">
                               <div className="language"><i className="bx bx-world" style={{fontSize:'11px'}}></i> {item.original_language.toUpperCase()}</div>
                               <div className="language"><i className='bx bxs-calendar' style={{fontSize:'11px'}}></i>{Number.isNaN(year) ? '' : year}</div>
                                <div className="language"><i className="bx bx-time" style={{fontSize:'11px'}}></i>{item.runtime || item.episode_run_time}MIN</div>
                            
                                </div>
                                <div className="langu">
                                    {
                                        saved ? (
                                            <div className="languagezz" ><i class='bx bxs-add-to-queue' style={{fontSize:'17px'}} ></i> In thy Watchlist</div>
                               
                                        ):(
                                            <div className="languagez" onClick={() => saveShow(item)}><i class='bx bx-add-to-queue' style={{fontSize:'17px'}} ></i> Add To Watchlist</div>
                              
                                        )
                                    }
                                <div className="languagez">|</div>
                                {
                                        like ? (
                                            <div className="languagezz" ><i className='bx bxs-heart' style={{fontSize:'17px'}}></i></div>
                                        ):(
                                            <div className="languagez" onClick={() => AddfavShow(item)}><i className='bx bx-heart' style={{fontSize:'17px'}}></i></div>
                              
                                        )
                                    }
                               
                                
                                </div>  
                                </div>    
                             
                              
                               
                            </div>
                              
          
                               <div className="overviewz">
                                
                                 <p className="overviewz">{item.overview}</p>
                                 </div>
                               <div className="genres" >
                                {
                                    item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item" style={{borderColor:  getGenreColor(genre.name)}}>{genre.name}</span>
                                    ))
                                }
                               </div>
                               <div className="rating" style={{color: getColor(votePercentage.toFixed(0))}}>{votePercentage.toFixed(0)}%</div>
                               
                            
                               
                              {category === 'tv' && <Suspense fallback={null}>

                                 <Seasons category={category}
                              id={item.id} title={item.name || item.title}/> 
                            
                                </Suspense>
                              }
                              
                              {category === 'movie' && 
  <>
    {item.release_date && new Date(item.release_date) > new Date() ? (
      <div className="timeleft" >
        <p>Check back in {timeLeft}</p>
      </div>
    ) : (
      <div className="buttonz">
        <Button className='btn' onClick={handlescrolldown}>Recommendations</Button>
        <Button className="btn" onClick={() => handlePlayer(item.id, item.name || item.title)}> <i className='bx bx-play-circle'></i> Watch Now</Button> 
      </div>
    )}
  </>
} 

                                 
                           </div>
                        </div>

                        <div className="castdiv">
                            <div className="one">
                            <Button className='btn' onClick={watchTrailer}><i class='bx bx-joystick-alt'></i>  Trailer</Button>
                            <h4 className='titledetailz'>Actors</h4>
                                      
                            </div>
                       
                                       <div className="castdix">
                                      
                              
                                            <Suspense fallback={null}>
                                            <CastList id={item.id}/>
                                            </Suspense>
                                            
                                            
                                       </div>
                                       
                        </div>
                           
                       </div>
                       {
                        choice && (
                            <div className="choices" onClick={cancelwatchTrailer}>
                            <iframe
                            className='videoframe'
                         width="50%"
                         height="auto"
                     src={`https://www.youtube.com/embed/${videos}`}
                     title={item.name}
                     //ref={iframeRef}
                     frameBorder="0"
                     referrerpolicy="strict-origin-when-cross-origin" 
                     //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      ></iframe>
                            </div>
                        )
                       }
                      
                       {
                        items.results.length > 0 && (
                          <>
                           <div className="overviewz">
                                   <h3 className='titledetails'>Recommendations based on {item.title || item.name}</h3>
                      </div>
                       <div className="wrappwez">
                              
                       {
  items.results.filter(itemz => itemz.poster_path).map((itemz, ia) => (
    <div className="wrappwezs" key={ia} onClick={scrollToTop}>
        <Suspense fallback={null}>
      <MovieCard item={itemz} category={category} key={itemz.id} />
      </Suspense>
      {itemz.overview && <p className="overviewz">{itemz.overview}</p>}
    </div>
  ))
}
                           </div>
                          </>
                        )
                       }
                      
                       
                       <ToastContainer theme='dark' position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#ffffff' , color : 'white', borderRadius : '5px'}}/>
           
                    </>
                )
            }
           </div>
            
        </>
    );
}

export default Detail;

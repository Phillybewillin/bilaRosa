import React ,{ useState, useEffect, Suspense } from 'react';
import{  useParams , useNavigate , useLocation} from 'react-router-dom';
import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import Button ,{OutlineButton}  from '../../components/button/Button';
import {UserAuth} from "../../context/AuthContext";
import { useFirestore } from '../../Firestore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { motion } from 'motion/react';
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
    const [notLoaded, setNotLoaded] = useState(true);
   // const [productions , setProductions] = useState([]);
    const [videos , setVideos] = useState([]);
    const {user} = UserAuth();
    const { addToWatchlist, checkIfInWatchlist , addToFavourites , checkIfInFavourites , removeFromWatchlist , removeFromFavourites } = useFirestore();
    //const [iframeSrc, setIframeSrc] = useState(''); 
    const [ saved ,setSaved] = useState(false);
    const [like , setLike] = useState(false);
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, {params: {}});
      const similar = await tmdbApi.similar(category, id )
      setItem(response);
      setItems(similar)
      if(response){
       setNotLoaded(false);
      }
      
     //console.log(response);
  }

 
  const saveShow = async (item) => {
      if (!user) {
        toast.error('Access denied. Please logIn to add this to your Watchlist');
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
    }, [item, user, checkIfInWatchlist ]);

    const AddfavShow = async(item) => {

        if (!user) {
          toast.error('Access denied. Please logIn to add this to your favourites');
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
    //console.log(responsei);
    const logoi = responsei.logos.find(itemu => itemu.iso_639_1 === 'en' );
    //console.log( 'logoi', logoi);
    if (logoi) {
      setTitle(logoi.file_path);
     
    }
    else {
      setTitle('');
    }
   //console.log(logoi);
}
  const getVideos = async () => {
    const res = await tmdbApi.getVideos(category, id);
   // console.log(res);
    const trailer = res.results.find(video => video.type === 'Trailer');
    if (trailer) {
      setVideos(trailer.key);
    } else {
        //toast.error('No trailer found')
        setVideos(null);
       //console.log('No trailer found');
    }
}
  useEffect(() => {
    getDetail();
    Images();
    getVideos();
  }, [category, id ]);

  useEffect(() => {
    document.title = `${item?.title || item?.name} - Watch it on ZillaXR`;
    scrollToTop();
    
    //console.log('items:', items);
  }, [category, id , item]);
   
  const handleRemoveFromWatchlist = async (item) => {
    await removeFromWatchlist(user?.uid, item.id);
    setSaved(false);
  };
  
  const handleRemoveFromFavourites = async (item) => {
    await removeFromFavourites(user?.uid, item.id);
    setLike(false);
  };



  
  

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
                return 'rgb(255, 0, 170)';
            case 'Science Fiction':
                return 'rgb(206, 152, 102)';
            case 'Romance':
                return 'red';
            case 'Comedy':
                return 'yellow';
            case 'Crime':
                return 'brown';
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
            case 'Science Fiction':
              return 'purple';

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
      const absolutereleaseYear = new Date(releaseYear);
      
      console.log(absolutereleaseYear.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }));
      const year = (new Date(releaseYear)).getFullYear();
    
      const voteAverage = item?.vote_average;
      const votePercentage = voteAverage * 10; // convert to percentage
      const getColor = (votePercentage) => {
        if (votePercentage >= 86) {
          return '#9b59b6'; // Royal Purple for the best of the best
        } else if (votePercentage >= 70) {
          return '#2ecc71'; // Emerald Green for 70 and above
        } else if (votePercentage >= 60) {
          return '#f1c40f'; // Sunflower Yellow for 60 and above
        } else if (votePercentage >= 55) {
          return '#e67e22'; // Carrot Orange for 55 and above
        } else {
          return '#e74c3c'; // Red for lower ratings
        }
      };

     if (item?.title === 'Conclave') {
  return (
    <div>
      <h1>Item removed due to copyright issues</h1>
    </div>
  );
}
      

    const scrollToTop = () => {
      
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    };
    const handlescrolldown = () => {
        window.scrollTo({
            top: 1000,
            behavior: 'smooth'
          });
    }
    const watchTrailer = () => {
      if(videos !== null){
        setChoice(true);
      }
      else{
        toast.error('No trailer found for this one :(');
      }
        
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
    const formatRuntime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}H ${mins}`;
    };

    const handleGoBack = () => {
      navigate('/');
    };

// Overall ring dimensions (in rem)
const ringSize = 2; // Overall diameter in rem
const ringRadius = ringSize / 2; // 3rem radius
const bubbleCount = 14; // Number of bubbles

// Use -90 so that the filled part starts at the top
const baseAngle = -70;
// Convert vote percentage into degrees (100% → 360°)
const gradientAngle = votePercentage * 3.6;

let bubbles = [];
for (let i = 0; i < bubbleCount; i++) {
  // Generate a random angle only on the filled arc (from baseAngle to baseAngle + gradientAngle)
  const angle = baseAngle + Math.random() * gradientAngle;
  const rad = angle * (Math.PI / 180);
  
  // Compute starting position exactly at the ring's edge
  const startX = (ringRadius * Math.cos(rad)).toFixed(2) + 'rem';
  const startY = (ringRadius * Math.sin(rad)).toFixed(2) + 'rem';
  
  // Bubble size using CodePen logic (2 + random*4 rem) – you can adjust as needed.
  const sizeNum = .3 + Math.random() * 2;
  const size = sizeNum.toFixed(2) + 'rem';
  
  // Movement: bubbles "disintegrate" by moving further out.
  // Distance to move outward: 6 + random*4 rem.
  const distanceNum = 1 + Math.random() * 4;
  const moveX = (Math.cos(rad) * distanceNum).toFixed(2) + 'rem';
  const moveY = (Math.sin(rad) * distanceNum).toFixed(2) + 'rem';
  
  // Animation timing similar to CodePen: duration 2 + random*2 s; negative delay for continuous flow.
  const time = (2 + Math.random() * 4).toFixed(2) + 's';
  const delay = (-1 * (2 + Math.random() * 5)).toFixed(2) + 's';
  
  // Randomize the shape for organic blobs (borderRadius between 30% and 100%)
  const borderRadius = (10 + Math.random() * 40).toFixed(0) + '%';
  
  bubbles.push(
    <div
      key={i}
      className="bubble"
      style={{
        '--startX': startX,
        '--startY': startY,
        '--moveX': moveX,
        '--moveY': moveY,
        '--size': size,
        '--time': time,
        '--delay': delay,
        background: getColor(votePercentage.toFixed(0)),
        borderRadius: borderRadius,
      }}
    />
  );
}

// Create the ring fill using a conic gradient.
const color = getColor(votePercentage.toFixed(0));
const ringStyle = {
  background: `conic-gradient(${color} ${gradientAngle}deg, transparent ${gradientAngle}deg)`,
};

    return notLoaded ? (

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <SkeletonTheme  baseColor='#ffffff11'  highlightColor="#0d0d0d6c" speed={2} direction='rtl'>
        <Skeleton height={300}  width={900}  className='banner' style={{ margin: '5px' }}/>
       
        <div className="detail-container">
          
        <Skeleton height={60}  width={300} style={{ margin: '5px' }} className='postertitle'/>
        
          <Skeleton  width={60} style={{ margin: '5px' }} />
          <Skeleton  height={10} width={900} style={{ margin: '10px' }} />
          <Skeleton width={60} style={{ margin: '5px ' }} />
          <div className="slyy"  style={{ margin: '10px'  ,display:'flex' ,flexDirection:'row', gap:'10px'}}>
          <Skeleton width={60} style={{ margin: '10px 0' }} />
          <Skeleton width={60} style={{ margin: '10px 0' }} />
          <Skeleton width={60} style={{ margin: '10px 0' }} />
          </div>
          <Skeleton height={30} width={900} style={{ margin: '10px' }} />
          
        </div>
      </SkeletonTheme>
      </motion.div>
      
    ) : (
        <>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      > 
       
        <div className="bigman">
           {
                item && (
                    <>
                    
                       <div className="detail-container">
                      
                       <div className="goback">
                    <button onClick={handleGoBack} className='gobackbtn'><i class='bx bx-arrow-back'></i></button>
                    </div>
          
                    <div className="banner" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path)})`}}></div>
                  
                      <div className="trailller">

                     <Button className='btntrailer' onClick={watchTrailer}><i class='bx bx-joystick-alt'></i>Trailer</Button>
                         {category === 'movie' && 
  <>
    {item.release_date && new Date(item.release_date) > new Date() ? (
      <div className="timeleft" >
        <p>Check back in {timeLeft}</p>
      </div>
    ) : (
      <div className="buttonz">
        <Button className='btnprime' onClick={handlescrolldown}> <i className='bx bx-directions'></i><p className='btntext' ></p></Button>
        <Button className="btnplay" onClick={() => handlePlayer(item.id, item.name || item.title)}><i className='bx bx-play'></i>  Watch </Button> 
      </div>
    )}
  </>
}    
                     </div>
                        <div className="movie-content">
                           <div className="movie-content__info">
                            <div className="titleholder">
                              <div className="postertitlett">

                                 {
                               title && title !== null &&  title !== '' ? (<img className="postertitle" src={apiConfig.w1280Image(title)} alt="" />) : (<h2 className="title">
                                   {item.title || item.name} 
                                   </h2>)
                              }
                                 </div>
                             
                             
                               <div className="languandr">
                               <div className="langu2">
                               <div className="language"><i className="bx bx-world" style={{fontSize:'11px'}}></i>LANG | {item.original_language.toUpperCase()}</div>
                               <div className="language"> AIRED ON | {absolutereleaseYear.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}</div>
                              <div className="language"><i className="bx bx-time" style={{fontSize:'11px'}}></i> RUNTIME | { 
  category === 'movie' 
    ? item?.runtime ? formatRuntime(item.runtime) : 'N/A' 
    : item?.last_episode_to_air?.runtime || item?.next_episode_to_air?.runtime || 40 
} MIN</div>
                                </div>
                                <div className="langu">
                                    {
                                        saved ? (
                                            <div className="languagezz"  onClick={() => handleRemoveFromWatchlist(item)}><i class='bx bxs-add-to-queue' style={{fontSize:'17px'}} ></i> In my Watchlist</div>
                               
                                        ):(
                                            <div className="languagez" onClick={() => saveShow(item)}><i class='bx bx-add-to-queue' style={{fontSize:'17px'}} ></i> Add To Watchlist</div>
                              
                                        )
                                    }
                                <div className="languagez">|</div>
                                {
                                        like ? (
                                            <div className="languagezz" onClick={() => handleRemoveFromFavourites(item)}><i className='bx bxs-heart' style={{fontSize:'17px'}}></i></div>
                                        ):(
                                            <div className="languagez" onClick={() => AddfavShow(item)}><i className='bx bx-heart' style={{fontSize:'17px'}}></i></div>
                              
                                        )
                                    }
                               
                                
                                </div>  
                                </div>    
                             
                              
                               
                            </div>
                            <h4 className='sammzy'>SUMMARY</h4>
          
                               <div className="overviewz">
                                
                                
                                 <p className="overview">{item.overview}</p>
                                 </div>
                                 <h4 className='sammzy'>GENRES</h4>
                               <div className="genres" >
                                {
                                    item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item" style={{borderColor:  getGenreColor(genre.name)}}>{genre.name}</span>
                                    ))
                                }
                               </div>
                                 <div className="ratingpos">
                    <div className="rating-wrapper">
      <div className="rating-ring" style={ringStyle}>
        <div className="rating-content">
          {votePercentage.toFixed(0)} <div className="persus">%</div>
        </div>
        <div className="bubbles">
          {bubbles}
        </div>
      </div>
      {/* Hidden SVG filter to achieve the blob effect similar to the CodePen example */}
      <svg width="0" height="0">
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
    </div>
                    </div>
         
     <div className="prodcomp">
     <h4 className='sammzy'>PRODUCTION COMPANIES</h4>
                                {
                                    item.production_companies && item.production_companies.map((company, i) => (
                                      <div className="prodcontainer"key={i}>
                                          <img src={`https://image.tmdb.org/t/p/w45` + company.logo_path} className="prodcomp__img" alt="" />
                                     < p className="prodcomp__name">{company.name}</p>
                             
                                      </div>
                                       ))
                                }
                              
                               </div>
                            
                               
                              {category === 'tv' && <Suspense fallback={null}>

                                 <Seasons category={category}
                              id={item.id} title={item.name || item.title}/> 
                            
                                </Suspense>
                              }
                              
                             


                                 
                           </div>
                           <div className="castdiv">
                            <div className="one">
                            <h4 className='titledetailz'>THE CAST</h4>
                                      
                            </div>
                       
                                       <div className="castdix">
                                      
                              
                                            <Suspense fallback={null}>
                                            <CastList id={item.id}/>
                                            </Suspense>
                                            
                                            
                                       </div>
                                       
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
                           <div className="overviewx">
                                   <h3 className='titledetails'>Recommendations based on {item.title || item.name}</h3>
                      </div>
                       <div className="wrappwez">
                              
                       {
  items.results.filter(itemz => itemz.poster_path).map((itemz, ia) => (
    <div className="wrappwezs" key={ia} onClick={() => {scrollToTop(); setNotLoaded(true);}}>
        <Suspense fallback={null}>
      <MovieCard item={itemz} category={category} key={itemz.id} />
      </Suspense>
      {itemz.overview && <p className="overviewx">{itemz.overview}</p>}
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
      </motion.div>
           
            
        </>
    );
}

export default Detail;

import {useRef , useState, useEffect} from "react";
import { useNavigate, useParams} from "react-router-dom";

import axios from "axios";
import "./player.scss";
import '../detail/seasons.scss';
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
//import {Bars } from "react-loader-spinner";
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import { ToastContainer , toast } from "react-toastify";
import Select from 'react-select';

import { UserAuth } from "../../context/AuthContext";
import { useFirestore } from "../../Firestore";
import tmdbApi from "../../api/tmdbApi";
export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const { user } = UserAuth();
  const { addToWatchlist, checkIfInWatchlist , removeFromWatchlist, addToFavourites , checkIfInFavourites , removeFromFavourites } = useFirestore();
  const testurl = import.meta.env.VITE_FETCH_URL_TEST;
  const [itemData, setItemData] = useState([]);
 // const [playerSource, setPlayerSource] = useState(null);
  //const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [bgChanged, setbgChanged] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(season_number);
  //const [header , setHeader] = useState(null);
  //const [quality, setQuality] = useState("auto");
  const [totalEpisodes , setTotalEpisodes] = useState(0);
  const [totalseasons , settotalseasons] = useState(0);
 // const lastFetchArgs = useRef(null);
 const [ saved ,setSaved] = useState(false);
  const [like , setLike] = useState(false);
  //const [sources, setSources] = useState([]);
  const [Loading, setLoading] = useState(false);
  //const [errorMessage, setErrorMessage] = useState("");
 
  
  const navigate = useNavigate();
 // const location = useLocation();
 const category = season_number ? 'tv' : 'movie';
 const getDetail = async () => {
  const response = await tmdbApi.detail(category, id, {params: {}});
  //const similar = await tmdbApi.similar(category, id )
  setItemData(response);
  //setItems(similar)
 //console.log(response);
}
useEffect(() => {
  getDetail();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
}, []);





  useEffect(() => {
    if (title) {
      const decodedTitles = decodeURIComponent(title);
      const  decodedTitle = decodedTitles
        .replace(/-/g, ' ')
         .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
           .join(' ');
        document.title = ` Currently Watching ${decodedTitle} ദ്ദി ༎ຶ‿༎ຶ )`;

      if (season_number && episode_number) {
        document.title = ` Currently Watching ${decodedTitle} • S${currentSeason} • E${currentEpisode} ദ്ദി ༎ຶ‿༎ຶ )`;
      }
  
    }
   
    if (id && currentSeason) {
      
      fetchEpisodes(id, currentSeason);
    }
     
  }, [title, id, currentSeason ,currentEpisode]);


  useEffect(() => {
    if (id && season_number && episode_number) {
      const getseasons = async () => {
        const { data } = await axios.get(`${apiConfig.baseUrl}tv/${id}?api_key=${apiConfig.apiKey}`);
        const validSeasons = data.seasons.filter(({ air_date }) => air_date && new Date(air_date) <= new Date());
        setSeasons(validSeasons);
        settotalseasons(validSeasons.filter(season => season.season_number !== 0).length);
         //console.log(validSeasons.);
        setbgChanged(apiConfig.w200Image(validSeasons[0].poster_path))
   
    };

    getseasons();
    }
}, [id]);
  const fetchEpisodes = async (id , selectedSeason) => {
    if (id && selectedSeason) {
      try {
        const response = await axios.get(
          `${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`
        );
        //console.log(response.data.episodes);
        if (response.status === 404) {
          throw new Error("Episodes not found. Please check the season number.");
        }

        setEpisodeData(response.data.episodes);
        const releasedEpisodes = response.data.episodes.filter((episode) => episode.air_date && new Date(episode.air_date) <= new Date());

        setTotalEpisodes(releasedEpisodes.length);
        //console.log(releasedEpisodes.length);
      } catch (error) {
        //console.error("Failed to fetch episodes:", error);
        //setErrorMessage(error.message || "An unexpected error occurred.");
      }
    }
  };
  
  //saved shit 
  const saveShow = async (item) => {
    if (!user) {
      toast.error('Access denied. Please logIn to add this to your Watchlist');
      return;
    }

    const data = {
      id: itemData?.id,
      title: itemData?.title || itemData?.name,
      category: season_number ? "tv" : "movie",
      poster_path: itemData?.poster_path,
      release_date: itemData?.release_date || itemData?.first_air_date,
      vote_average: itemData?.vote_average,
      //overview: details?.overview,
    };

    const dataId = itemData?.id?.toString();
    await addToWatchlist(user?.uid, dataId, data);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
    setSaved(isSetToWatchlist);
  };

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }

    checkIfInWatchlist(user?.uid, itemData?.id).then((data) => {
      setSaved(data);
    });
  }, [itemData, user, checkIfInWatchlist ]);

  const AddfavShow = async() => {

      if (!user) {
        toast.error('Access denied. Please logIn to add this to your favourites');
        return;
      }
  
      const data = {
        id: itemData?.id,
        title: itemData?.title || itemData?.name,
        category: season_number ? "tv" : "movie",
        poster_path: itemData?.poster_path,
        release_date: itemData?.release_date || itemData?.first_air_date,
        vote_average: itemData?.vote_average,
        //overview: details?.overview,
      };
      //console.log(data)
  
      const dataId = itemData?.id?.toString();
      await addToFavourites(user?.uid, dataId, data);
      const isSetToWatchlist = await checkIfInFavourites(user?.uid, dataId);
      setLike(isSetToWatchlist);
    };
  
    useEffect(() => {
      if (!user) {
          setLike(false);
          return;
        }

      if (itemData) {
        checkIfInFavourites(user?.uid, itemData?.id).then((data) => {
          setLike(data);
        });
      }
    }, [user, checkIfInFavourites , AddfavShow , itemData ]);

    const handleRemoveFromWatchlist = async () => {
      await removeFromWatchlist(user?.uid, itemData.id);
      setSaved(false);
    };
    const handleRemoveFromFavourites = async () => {
      await removeFromFavourites(user?.uid, itemData.id);
      setLike(false);
    };
  
  const handleEpisodeClick = (episodeNumber , episodeUrl = null ) => {
    
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/\/\d+$/, `/${episodeNumber}`);
    window.history.pushState({}, '', url.toString());

    const watchHistory = localStorage.getItem('watchHistory');
    localStorage.setItem('lastClickedSeason', currentSeason);
 
   if (watchHistory) {
     const watchHistoryObj = JSON.parse(watchHistory);
     if (!watchHistoryObj[id]) {
       watchHistoryObj[id] = {};
     }
     if (!watchHistoryObj[id][currentSeason]) {
       watchHistoryObj[id][currentSeason] = [];
     }
     watchHistoryObj[id][currentSeason].push(episodeNumber);
     localStorage.setItem('watchHistory', JSON.stringify(watchHistoryObj));
   } else {
     const watchHistoryObj = {
       [id]: {
         [currentSeason]: [episodeNumber]
       }
     };
     localStorage.setItem('watchHistory', JSON.stringify(watchHistoryObj));
   }

   window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
    //setPlayerSource('');
    //setHeader("");
    //setLoading(true);
    //console.log(episodes.length);
    setCurrentEpisode(episodeNumber);
    setbgChanged(apiConfig.w200Image(episodeUrl))
 
  };
  const watchHistory = localStorage.getItem('watchHistory');
  const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
  const watchedEpisodes = currentSeason !== null && watchHistoryObj[id] && watchHistoryObj[id][currentSeason] ? watchHistoryObj[id][currentSeason] : [];
 
 
const handleSeasonClick = (seasonNumber) => {
  const url = new URL(window.location.href);
  const pathnameParts = url.pathname.split('/');
  pathnameParts[pathnameParts.length - 2] = seasonNumber;
  pathnameParts[pathnameParts.length - 1] = '1';
  url.pathname = pathnameParts.join('/');
  window.history.pushState({}, '', url.toString());
  localStorage.setItem(`lastClickedSeason_${id}`, seasonNumber);
 // setPlayerSource('');
 // setHeader("");
  setCurrentSeason(seasonNumber);
  setCurrentEpisode(1);
  //setLoading(true);
  //fetchEpisodes(id, currentSeason);
  
};
const [selectedOption, setSelectedOption] = useState(null);

const options = [
  { value: 'https://moviesapi.club/', label: 'GRANADILLA' },
  { value: 'https://vidlink.pro/', label: 'PINEBERRY' },
  { value: 'https://player.autoembed.cc/', label: 'WATERMELON' },
  { value: 'https://autoembed.pro/embed/', label: 'LEMON' },
  { value: 'https://player.autoembed.cc/embed/', label: 'STRAWBERRY' }, 
  { value: 'https://embed.su/embed/', label: 'GRAPE' },
  { value: 'https://vidsrc.cc/v2/embed/', label: 'CHERRY'},
  { value: 'https://vidsrc.me/embed/', label: 'KIWI' },
  { value: 'https://vidsrc.xyz/embed/', label: 'BANANA' },
  { value: 'https://play2.123embed.net/', label: 'ORANGE'},
  { value: 'https://flicky.host/embed/', label: 'COCONUT' },
  { value: 'https://vidbinge.dev/embed/', label: 'HALA' },
  
]

useEffect(() => {
  const storedValue = localStorage.getItem('lastSelectedOption');
  if (!storedValue || !options.find(option => option.value === storedValue)) {
    toast.info('Defaulting to Pineberry');
    localStorage.setItem('lastSelectedOption', 'https://vidlink.pro/');
  }
  
  if (storedValue) {
    const selectedOption = options.find((option) => option.value === storedValue);
    setSelectedOption(selectedOption);
    setIframeUrl(selectedOption.value);

  } else {
    setSelectedOption(options[0]);
    setIframeUrl(options[0].value);
  }
}, [localStorage]);

const handleSelect = (selectedOption) => {
  setSelectedOption(selectedOption);
  setIframeUrl(selectedOption.value);
  localStorage.setItem('lastSelectedOption', selectedOption.value);
};

 const handleBack = ( ) => {
    if(id && season_number && episode_number){
      navigate(`/tv/${id}`)
    }else{
      navigate(`/movie/${id}`);
    }
    
  };

  const handleHome = () => {
    navigate('/');
  };
  const handleSelectChange = (selectedOption) => {
    const baseUrl = selectedOption.value;
    setIframeUrl(baseUrl);
    setLoading(true);
  };
 // const [autoPlay, setAutoPlay] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('https://vidlink.pro/');
 //console.log(iframeUrl);
 const handleIframeSrc = () => {
  let src = '';
  if (iframeUrl === 'https://moviesapi.club/') {
    src = `${iframeUrl}tv/${id}-${currentSeason}-${currentEpisode}`;
  } else if (iframeUrl === 'https://vidlink.pro/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?poster=true&autoplay=false&icons=vid`;
  } else if (iframeUrl === 'https://autoembed.pro/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  }
  else if (iframeUrl === 'https://player.autoembed.cc/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  }else if (iframeUrl === 'https://player.autoembed.cc/') {
    src = `${iframeUrl}embed/tv/${id}/${currentSeason}/${currentEpisode}?server=6`;
  }
    else if (iframeUrl === 'https://vidsrc.cc/v2/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  } else if (iframeUrl === 'https://embed.su/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  } else if (iframeUrl === 'https://vidsrc.me/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  } else if (iframeUrl === 'https://vidsrc.xyz/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  } else if (iframeUrl === 'https://play2.123embed.net/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  }
  else if (iframeUrl === 'https://vidbinge.dev/embed/') {
    src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
  }
  else if (iframeUrl === 'https://flicky.host/embed/') {
    src = `${iframeUrl}tv/?id=${id}/${currentSeason}/${currentEpisode}`;
  }
   else {
    src = iframeUrl; 
  }
  return src;
};

const handlemovieIframeSrc = () => {
  let src = '';
  if (iframeUrl === 'https://moviesapi.club/') {
    src = `${iframeUrl}movie/${id}`;
  } else if (iframeUrl === 'https://vidlink.pro/') {
    src = `${iframeUrl}movie/${id}?poster=true&autoplay=false&nextbutton=true&icons=vid`;
  } else if (iframeUrl === 'https://player.autoembed.cc/embed/') {
    src = `${iframeUrl}movie/${id}`;
  }  else if (iframeUrl === 'https://autoembed.pro/embed/') {
    src = `${iframeUrl}movie/${id}`;
  }
  else if (iframeUrl === 'https://player.autoembed.cc/') {
    src = `${iframeUrl}embed/movie/${id}?server=6`;
  }
   else if (iframeUrl === 'https://vidsrc.cc/v2/embed/') {
    src = `${iframeUrl}movie/${id}`;
  } else if (iframeUrl === 'https://embed.su/embed/') {
    src = `${iframeUrl}movie/${id}`;
  } else if (iframeUrl === 'https://play2.123embed.net/') {
    src = `${iframeUrl}movie/${id}`;
  }
   else if (iframeUrl === 'https://vidsrc.me/embed/') {
    src = `${iframeUrl}movie/${id}`;
  } else if (iframeUrl === 'https://vidsrc.xyz/embed/') {
    src = `${iframeUrl}movie/${id}`;
  }else if (iframeUrl === 'https://vidbinge.dev/embed/') {
    src = `${iframeUrl}movie/${id}`;
  }
  else if (iframeUrl === 'https://flicky.host/embed/') {
    src = `${iframeUrl}movie/?id=${id}`;
  }
   else {
    src = iframeUrl; 
  }
  return src;
};

  
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <ErrorBoundary>
        <> 
        <ToastContainer theme="dark" fontSize="11px" position="top-right" autoClose={8000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} progressStyle={{ backgroundColor: '#00000', color: 'white', borderRadius: '5px' ,fontSize: '11px' }} />
      
          <div className="player-container" >
           
            
            <div className="episodes__iframe-container" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)',width : '100%', height : '100%'}}>
          

            {Loading ? (
        <div>Loading...</div>
      ) : (
        season_number && episode_number ? (
          <iframe
            className="episodes__iframe"
            src={handleIframeSrc()}   
            width={"100%"}  
            height={"100%"}
            frameBorder="0"
            allowFullScreen
            //sandbox
            referrerPolicy="origin"
            onLoad={handleIframeLoad}
         
          />
        ) : (
          <iframe
          src={handlemovieIframeSrc()}   
          className="episodes__iframe"
            width={"100%"}
            height={"100%"}
            frameBorder="0"
            allowFullScreen
            referrerPolicy="origin"
            //sandbox
            onLoad={handleIframeLoad}
          />
        ))}
       
        </div>
           
          </div>
          
          <div className="sertop">
          <div className="topbar">
            <div className="logozz" onClick={() => navigate('/')}>
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZILLAXR</h4> </div>
              <div className="menu">
              <div className="navih" onClick={handleHome}><i className="bx bx-home-alt-2" ></i></div>
              <div className="navi" onClick={handleBack}><i className='bx bx-left-arrow'></i></div>
            </div>
            {currentEpisode < totalEpisodes ? (
     <div className="rea" onClick={() => handleEpisodeClick(parseInt(currentEpisode) + 1)}>
   Up Next  ~ {itemData.name} ~  Episode {parseInt(currentEpisode) + 1}  <i className='bx bx-skip-next'></i>
      </div>
) :  (totalseasons > 1 && currentSeason < totalseasons ? (
  <div className="rea" onClick={() => handleSeasonClick(parseInt(currentSeason) + 1)}>
    Up Next ~ {itemData.name} ~ Season {parseInt(currentSeason) + 1}  Episode {parseInt(currentEpisode) + 1} <i className='bx bx-skip-next'></i>
  </div>
) : null)}
            <div className="watchlyst">
                                    {
                                        saved ? (
                                            <div className="languagezz"  onClick={() => handleRemoveFromWatchlist()}><i class='bx bxs-add-to-queue' style={{fontSize:'17px'}} ></i></div>
                               
                                        ):(
                                            <div className="languagez" onClick={() => saveShow()}><i class='bx bx-add-to-queue' style={{fontSize:'17px'}} ></i></div>
                              
                                        )
                                    }
                                <div className="languagez">|</div>
                                {
                                        like ? (
                                            <div className="languagezz" onClick={() => handleRemoveFromFavourites()}><i className='bx bxs-heart' style={{fontSize:'17px'}}></i></div>
                                        ):(
                                            <div className="languagez" onClick={() => AddfavShow()}><i className='bx bx-heart' style={{fontSize:'17px'}}></i></div>
                              
                                        )
                                    }
                               
                                
                                </div>  
            </div>
            <div className="servers">
              <h3 className="servertitle">Sources:</h3> 
              <div className="sources"> 
                
              <Select
       value={selectedOption}
       options={options}
       onChange={handleSelect}
       theme={(theme) => ({
      ...theme,
      
    
      borderRadius: 10,
      colors: {
        ...theme.colors,
        primary25: '#afafaf54',
        primary: '#38383879',
        neutral0 : '#00000a2',

       neutral5: 'grey',
       neutral10: '#38383879',
        neutral20: '#38383879',
neutral30: 'red',
neutral40: 'pink',
neutral50: '#a9a9a9',
neutral60: '#38383879',
neutral70: '#696969',
neutral80: '#505050',
neutral90: '#303030'
      },
    })}
  />
              </div>
            </div>
          </div>
          <div className="androidnext">
          {currentEpisode < totalEpisodes ? (
     <div className="reand" onClick={() => handleEpisodeClick(parseInt(currentEpisode) + 1)}>
   Up Next Episode {parseInt(currentEpisode) + 1} <h4 className="episodename">{itemData.name}</h4><i className='bx bx-skip-next'></i>
      </div>
) :  (totalseasons > 1 && currentSeason < totalseasons ? (
  <div className="reand" onClick={() => handleSeasonClick(parseInt(currentSeason) + 1)}>
    Up Next Season {parseInt(currentSeason) + 1} <h4 className="episodename"> Episode 1</h4><i className='bx bx-skip-next'></i>
  </div>
) : null)} 
          </div>
          <div className="seasons">
            
          
        <div className="seasons__content">
       
            {seasons && seasons.filter(item => item.season_number !== 0).map((item, i) => (
                <div className="seasons__list" key={i} onClick={() => handleSeasonClick(item.season_number)}>
                    <div className={`seas ${item.season_number == currentSeason ? "actively" : ""}`}
       >
                        <h4 className="seasons__name">Season {item.season_number}</h4>
                    </div>
                </div>
            ))}
        </div>
    </div>
  

          {episodes.length > 0 && (
      <div className="episode-selector" style={{backgroundImage: `url(${bgChanged})` , backgroundSize : 'cover'}}>
        <ul className="episode_list" >
          {episodes
            .filter(episode => new Date(episode.air_date) <= new Date()) // Filter out unreleased episodes
            .map((episode, index) => (
              <li
              key={index}
              className={`episodes_itemz ${
                (currentEpisode == episode.episode_number ? "actively" : "") +
                (watchedEpisodes.includes(episode.episode_number) ? " watchedd" : "")
              }`}
              onClick={() => handleEpisodeClick(episode.episode_number , episode.still_path)}
            >
              
                 E{episode.episode_number} <div className="s"></div>{episode.name}
                 {currentEpisode == episode.episode_number && (
                   <div className="watchnow">
                     <i className="bx bx-play"></i>
                   </div>
                 )}
                 {watchedEpisodes.includes(episode.episode_number) && (
            <div className="watchede-badge">
            
            <i className='bx bx-check-double'></i>
            </div>
            )}
              </li>
            ))}
        </ul>
      </div>
    )}

      
        </>
    </ErrorBoundary>
  );
}

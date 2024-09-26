import {useRef , useState, useEffect} from "react";
import { useNavigate, useParams} from "react-router-dom";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaProvider, Track , LocalMediaStorage } from '@vidstack/react';

import axios from "axios";
import "./player.scss";
import '../detail/seasons.scss';
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
import { ColorRing } from "react-loader-spinner";
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import { ToastContainer , toast } from "react-toastify";

export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const testurl = import.meta.env.VITE_CORS_URL;
   const [playerSource, setPlayerSource] = useState('');
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [bgChanged, setbgChanged] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(season_number);
  const [header , setHeader] = useState("");
  const [quality, setQuality] = useState("auto");
  const [totalEpisodes , setTotalEpisodes] = useState(0);
  const lastFetchArgs = useRef(null);

  //const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [errorMessage, setErrorMessage] = useState("");

  
  const navigate = useNavigate();
 // const location = useLocation();
  

  useEffect(() => {
    if (title) {
      const decodedTitles = decodeURIComponent(title);
      const  decodedTitle = decodedTitles
        .replace(/-/g, ' ')
         .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
           .join(' ');
        document.title = `${decodedTitle}`;

      if (season_number && episode_number) {
        document.title = `${decodedTitle} •S${currentSeason} •E${currentEpisode}`;
      }
  
    }
   
    if (id) {
      //fetchData(id, currentSeason, currentEpisode);
      fetchEpisodes(id, currentSeason);
    
    }
  }, [title, id, currentSeason ,currentEpisode]);


  useEffect(() => {
    const previousArgs = lastFetchArgs.current;
    let args = [id, currentSeason, currentEpisode];
    if (id && currentSeason && currentEpisode) {
      args = [id, currentSeason, currentEpisode];
    } else {
      args = [id];
    }
    if (!previousArgs || JSON.stringify(previousArgs) !== JSON.stringify(args)) {
      lastFetchArgs.current = args;
      fetchData(...args);
    }
  }, [currentSeason, currentEpisode]);
  const fetchData = async (showTMDBid, seasonNumber, episodeNumber) => {
     //console.log('fetchData called', showTMDBid, seasonNumber, episodeNumber);
    try {
       // Start loading
     
      let baseurl = `${testurl}/vidsrc?id=${showTMDBid}`;
      let additionalParams = "";

      if (seasonNumber && episodeNumber) {
        additionalParams = `&s=${seasonNumber}&e=${episodeNumber}`;
      }

      let url = baseurl + additionalParams + "&provider=flixhq";
     
     // console.log(url);
      const response = await axios.get(url);
      //console.log(response.data);
      const dataz = response.data;
      setLoading(false);
      setQuality("auto");
      if (response.status === 500) {
        
        throw new Error("Resource not found. try again later.");
        
      
      }
      setHeader(dataz?.data?.headers.Referer || "");

      const sourcesData = dataz?.data?.sources;
      //console.log(sourcesData);
      const initialSource = sourcesData.find(source => source.quality === quality);
      //console.log(initialSource.url);
      setPlayerSource(initialSource.url);
   
      setTextTracks(mapSubtitlesToTracks(dataz?.data?.subtitles));
       
      
      //console.log(dataz?.data?.subtitles);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to find any resource. Please try again later.");
      //console.error("Failed to fetch data:", error);
      //setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };
  //console.log(header);
  console.log(playerSource);
  const mapSubtitlesToTracks = (subtitles) => {
    //console.log(subtitles)
    if (!subtitles) {
      return [];
    }
    return subtitles.map((subtitle) => ({
      src: subtitle.url,
      label: subtitle.lang || '',
      kind: "subtitles",
    }));
  };
  useEffect(() => {
    const getseasons = async () => {
        const { data } = await axios.get(`${apiConfig.baseUrl}tv/${id}?api_key=${apiConfig.apiKey}`);
        const validSeasons = data.seasons.filter(({ air_date }) => air_date && new Date(air_date) <= new Date());
        setSeasons(validSeasons);
        //console.log(validSeasons);
        setbgChanged(apiConfig.w200Image(validSeasons[0].poster_path))
   
    };
    getseasons();
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
  
  const handleEpisodeClick = (episodeNumber , episodeUrl = null) => {
    
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/\/\d+$/, `/${episodeNumber}`);
    window.history.pushState({}, '', url.toString());
    //setPlayerSource('');
    setHeader("");
    setLoading(true);
    //console.log(episodes.length);
    setCurrentEpisode(episodeNumber);
    setbgChanged(apiConfig.w200Image(episodeUrl))
 
  };
 
const handleSeasonClick = (seasonNumber) => {
  const url = new URL(window.location.href);
  const pathnameParts = url.pathname.split('/');
  pathnameParts[pathnameParts.length - 2] = seasonNumber;
  pathnameParts[pathnameParts.length - 1] = '1';
  url.pathname = pathnameParts.join('/');
  window.history.pushState({}, '', url.toString());
 // setPlayerSource('');
  setHeader("");
  setCurrentSeason(seasonNumber);
  setCurrentEpisode(1);
  setLoading(true);
  //fetchEpisodes(id, currentSeason);
  
};

 const handleBack = ( ) => {
    if(id && season_number && episode_number){
      navigate(`/tv/${id}`)
    }else{
      navigate(-1);
    }
    
  };

  const handleHome = () => {
    navigate('/');
  };
  const [autoPlay, setAutoPlay] = useState(false);

const handleCanPlay = () => {
  setAutoPlay(false);
};


class CustomMediaStorage extends LocalMediaStorage {
  async getTime() {
    const storageKey = `zilla${id}${currentSeason}${currentEpisode}`; // Replace with your desired key
    const storedTime = window.localStorage.getItem(storageKey);
    if (storedTime) {
      return parseFloat(storedTime);
    } else {
      return null;
    }
  }

  async setTime(currentTime ) {
    const storageKey = `zilla${id}${currentSeason}${currentEpisode}`; // Replace with your desired key
    window.localStorage.setItem(storageKey, currentTime);
  }
}

// Provide the storage to the player via `storage` prop.
//player.storage = new CustomMediaStorage();
//const nextEpisode = parseInt(currentEpisode) + 1;
  
  return (
    <ErrorBoundary>
      {loading ? (
        <>
        <ColorRing
        visible={true}
        height="50"
        width="50"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#000000', '#ff0040', '#f8b26a', '#ffffff', '#16e5e9']}
        />
         </>
      ) : (
        <> 
          <div className="player-container">
            <div className="topbar">
            <div className="logozz" onClick={() => navigate('/')}>
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZillaXR</h4> </div>
              <div className="menu">
              <div className="navih" onClick={handleHome}><i className="bx bx-home" ></i></div>
              <div className="navi" onClick={handleBack}><i className='bx bx-undo'></i>Back to Details</div>
            </div>
            </div>
            

             <MediaPlayer
              title={`${document.title} `}
              src={{src: playerSource , type: 'application/vnd.apple.mpegurl' ,headers: header}}
              type="application/vnd.apple.mpegurl"
              id="player"
              headers={header}
              
              streamType="on-demand"
              load="eager"
              viewType='video'
              logLevel='debug'
              crossOrigin={"anonymous"}
              playsInline
              onHls
              preload="auto"
              onEnded={() => {
                const nextEpisode = currentEpisode + 1;
                if (nextEpisode <= totalEpisodes - 1) {
                  handleEpisodeClick(nextEpisode);
                }
              }}
              //onCanPlay={handleCanPlay}
              //onLoadedMetadata={handleCanPlay}
              storage={ new CustomMediaStorage()}
              autoPlay={autoPlay}
        
            >
         
             
              <MediaProvider>
         
                {textTracks.map(track => (
                  <Track {...track} key={track.src} />
                ))}
                <source src={playerSource}  type="application/vnd.apple.mpegurl" />
              </MediaProvider>
              <DefaultVideoLayout 


              icons={defaultLayoutIcons}
               />
             
            </MediaPlayer>
            <ToastContainer theme="light" fontSize="11px" position="top-right" autoClose={8000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} progressStyle={{ backgroundColor: '#00000', color: 'white', borderRadius: '5px' }} />
      
          </div>
          {currentEpisode < totalEpisodes ? (
  <div className="rea" onClick={() => handleEpisodeClick(parseInt(currentEpisode) + 1)}>
    Next Episode
  </div>
) : null}
          <div className="lights"></div>
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
                currentEpisode == episode.episode_number ? "actively" : ""
              }`}
              onClick={() => handleEpisodeClick(episode.episode_number , episode.still_path)}
            >
                {episode.episode_number}. {episode.name}
              </li>
            ))}
        </ul>
      </div>
    )}
      
        </>
      )}
    </ErrorBoundary>
  );
}



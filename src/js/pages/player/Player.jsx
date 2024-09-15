import { useRef , useState, useEffect} from "react";
import { useNavigate, useParams} from "react-router-dom";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaProvider, Track , LocalMediaStorage } from '@vidstack/react';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import axios from "axios";
import "./player.scss";
import '../detail/seasons.scss';
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
import { ColorRing } from "react-loader-spinner";
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const [playerSource, setPlayerSource] = useState([]);
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [bgChanged, setbgChanged] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(season_number);
  const [quality, setQuality] = useState("auto");
  const lastFetchArgs = useRef(null);

  //const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [errorMessage, setErrorMessage] = useState("");

  const testurl = import.meta.env.VITE_CORS_URL;
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
        document.title = `Watching ${decodedTitle}`;

      if (season_number && episode_number) {
        document.title = `Watching ${decodedTitle} • S${currentSeason} • E${currentEpisode}`;
      }
  
    }
   
    if (id && currentSeason) {
      fetchEpisodes(id, currentSeason);
    }
  }, [title, id, currentSeason ,currentEpisode]);

  useEffect(() => {
    if (id && currentSeason && currentEpisode) {
      const args = [id, currentSeason, currentEpisode];
      if (!lastFetchArgs.current || !arraysEqual(lastFetchArgs.current, args)) {
        lastFetchArgs.current = args;
        fetchData(id, currentSeason, currentEpisode);
      }
    } else {
      const args = [id];
      if (!lastFetchArgs.current || !arraysEqual(lastFetchArgs.current, args)) {
        lastFetchArgs.current = args;
        fetchData(id);
      }
    }
  }, [currentSeason, currentEpisode]);
  
  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }
  
  useEffect(() => {
    const getseasons = async () => {
        const { data } = await axios.get(`${apiConfig.baseUrl}tv/${id}?api_key=${apiConfig.apiKey}`);
        const validSeasons = data.seasons.filter(({ air_date }) => air_date && new Date(air_date) <= new Date());
        setSeasons(validSeasons);
        setbgChanged(apiConfig.w200Image(validSeasons[0].poster_path))
   
    };
    getseasons();
}, [id]);

  const fetchData = async (showTMDBid, seasonNumber, episodeNumber) => {
    try {
       // Start loading
      let baseurl = `${testurl}/vidsrc?id=${showTMDBid}`;
      let additionalParams = "";

      if (seasonNumber && episodeNumber) {
        additionalParams = `&s=${seasonNumber}&e=${episodeNumber}`;
      }

      let url = baseurl + additionalParams + "&provider=flixhq";
      const response = await axios.get(url);
      const dataz = response.data;

      if (response.status === 404) {
        //throw new Error("Resource not found. try again later.");
        setLoading(false);
      }

      const sourcesData = dataz?.data?.sources || [];
      //console.log(sourcesData);
        const initialSource = sourcesData.find(source => source.quality === quality);
      setPlayerSource(initialSource ? initialSource.url : "");
   
      setTextTracks(mapSubtitlesToTracks(dataz?.data?.subtitles));
       
      setLoading(false);
      //console.log(dataz?.data?.subtitles);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      //setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

   //console.log(playerSource);
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
      } catch (error) {
        //console.error("Failed to fetch episodes:", error);
        //setErrorMessage(error.message || "An unexpected error occurred.");
      }
    }
  };
  
  const handleEpisodeClick = (episodeNumber , episodeUrl) => {
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/\/\d+$/, `/${episodeNumber}`);
    window.history.pushState({}, '', url.toString());
    setLoading(true);
    setPlayerSource([]);
    setCurrentEpisode(episodeNumber);
    setbgChanged(apiConfig.w200Image(episodeUrl))
    //console.log(episodeUrl , apiConfig.w200Image(episodeUrl) ,episodeNumber);
    //fetchData(id, season_number, episodeNumber);
  };
 
const handleSeasonClick = (seasonNumber) => {
  const url = new URL(window.location.href);
  const pathnameParts = url.pathname.split('/');
  pathnameParts[pathnameParts.length - 2] = seasonNumber;
  pathnameParts[pathnameParts.length - 1] = '1';
  url.pathname = pathnameParts.join('/');
  window.history.pushState({}, '', url.toString());
  setPlayerSource([]);
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
  setAutoPlay(true);
};


class CustomMediaStorage extends LocalMediaStorage {
  async getTime() {
    const storageKey = `my-player-${id} -${currentSeason} -${currentEpisode}`; // Replace with your desired key
    const storedTime = window.localStorage.getItem(storageKey);
    if (storedTime) {
      return parseFloat(storedTime);
    } else {
      return null;
    }
  }

  async setTime(currentTime ) {
    const storageKey = `my-player-${id} -${currentSeason} -${currentEpisode}`; // Replace with your desired key
    window.localStorage.setItem(storageKey, currentTime);
  }
}

// Provide the storage to the player via `storage` prop.
//player.storage = new CustomMediaStorage();
  
  
  return (
    <ErrorBoundary>
      {loading ? (
        <ColorRing
        visible={true}
        height="50"
        width="50"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#ff0040', '#f8b26a', '#abbd81', '#16e5e9']}
        />
      ) : (
        <> 
          <div className="player-container">
            <div className="topbar">
            <div className="logozz">
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZillaXR</h4> </div>
              <div className="menu">
              <div className="navih" onClick={handleHome}><i className="bx bx-home" ></i></div>
              <div className="navi" onClick={handleBack}><i className='bx bx-undo'></i>Back to Details</div>
            </div>
            </div>
            

             <MediaPlayer
              //storage={`custom-storage-key-${id}-${season_number}-${episode_number}`} 
              title={document.title && season_number && episode_number ? `Currently ${document.title} ` : ` Currently ${document.title} ` }
              src={playerSource}
              id="player"
              streamType="on-demand"
              load="eager"
              viewType='video'
              logLevel='warn'
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              onLoadedMetadata={handleCanPlay}
              storage={ new CustomMediaStorage()}
              autoPlay={autoPlay}
             
            >
              
              <MediaProvider>
                {textTracks.map(track => (
                  <Track {...track} key={track.src} />
                ))}
              </MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons} />
             
            </MediaPlayer>
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



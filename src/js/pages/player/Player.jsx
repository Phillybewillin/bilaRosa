import React, { useState, useEffect , useRef } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaProvider, Track , LocalMediaStorage ,Menu ,useVideoQualityOptions} from '@vidstack/react';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import axios from "axios";
import "./player.scss";
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
import Button from "../../components/button/Button";
export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const [playerSource, setPlayerSource] = useState([]);
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [quality, setQuality] = useState("auto");
  //const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  //const customStorage = useRef(new CustomLocalMediaStorage());
 
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
        document.title = `Watching ${decodedTitle} - S${season_number} -E${currentEpisode}`;
      }
  
    }
   
    if (id) {
      fetchData(id, season_number, currentEpisode);
      fetchEpisodes(id, season_number);
    }
  }, [title, id, season_number, currentEpisode]);

  const fetchData = async (showTMDBid, seasonNumber, episodeNumber) => {
    try {
      setLoading(true); // Start loading
      let baseurl = `${testurl}/vidsrc?id=${showTMDBid}`;
      let additionalParams = "";

      if (seasonNumber && episodeNumber) {
        additionalParams = `&s=${seasonNumber}&e=${episodeNumber}`;
      }

      let url = baseurl + additionalParams + "&provider=flixhq";
      const response = await axios.get(url);
      const dataz = response.data;

      if (response.status === 404) {
        throw new Error("Resource not found. try again later.");
      }

      const sourcesData = dataz?.data?.sources || [];
      //const subtitles =  || [];

      //setPlayerSource(formattedSources(dataz?.data?.sources));
      //setQuality(dataz?.data?.sources?.map(source => source.quality));
      const initialSource = sourcesData.find(source => source.quality === quality);
      setPlayerSource(initialSource ? initialSource.url : "");

      setTextTracks(mapSubtitlesToTracks(dataz?.data?.subtitles));

      //console.log(dataz?.data?.subtitles);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const formattedSources = (sources) =>  {
    console.log(sources)

    return sources.map((source) => ({
      src: source.url,
      type: 'application/x-mpegURL',
      label: source.quality,
      default: source.quality === 'auto',
      
  }));

  }
  const mapSubtitlesToTracks = (subtitles) => {
    //console.log(subtitles)
    if (!subtitles) {
      return [];
    }
    return subtitles.map((subtitle) => ({
      src: subtitle.url,
      label: subtitle.lang || '',
      kind: "subtitles",
      //default: subtitle.lang === 'English',
      //srclang: subtitle.lang.toLowerCase().replace(/[^a-z]+/g, "-"), // simplified language tag
    }));
  };
  const fetchEpisodes = async (id, selectedSeason) => {
    if (id && selectedSeason) {
      try {
        const response = await axios.get(
          `${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`
        );

        if (response.status === 404) {
          throw new Error("Episodes not found. Please check the season number.");
        }

        setEpisodeData(response.data.episodes);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    }
  };

  const handleEpisodeClick = (episodeNumber) => {
    setCurrentEpisode(episodeNumber);
     const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    urlParts[urlParts.length - 1] = episodeNumber.toString();
    const newUrl = urlParts.join('/');
    window.history.pushState({}, '', newUrl );
    fetchData(id, season_number, episodeNumber);
  };


  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };
  class CustomLocalMediaStorage extends LocalMediaStorage {
    // Override the save method to customize what you store
    

    save(player) {
      let type = season_number && episodeNumber ? 'tv' : 'movie'; 
      const { id  } = useParams();
          const currentTime = player.currentTime;
        if (player.options && player.options.id && player.options.type) {
           player.options;
           player.currentTime;
        }
     
      let storageKey;
      if (type === 'movie') {
        storageKey = `movie-${id}`;
      } else if (type === 'tv') {
        const { season_number, episodeNumber } = player.options;
        storageKey = `show-${id}-s${season_number}e${episodeNumber}`;
      }
  
      // Store the current time in local storage
      localStorage.setItem(storageKey, JSON.stringify({ currentTime }));
    }
  
    // Override the load method to retrieve the custom data
    load(player) {
      const { id, type } = player.options;
  
      let storageKey;
      if (type === 'movie') {
        storageKey = `movie-${id}`;
      } else if (type === 'tv') {
        const { season_number, episodeNumber } = player.options;
        storageKey = `show-${id}-s${season_number}e${episodeNumber}`;
      }
  
      const storedData = localStorage.getItem(storageKey);
  
      if (storedData) {
        const { currentTime } = JSON.parse(storedData);
        return {
          currentTime: parseFloat(currentTime),
        };
      }
    }
  }


  
  return (
    <ErrorBoundary>
      {loading ? (
        <div id="spinner">
          
        </div>
      ) : errorMessage ? (
        <div className="error-message">
          <p className="error-text">No playerble resource found</p>
         
          <p className="error-text">{errorMessage}</p>
           <Button className="btnprime " onClick={handleHome}>Try another show</Button>
        </div>
      ) : (
        <> 
          <div className="player-container">
            <div className="menu">
              <div className="navih" onClick={handleHome}><i className="bx bx-home" ></i></div>
              <div className="navi" onClick={handleBack}><i className='bx bx-undo'></i>Back to Details</div>
            </div>

            <MediaPlayer
              title={document.title && season_number && episode_number ? `Currently ${document.title} ` : ` Currently ${document.title} ` }
              src={playerSource}
              id="player"
              load="eager"
              storage={new CustomLocalMediaStorage()}       
              playsInline
              crossOrigin=""
              autoQuality={true}
             
              preload="metadata"
               autoPlay={false}
             
            >
              
              <MediaProvider>
                {textTracks.map(track => (
                  <Track {...track} key={track.src} />
                ))}
              </MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons} />
             
            </MediaPlayer>
          </div>

         {episodes.length > 0 && ( <div className="episode-selector">
            <h4 className="episodes_title"><i class='bx bx-grid-horizontal ' ></i>Episodes</h4>
            <ul className="episode_list">
              {episodes.map((episode, index) => (
                <li
                  className={`episodes_itemz ${currentEpisode == episode.episode_number ? "actively" : ""}`}
                  key={index}
                  onClick={() => handleEpisodeClick(episode.episode_number)}
                >
                  {episode.episode_number}.  {episode.name}
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



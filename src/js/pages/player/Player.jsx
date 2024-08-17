import React, { useState, useEffect , useRef } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaProvider, Track , LocalMediaStorage} from '@vidstack/react';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import axios from "axios";
import "./player.scss";
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
import Button from "../../components/button/Button";
export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const [playerSource, setPlayerSource] = useState("");
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [quality, setQuality] = useState("auto");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  const testurl = import.meta.env.VITE_FETCH_URL_TEST;
  const navigate = useNavigate();
  const location = useLocation();
  

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
        document.title = `Watching ${decodedTitle} - S${season_number} -E${episode_number}`;
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

      setSources(sourcesData);

      const initialSource = sourcesData.find(source => source.quality === quality);
      setPlayerSource(initialSource ? initialSource.url : "");

      setTextTracks(mapSubtitlesToTracks(dataz?.data?.subtitles));

      console.log(dataz?.data?.subtitles);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const mapSubtitlesToTracks = (subtitles) => {
    console.log(subtitles)
    if (!subtitles) {
      return [];
    }
    return subtitles.map((subtitle) => ({
      src: subtitle.url,
      label: subtitle.lang || '',
      kind: "subtitles",
      srclang: subtitle.lang.toLowerCase().replace(/[^a-z]+/g, "-"), // simplified language tag
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
    const newUrl = `${location.pathname.split('?')[0]}?s=${season_number}&e=${episodeNumber}`;
    navigate(newUrl, { replace: true });
    fetchData(id, season_number, episodeNumber);
  };


  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleQualityChange = (selectedQuality) => {
    setQuality(selectedQuality);
    const newSource = sources.find(source => source.quality === selectedQuality);
    setPlayerSource(newSource ? newSource.url : playerSource);
  };
  
  return (
    <ErrorBoundary>
      {loading ? (
        <div id="spinner">
          
        </div>
      ) : errorMessage ? (
        <div className="error-message">
          <p className="error-text">{errorMessage}</p>
          <p className="error-text">No playerble resource found</p>
          <Button className="btnprime " onClick={handleBack}>Go Back</Button>
        </div>
      ) : (
        <>
          <div className="player-container">
            <div className="menu">
              <div className="navih" onClick={handleHome}> Home</div>
              <div className="navi" onClick={handleBack}><i className="bx bx-arrow-back"></i>Back to Details</div>
            </div>

            <div className="quality-selector">
              <label htmlFor="quality"><i className="bx bx-gear"></i></label>
              <select id="quality" value={quality} onChange={(e) => handleQualityChange(e.target.value)}>
                {sources.map((source) => (
                  <option key={source.quality} value={source.quality}>
                    {source.quality === "auto" ? "Auto" : `${source.quality}p`}
                  </option>
                ))}
              </select>
            </div>

            <MediaPlayer
              title={document.title && season_number && episode_number ? `Currently Watching ${document.title} - S${season_number} -E${episode_number} ` : ` Currently Watching ${document.title} ` }
              src={playerSource}
              id="player"
              load="eager"
              //ref={playerRef}
              storage={new CustomLocalMediaStorage}
              playsInline
              crossOrigin=""
              autoPlay={false}
             
            >
              <MediaProvider>
                {textTracks.map(track => (
                  <Track {...track} key={track.src} />
                ))}
              </MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons} />
              <source src={playerSource} type="application/x-mpegURL" />
            </MediaPlayer>
          </div>

         {episodes.length > 0 && ( <div className="episode-selector">
            <h4 className="episodes_itemz">Episodes</h4>
            <ul className="episode_list">
              {episodes.map((episode, index) => (
                <li
                  className={`episodes_itemz ${currentEpisode == episode.episode_number ? "actively" : ""}`}
                  key={index}
                  onClick={() => handleEpisodeClick(episode.episode_number)}
                >
                  {episode.episode_number}.{episode.name}
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

class CustomLocalMediaStorage extends LocalMediaStorage {
  // Override the save method to customize what you store
  save(player) {
    const { id, type } = player.options;
    const currentTime = player.currentTime;

    let storageKey;
    if (type === 'movie') {
      storageKey = `movie-${id}`;
    } else if (type === 'episode') {
      const { season_number, episode_number } = player.options;
      storageKey = `show-${id}-s${season_number}e${episode_number}`;
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
    } else if (type === 'episode') {
      const { season_number, episode_number } = player.options;
      storageKey = `show-${id}-s${season_number}e${episode_number}`;
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

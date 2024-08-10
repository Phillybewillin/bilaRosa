import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import axios from "axios";
import "./player.scss";
import apiConfig from "../../api/apiConfig";

export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const [playerSource, setPlayerSource] = useState("");
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const testurl = import.meta.env.VITE_CORS_URL;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (title) {
      const decodedTitle = decodeURIComponent(title);
      document.title = `Watching ${decodedTitle}`;
    }
    
    if (id) {
      fetchData(id, season_number, currentEpisode);
      fetchEpisodes(id, season_number);
    }
  }, [title, id, season_number, currentEpisode]);

  const fetchData = async (showTMDBid, seasonNumber, episodeNumber) => {
    try {
      let url = `${testurl}/vidsrc/${showTMDBid}`;
      if (seasonNumber && episodeNumber) {
        url += `?s=${seasonNumber}&e=${episodeNumber}`;
      }
      const response = await axios.get(url);
      const data = response.data;

      const source1 = data.source1?.data?.source;
      const source2 = data.source2?.data?.source;

      if (data.source1?.success && source1) {
        setPlayerSource(cleanUrl(source1));
        setTextTracks(mapSubtitlesToTracks(data.source1.data.subtitles));
      } else if (data.source2?.success && source2) {
        setPlayerSource(cleanUrl(source2));
        setTextTracks(mapSubtitlesToTracks(data.source2.data.subtitles));
      } else {
        console.error("No valid source found");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const cleanUrl = (url) => {
    const index = url.indexOf('.m3u8');
    return index !== -1 ? url.substring(0, index + 5) : url;
  };

  const mapSubtitlesToTracks = (subtitles) => {
    return subtitles.map((subtitle) => ({
      src: subtitle.file,
      label: subtitle.label,
      kind: "subtitles",
      srclang: subtitle.label.toLowerCase().replace(/[^a-z]+/g, "-"), // simplified language tag
    }));
  };

  useEffect(() => {
    if (playerSource) {
      console.log("Updated playerSource:", playerSource);
    }
  }, [playerSource]);

  const fetchEpisodes = async (id, selectedSeason) => {
    if (id && selectedSeason) {
      try {
        const response = await axios.get(
          `${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`
        );
        setEpisodeData(response.data.episodes);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
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

  return (
    <>
      <div className="player-container">
        <div className="menu">
          <div className="navih" onClick={handleHome}> Home</div>
          <div className="navi" onClick={handleBack}><i className="bx bx-arrow-back"></i>Back to Details</div>
        </div>
         
        <MediaPlayer
          title={title ? `Watching ${decodeURIComponent(title)}` : 'Watching'}
          src={playerSource}
          id="player"
          autoPlay={true}
          playsInline
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

      <div className="episodesover">
        {episodes && episodes.map((episode) => (
          <div
            className={`episodes_item ${parseInt(currentEpisode) === episode.episode_number ? 'actively' : ''}`}
            key={episode.id}
            onClick={() => handleEpisodeClick(episode.episode_number)}
          >
            <p className="episodes_number">Episode: {episode.episode_number}</p>
          </div>
        ))}
      </div>
    </>
  );
}

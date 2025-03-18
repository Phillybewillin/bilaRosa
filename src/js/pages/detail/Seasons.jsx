import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import tmdbApi from "../../api/tmdbApi"; 
import Button, { OutlineButton } from '../../components/button/Button';
import './episodes.scss';
import './seasons.scss';

const Seasons = ({ id, title }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  
  // Refs for scrolling containers
  const episodesRef = useRef(null);
  const seasonsRef = useRef(null);

  // State for arrow visibility
  const [showLeftArrowEpisodes, setShowLeftArrowEpisodes] = useState(false);
  const [showRightArrowEpisodes, setShowRightArrowEpisodes] = useState(false);
  const [showLeftArrowSeasons, setShowLeftArrowSeasons] = useState(false);
  const [showRightArrowSeasons, setShowRightArrowSeasons] = useState(false);

  useEffect(() => {
    const getDetail = async () => {
      const res = await tmdbApi.detail(category, id, { params: {} });
      const validSeasons = res.seasons.filter(
        item => item.air_date && new Date(item.air_date) <= new Date()
      );
      setSeasons(validSeasons);
    };
    getDetail();
  }, [category, id]);

  useEffect(() => {
    if (selectedSeason !== null) {
      const fetchEpisodes = async () => {
        try {
          const response = await axios.get(
            `${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`
          );
          setEpisodes(response.data.episodes);
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
        }
      };
      fetchEpisodes();
    }
  }, [selectedSeason, id]);

  const handleSeasonClick = (season) => {
    setSelectedSeason(season);
    localStorage.setItem(`lastClickedSeason_${id}`, season);
    setSelectedEpisode(null);
  };
  useEffect(() => {
    const lastClickedSeason = localStorage.getItem(`lastClickedSeason_${id}`);
    setSelectedSeason(seasons.length > 0 ? lastClickedSeason || 1 : 1);
    setSelectedEpisode(null);
  }, [seasons, id ]);

  // General smooth scroll function
  const smoothScroll = (ref, targetOffset) => {
    const container = ref.current;
    const startOffset = container.scrollLeft;
    const distance = targetOffset - startOffset;
    const duration = 500; // Duration in milliseconds
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Progress: 0 to 1
      const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease function
      const scrollOffset = startOffset + distance * easeInOutQuad(progress);
      container.scrollLeft = scrollOffset;
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Episodes scroll handlers
  const handleScrollLeftEpisodes = () => {
    const container = episodesRef.current;
    smoothScroll(episodesRef, container.scrollLeft - 700); // Adjust distance as needed
  };

  const handleScrollRightEpisodes = () => {
    const container = episodesRef.current;
    smoothScroll(episodesRef, container.scrollLeft + 1000); // Adjust distance as needed
  };

  // Seasons scroll handlers
  const handleScrollLeftSeasons = () => {
    const container = seasonsRef.current;
    smoothScroll(seasonsRef, container.scrollLeft - 500); // Adjust distance as needed
  };

  const handleScrollRightSeasons = () => {
    const container = seasonsRef.current;
    smoothScroll(seasonsRef, container.scrollLeft + 500); // Adjust distance as needed
  };

  // Update arrow visibility for episodes
  useEffect(() => {
    const episodesContainer = episodesRef.current;
    if (episodesContainer) {
      const updateEpisodesArrows = () => {
        const { scrollLeft, scrollWidth, clientWidth } = episodesContainer;
        setShowLeftArrowEpisodes(scrollLeft > 0);
        setShowRightArrowEpisodes(scrollLeft < scrollWidth - clientWidth);
      };
      updateEpisodesArrows();
      episodesContainer.addEventListener("scroll", updateEpisodesArrows);
      window.addEventListener("resize", updateEpisodesArrows);
      return () => {
        episodesContainer.removeEventListener("scroll", updateEpisodesArrows);
        window.removeEventListener("resize", updateEpisodesArrows);
      };
    }
  }, [episodes]);

  // Update arrow visibility for seasons
  useEffect(() => {
    const seasonsContainer = seasonsRef.current;
    if (seasonsContainer) {
      const updateSeasonsArrows = () => {
        const { scrollLeft, scrollWidth, clientWidth } = seasonsContainer;
        setShowLeftArrowSeasons(scrollLeft > 0);
        setShowRightArrowSeasons(scrollLeft < scrollWidth - clientWidth);
      };
      updateSeasonsArrows();
      seasonsContainer.addEventListener("scroll", updateSeasonsArrows);
      window.addEventListener("resize", updateSeasonsArrows);
      return () => {
        seasonsContainer.removeEventListener("scroll", updateSeasonsArrows);
        window.removeEventListener("resize", updateSeasonsArrows);
      };
    }
  }, [seasons]);

  const handleEpisodeClick = (id, title, selectedSeason, episodeNumber) => {
    const watchHistory = localStorage.getItem("watchHistory");
    localStorage.setItem("lastClickedSeason", selectedSeason);

    if (watchHistory) {
      const watchHistoryObj = JSON.parse(watchHistory);
      if (!watchHistoryObj[id]) {
        watchHistoryObj[id] = {};
      }
      if (!watchHistoryObj[id][selectedSeason]) {
        watchHistoryObj[id][selectedSeason] = [];
      }
      watchHistoryObj[id][selectedSeason].push(episodeNumber);
      localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
    } else {
      const watchHistoryObj = {
        [id]: {
          [selectedSeason]: [episodeNumber],
        },
      };
      localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
    }

    if (title && id && selectedSeason && episodeNumber) {
      const encodedTitle = encodeURIComponent(
        title.replace(/ /g, "-").toLowerCase()
      );
      navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
    }
  };

  const watchHistory = localStorage.getItem("watchHistory");
  const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
  const watchedEpisodes =
    selectedSeason !== null &&
    watchHistoryObj[id] &&
    watchHistoryObj[id][selectedSeason]
      ? watchHistoryObj[id][selectedSeason]
      : [];
  const lastClickedEpisode =
    watchHistoryObj[id] &&
    watchHistoryObj[id][selectedSeason] &&
    watchHistoryObj[id][selectedSeason].slice(-1)[0];

  return (
    <div className="seasons-episodes">
      {/* Seasons Section with Scroll Arrows */}
      
      <div className="seasons-container">
      {showLeftArrowSeasons && (
          <button className="leftseason" onClick={handleScrollLeftSeasons}>
            <i className="bx bxs-chevron-left" style={{ fontSize: "23px" }}></i>
          </button>
        )}
        <div className="seasons" >
          <div className="seasons__content" ref={seasonsRef}>
            {seasons &&
              seasons
                .filter(item => item.season_number !== 0)
                .map((item, i) => (
                  <div
                    className="seasons__list"
                    key={i}
                    onClick={() => handleSeasonClick(item.season_number)}
                  >
                    <div
                      className={`seas ${
                        item.season_number == selectedSeason ? "actively" : ""
                      }`}
                    >
                      <h4 className="seasons__name">
                        Season {item.season_number}
                      </h4>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        {showRightArrowSeasons && (
          <button className="rightseason" onClick={handleScrollRightSeasons}>
            <i className="bx bxs-chevron-right" style={{ fontSize: "23px" }}></i>
          </button>
        )}
      </div>

      {/* Episodes Section with Scroll Arrows */}
      {selectedSeason !== null && (
        <div className="episodes">
          {(showLeftArrowEpisodes || showRightArrowEpisodes) && (
            <div className="episodes-arrows">
              {showLeftArrowEpisodes && (
                <button className="leftser" onClick={handleScrollLeftEpisodes}>
                  <i
                    className="bx bx-left-arrow-alt"
                    style={{ fontSize: "23px" }}
                  ></i>
                </button>
              )}
              {showRightArrowEpisodes && (
                <button className="rightser" onClick={handleScrollRightEpisodes}>
                  <i
                    className="bx bx-right-arrow-alt"
                    style={{ fontSize: "23px" }}
                  ></i>
                </button>
              )}
            </div>
          )}
          <div className="episodes__list" ref={episodesRef}>
            {episodes &&
              episodes
                .filter(
                  episode => new Date(episode.air_date) <= new Date()
                ) // Filter out unreleased episodes
                .map((episode) => (
                  <div className="episodes__cont" key={episode.id}>
                    <div
                      className={`episodes__item ${
                        watchedEpisodes.includes(episode.episode_number)
                          ? "watched"
                          : ""
                      }`}
                      onClick={() =>
                        handleEpisodeClick(
                          id,
                          title,
                          selectedSeason,
                          episode.episode_number
                        )
                      }
                    >
                      <img
                        className="episodes__image"
                        src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`}
                        alt="episodes"
                      />
                      {watchedEpisodes.includes(episode.episode_number) && (
                        <div
                          className={`watched-badge ${
                            lastClickedEpisode === episode.episode_number
                              ? "continue-watching"
                              : ""
                          }`}
                        >
                          <span>
                            {lastClickedEpisode === episode.episode_number
                              ? "Continue Watching"
                              : "Watched"}
                          </span>
                          <i
                            className={`bx ${
                              lastClickedEpisode === episode.episode_number
                                ? "bx-play"
                                : "bx-check-double"
                            }`}
                            style={{ fontSize: "2.5rem" }}
                          ></i>
                        </div>
                      )}
                    </div>
                    <div className="episodes__desc">
                      <h2 className="episodes__name">
                        E {episode.episode_number} • {episode.name}
                      </h2>
                      {episode.overview}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Seasons;

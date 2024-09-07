import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import tmdbApi from "../../api/tmdbApi"; 
import Button, { OutlineButton } from '../../components/button/Button';
import './episodes.scss';
import './seasons.scss';

const Seasons = ({ id , title}) => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    useEffect(() => {
        const getDetail = async () => {
            const res = await tmdbApi.detail(category, id, { params: {} });
            const validSeasons = res.seasons.filter(item => item.air_date && new Date(item.air_date) <= new Date());
            setSeasons(validSeasons );
        };
        getDetail();
    }, [category, id]);

    useEffect(() => {
        if (selectedSeason !== null) {
            const fetchEpisodes = async () => {
                try {
                    const response = await axios.get(`${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`);
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
        setSelectedEpisode(null);
    };

    const handleEpisodeClick = (id , title ,selectedSeason, episodeNumber) => {
      console.log(selectedSeason , episodeNumber);
      console.log(id , title  )
        //console.log('handlePlayer function called', id, title , selectedSeason , episodeNumber);

        if (title && id && selectedSeason && episodeNumber) {
            const encodedTitle = encodeURIComponent(title.replace(/ /g, '-').toLowerCase());
            console.log(`Navigating to: /watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            console.log(id, title );
        }
    };


    return (
        <div className="seasons-episodes">
            <div className="seasons">
        
                <div className="seasons__content">
                    {seasons && seasons.filter(item => item.season_number !== 0).map((item, i) => (
                        <div className="seasons__list" key={i} onClick={() => handleSeasonClick(item.season_number)}>
                            <div className={`seas ${item.season_number == selectedSeason ? "actively" : ""}`}
               >
                                <h4 className="seasons__name">Season {item.season_number}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeason !== null && (
                <div className="episodes">
                    
                       
                        <div className="episodes__list">
                            {episodes && episodes
            .filter(episode => new Date(episode.air_date) <= new Date()) // Filter out unreleased episodes
            .map((episode) => (
                              <>
                              <div className="episodes__cont">
                               <div className="episodes__item" key={episode.id} onClick={() => handleEpisodeClick( id , title ,selectedSeason, episode.episode_number)}>
                               <img className="episodes__image" src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`} alt="" />
                
                                    
                                </div>
                                <div className="episodes__desc">
                                
                                <h2 className="episodes__name">{episode.episode_number}.{episode.name}</h2>
            
                                  {episode.overview}
                                  </div>
                              </div>
                            
                               
                            
                              </>
                                ))}
                        </div>

                </div>
            )}

        </div>
    );
};

export default Seasons;

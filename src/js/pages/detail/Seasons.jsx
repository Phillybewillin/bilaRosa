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


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="seasons-episodes">
            <div className="seasons">
                <h4 className="seasons__title">Seasons</h4>
                <div className="seasons__content">
                    {seasons && seasons.filter(item => item.season_number !== 0).map((item, i) => (
                        <div className="seasons__list" key={i} onClick={() => handleSeasonClick(item.season_number)}>
                            <div className="seas">
                                <h4 className="seasons__name">Season {item.season_number}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeason !== null && (
                <div className="episodes">
                    <div className="treza">
                        <h4 className="episodes__title">Season {selectedSeason}</h4>
                        <div className="episodes__list">
                            {episodes && episodes.map((episode) => (
                                <div className="episodes__item" key={episode.id} onClick={() => handleEpisodeClick( id , title ,selectedSeason, episode.episode_number)}>
                                    <img src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`} alt="" />
                                    <h2 className="episodes__name">{episode.name}</h2>
                                    <p className="episodes__number">episode:{episode.episode_number}</p>
                                    <p className="episodes__date">{episode.air_date}</p>
                                    <p className="episodes__time">{episode.runtime} min</p>
                                    
                                    <Button className="btnprime2" onClick={() => handleEpisodeClick( id , title ,selectedSeason, episode.episode_number)} style={{ width: '50%' }}>Play</Button>
                                
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="scrolltotop" onClick={scrollToTop} style={{ position: 'fixed', bottom: '50px', right: '20px', cursor: 'pointer', fontSize: '20px', backgroundColor: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#00ffbb' }}>
                <i className="bx bx-chevron-up"></i>
            </div>
        </div>
    );
};

export default Seasons;

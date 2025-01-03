import React, { useState, useEffect ,useRef} from "react";
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
    const Seriesref = useRef(null);
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
        localStorage.setItem(`lastClickedSeason_${id}`, season);
        setSelectedEpisode(null);
      };
      
      useEffect(() => {
        const lastClickedSeason = localStorage.getItem(`lastClickedSeason_${id}`);
        setSelectedSeason(seasons.length > 0 ? lastClickedSeason || 1 : 1);
        setSelectedEpisode(null);
      }, [seasons, id ]);

    const smoothScroll = (targetOffset) => {
        const startOffset = Seriesref.current.scrollLeft;
        const distance = targetOffset - startOffset;
        const duration = 500; // Duration in milliseconds
        const startTime = performance.now();
    
        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Progress: 0 to 1
    
            const easeInOutQuad = (t) =>
                t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease function
            const scrollOffset = startOffset + distance * easeInOutQuad(progress);
    
            Seriesref.current.scrollLeft = scrollOffset;    
    
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
    
        requestAnimationFrame(animateScroll);
    };
    
    const handleScrollLeft = () => {
      
        const currentOffset = Seriesref.current.scrollLeft;
        smoothScroll(currentOffset - 700); // Adjust the scroll distance as needed
    };
    
    const handleScrollRight = () => {
        const currentOffset = Seriesref.current.scrollLeft;
        smoothScroll(currentOffset + 1000); // Adjust the scroll distance as needed
    };
    

    const handleEpisodeClick = (id , title ,selectedSeason, episodeNumber) => {
        const watchHistory = localStorage.getItem('watchHistory');
         localStorage.setItem('lastClickedSeason', selectedSeason);
      
        if (watchHistory) {
          const watchHistoryObj = JSON.parse(watchHistory);
          if (!watchHistoryObj[id]) {
            watchHistoryObj[id] = {};
          }
          if (!watchHistoryObj[id][selectedSeason]) {
            watchHistoryObj[id][selectedSeason] = [];
          }
          watchHistoryObj[id][selectedSeason].push(episodeNumber);
          localStorage.setItem('watchHistory', JSON.stringify(watchHistoryObj));
        } else {
          const watchHistoryObj = {
            [id]: {
              [selectedSeason]: [episodeNumber]
            }
          };
          localStorage.setItem('watchHistory', JSON.stringify(watchHistoryObj));
        }
        //const watchHistoryObj = JSON.parse(watchHistory);
        //const watched = watchHistoryObj[id][selectedSeason].includes(episodeNumber);
        //console.log(watched);
   

        if (title && id && selectedSeason && episodeNumber) {
            const encodedTitle = encodeURIComponent(title.replace(/ /g, '-').toLowerCase());
           // console.log(`Navigating to: /watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
           // console.log(id, title );
        }
    };

    const watchHistory = localStorage.getItem('watchHistory');
    const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
    const watchedEpisodes = selectedSeason !== null && watchHistoryObj[id] && watchHistoryObj[id][selectedSeason] ? watchHistoryObj[id][selectedSeason] : [];
    //console.log(watchedEpisodes);

    const lastClickedEpisode = watchHistoryObj[id] && watchHistoryObj[id][selectedSeason] && watchHistoryObj[id][selectedSeason].slice(-1)[0];
    
    return (
        <div className="seasons-episodes">
            <div className="seasons">
        
                <div className="seasons__content">
                    {seasons && seasons.filter(item => item.season_number !== 0).map((item, i) => (
                        <div className="seasons__list" key={i} onClick={() => handleSeasonClick(item.season_number)}>
                            <div className={`seas ${item.season_number == selectedSeason ? "actively" : ""}`}
               >
                                <h4 className="seasons__name"> Season {item.season_number}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeason !== null && (
                <div className="episodes">
                    <div className={`buttsz ${episodes.length <= 2 ? "hide" : ""}`}>
                   <button  className="leftser" onClick={handleScrollLeft}><i className='bx bxs-chevron-left' style={{fontSize : '23px'}}></i></button>
                  <button className="rightser" onClick={handleScrollRight}><i className='bx bxs-chevron-right' style={{fontSize : '23px'}}></i></button>
                        
                    </div>
                         
                       
                        <div className="episodes__list" ref={Seriesref}>
                            
                        {episodes && episodes
  .filter(episode => new Date(episode.air_date) <= new Date()) // Filter out unreleased episodes
  .map((episode) => (
    <div className="episodes__cont">
      <div className={`episodes__item ${watchedEpisodes.includes(episode.episode_number) ? 'watched' : ''}`} key={episode.id} onClick={() => handleEpisodeClick(id, title, selectedSeason, episode.episode_number)}>
        <img className="episodes__image" src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`} alt="episodes" />
        {watchedEpisodes.includes(episode.episode_number) && (
          <div className={`watched-badge ${lastClickedEpisode === episode.episode_number ? 'continue-watching' : ''}`}>
            <span>{lastClickedEpisode === episode.episode_number ? 'Continue Watching' : 'Watched'}</span>
            <i className={`bx ${lastClickedEpisode === episode.episode_number ? 'bx-play' : 'bx-check-double'}`}></i>
          </div>
        )}
      </div>
      <div className="episodes__desc">
        <h2 className="episodes__name">E {episode.episode_number} • {episode.name}</h2>
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

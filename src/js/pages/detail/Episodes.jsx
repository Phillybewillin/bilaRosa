import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';
import './episodes.scss';
import Button, { OutlineButton } from '../../components/button/Button';

const Episodes = () => {
  const { id, season_number } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState('');

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}tv/${id}/season/${season_number}?api_key=${apiConfig.apiKey}&append_to_response=episodes`);
        setEpisodes(response.data.episodes);
        console.log(`${apiConfig.baseUrl}tv/${id}/season/${season_number}?api_key=${apiConfig.apiKey}&append_to_response=episodes`);
        console.log(id, season_number);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEpisodes();
  }, [id, season_number]);
 

 const handleWatchNow = (episode) => {
  setSelectedEpisode(prevEpisode => episode !== prevEpisode ? episode : null);
  setSelectedUrl(`https://vidsrc.pro/embed/tv/${id}/${season_number}/${episode.episode_number}`);
};
const handleClick2 = (episode) => {
  setSelectedEpisode(prevEpisode => episode !== prevEpisode ? episode : null);
  setSelectedUrl(`https://vidsrc.xyz/embed/tv/${id}/${season_number}/${episode.episode_number}?autoplay=1`);
}
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};


  return (
    <>
    <div className="episodes" >
      <div className="treza" style={{backgroundImage: `url(${episodes.length > 0 ? apiConfig.w200Image(episodes[0].still_path ? episodes[0].still_path : episodes[0].poster_path) : ''})`}}>
      <h1 className="episodes__title">Season {season_number} Episodes</h1>
      {selectedEpisode && (
        <div className="episodes__iframe-container" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)',width : '100%', height : '100%'}}>
          <h3 className="episodes__number">Episode {selectedEpisode.episode_number}</h3>

          <iframe
            className="episodes__iframe"
            title={selectedEpisode.name}
            src={selectedUrl}
            style={{width : '100%',zIndex : '9999'}}
            width={"100%"}
            height={"500px"}
            frameBorder="0"
            allowFullScreen
            allow="autoplay"
            
          />
        </div>
      )}
      
      <div className="episodes__list" >
        {episodes.map((episode) => (
          <>
           <div
            className="episodes__item"
            key={episode.id}
          >
            <Button className="btn" onClick={() => handleWatchNow(episode)} >Watch Now</Button>
             <h2 className="episodes__name">{episode.name}</h2>
            <h3 className="episodes__number">Episode {episode.episode_number}</h3>
            <p className="episodes__number">{episode.air_date}</p>
            <OutlineButton className="outline" onClick={() => handleClick2(episode)} style={{width : '50%'}}>Alternative</OutlineButton>
        
          </div>
         
             
          </>
         
        ))}
      </div>
      
      </div>
           
     <div className="message" >
      <h5>Click on any episode to watch it ,look at the release date to make sure its available.</h5>
      <h5>also share </h5>
     </div>

    </div>
    <div className="scrolltotop" onClick={scrollToTop} style={{position: 'fixed', bottom: '50px', right: '20px', cursor: 'pointer',fontSize: '20px',backgroundColor: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',color: '#00ffbb'}}><i className="bx bx-chevron-up"></i></div>
      </>
  );
};

export default Episodes;

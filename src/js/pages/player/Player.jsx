import {useRef , useState, useEffect} from "react";
import { useNavigate, useParams} from "react-router-dom";

import axios from "axios";
import "./player.scss";
import '../detail/seasons.scss';
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary"; // Import the ErrorBoundary component
//import {Bars } from "react-loader-spinner";
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import { ToastContainer , toast } from "react-toastify";
import Select from 'react-select';

export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const testurl = import.meta.env.VITE_FETCH_URL_TEST;
  const [playerSource, setPlayerSource] = useState(null);
  const [textTracks, setTextTracks] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [bgChanged, setbgChanged] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(season_number);
  const [header , setHeader] = useState(null);
  const [quality, setQuality] = useState("auto");
  const [totalEpisodes , setTotalEpisodes] = useState(0);
  const lastFetchArgs = useRef(null);

  //const [sources, setSources] = useState([]);
  const [Loading, setLoading] = useState(false);
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
        document.title = ` Streaming ${decodedTitle}`;

      if (season_number && episode_number) {
        document.title = `Watching  ${decodedTitle} • S${currentSeason} • E${currentEpisode}`;
      }
  
    }
   
    if (id) {
      
      fetchEpisodes(id, currentSeason);
    
    }
  }, [title, id, currentSeason ,currentEpisode]);


  useEffect(() => {
    if (id && season_number && episode_number) {
      const getseasons = async () => {
        const { data } = await axios.get(`${apiConfig.baseUrl}tv/${id}?api_key=${apiConfig.apiKey}`);
        const validSeasons = data.seasons.filter(({ air_date }) => air_date && new Date(air_date) <= new Date());
        setSeasons(validSeasons);
        //console.log(validSeasons);
        setbgChanged(apiConfig.w200Image(validSeasons[0].poster_path))
   
    };

    getseasons();
    }
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
    //setHeader("");
    //setLoading(true);
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
 // setHeader("");
  setCurrentSeason(seasonNumber);
  setCurrentEpisode(1);
  //setLoading(true);
  //fetchEpisodes(id, currentSeason);
  
};

 const handleBack = ( ) => {
    if(id && season_number && episode_number){
      navigate(`/tv/${id}`)
    }else{
      navigate(`/movie/${id}`);
    }
    
  };

  const handleHome = () => {
    navigate('/');
  };
  const handleSelectChange = (selectedOption) => {
    const baseUrl = selectedOption.value;
    setIframeUrl(baseUrl);
    setLoading(true);
  };
 // const [autoPlay, setAutoPlay] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('https://vidlink.pro/');
 //console.log(iframeUrl);
  const options = [
    { value: 'https://vidlink.pro/', label: 'Vanilla' },
    { value: 'https://player.autoembed.cc/embed/', label: 'Strawberry' },
    { value: 'https://vidsrc.xyz/embed/', label: 'Banana' },
    { value: 'https://embed.su/embed/', label: 'Grape' },
    { value: 'https://vidbinge.dev/embed/', label: 'Blueberry' },
   
  ]
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <ErrorBoundary>
        <> 
          <div className="player-container" >
            <div className="topbar">
            <div className="logozz" onClick={() => navigate('/')}>
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZILLAXR</h4> </div>
              <div className="menu">
              <div className="navih" onClick={handleHome}><i className="bx bx-home" ></i></div>
              <div className="navi" onClick={handleBack}><i className='bx bxs-chevron-left'></i></div>
            </div>
            </div>
            
            <div className="episodes__iframe-container" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)',width : '100%', height : '100%'}}>
          

            {Loading ? (
        <div>Loading...</div>
      ) : (
        season_number && episode_number ? (
          <iframe
            src={`${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?poster=true&autoplay=false&nextbutton=true&icons=vid`}
            className="episodes__iframe"
            width={"100%"}
            height={"100%"}
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
         
          />
        ) : (
          <iframe
            src={`${iframeUrl}movie/${id}?poster=true&autoplay=false&icons=vid`}
            className="episodes__iframe"
            width={"100%"}
            height={"100%"}
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        ))}
       
        </div>
            <ToastContainer theme="light" fontSize="11px" position="top-right" autoClose={8000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} progressStyle={{ backgroundColor: '#00000', color: 'white', borderRadius: '5px' }} />
      
          </div>
          {currentEpisode < totalEpisodes ? (
  <div className="rea" onClick={() => handleEpisodeClick(parseInt(currentEpisode) + 1)}>
    Next Episode
  </div>
) : null}
          <div className="lights"></div>
          <div className="seasons">
            <div className="servers">
              <h4>Sources :</h4> 
              <div className="sources"> 
                
              <Select
       defaultValue={options[0]}
       options={options}
       onChange={(selectedOption) => {
        const baseUrl = selectedOption.value;
        setIframeUrl(baseUrl);
        setLoading(false);
      }}
       theme={(theme) => ({
      ...theme,
      
    
      borderRadius: 10,
      colors: {
        ...theme.colors,
        primary25: '#afafaf54',
        primary: '#38383879',
        neutral0 : '#00000a2',

       neutral5: 'grey',
       neutral10: '#38383879',
        neutral20: '#38383879',
neutral30: 'red',
neutral40: 'pink',
neutral50: '#a9a9a9',
neutral60: '#38383879',
neutral70: '#696969',
neutral80: '#505050',
neutral90: '#303030'
      },
    })}
  />
              </div>
            </div>
          
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
                 E{episode.episode_number} <div className="s"></div>{episode.name}
              </li>
            ))}
        </ul>
      </div>
    )}
      
        </>
    </ErrorBoundary>
  );
}

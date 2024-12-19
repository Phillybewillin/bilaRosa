import { useEffect, useState } from "react";
import "./movie-list.scss";
import { useNavigate } from "react-router-dom";
//import apiConfig from "../../api/apiConfig";
import { UserAuth } from "../../context/AuthContext";
import { useFirestore } from "../../Firestore";
import axios from "axios";
import apple from '../../assets/apple.png';
import netflix from '../../assets/netflix.png';
import prime from '../../assets/prime.png';
import fx from '../../assets/fx.png';
import hbo from '../../assets/hbo.png';
import hulu from '../../assets/hulu.png';
import disney from '../../assets/disney.png';
import max from '../../assets/max.png';
import { toast } from "react-toastify";
const BoxOffice = () => {
    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCount, setShowCount] = useState(10);
    const [networkid ,setNetworkid] = useState(213);
    const [nettitle, setNettitle] = useState('Netflix');
    const [backdrop, setBackdrop] = useState(netflix);
    // Your TMDB API key
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
    const {user} = UserAuth();
    const { addToWatchlist, checkIfInWatchlist  } = useFirestore();
    //const NETWORK_ID = 213; // Netflix network ID
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [watchlistStatus, setWatchlistStatus] = useState({});

    useEffect(() => {
      // Function to fetch TV shows from TMDB
      const fetchNetflixShows = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/tv`,
            {
              params: {
                api_key: API_KEY,
                with_networks: networkid,
                sort_by: "popularity.desc", // Sort by popularity
              },
            }
          );
          setShows(response.data.results); 
          //console.log(response.data.results); // Set the TV shows
          setLoading(false);
          if (!user) {
            setIsInWatchlist(false);
            return;
          }
  
         
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchNetflixShows();
    }, [networkid , nettitle , checkIfInWatchlist  ,user ]);
    useEffect(() => {
      if (selectedItem) {
       // console.log('selected item', selectedItem)
        checkIfInWatchlist(user?.uid, selectedItem?.id).then((data) => {
          setWatchlistStatus((prevStatus) => ({ ...prevStatus, [selectedItem.id]: data }));
        });
      }
    }, [user , selectedItem ,watchlistStatus ]);

   
    // Display loading, error, or the list of shows
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const saveShow = async (show) => {
     
        if (!user) {
          toast.error('Please log In to add to watchlit');
          return;
        }
    
        const data = {
          id: show?.id,
          title: show?.title || show?.name,
          category: 'tv',
          poster_path: show?.poster_path,
          release_date: show?.release_date || show?.first_air_date,
          vote_average: show?.vote_average,
          //overview: details?.overview,
        };
    
        const dataId = show?.id?.toString();
        await addToWatchlist(user?.uid, dataId, data);
        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
        setIsInWatchlist(isSetToWatchlist);
      };
    
     

    return (
        <div className="mainbox">
            <div className="boxoffice">
              <div className="sharezilla">
              
                <h2 className="sharehead"> <i className='bx bx-sun bx-spin'></i> Share ZILLAXR <i className='bx bx-sun bx-spin'></i></h2>
                <p className="sharemess">Help Us Spread the word</p>
              </div>
            <h3 className="boxoffice__title">#TOP 10: BOX OFFICE</h3>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1241982')}><span className="boxoffice__rank1">1</span>Moana 2</h4>
                
                <div className="boxofficer">
                <p className="boxoffice__rt">61%</p>
                <p className="boxoffice__rating">PG</p>

                </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/402431')}><span className="boxoffice__rank1">2</span>Wicked</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">88%</p>
                <p className="boxoffice__rating">PG~13</p>
              
                  </div>
            </div>
            <div className="boxoffice__list">
            
            <h4 className="boxoffice__movie" onClick={() => navigate('/movie/539972')}><span className="boxoffice__rank1">3</span>Kraven the Hunter</h4>
             <div className="boxofficer">
                <p className="boxoffice__rt">14%</p>
                <p className="boxoffice__rating">PG~13</p>
            </div>
        </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/558449')}><span className="boxoffice__rank">4</span>Gladiator II</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">71%</p>
                <p className="boxoffice__rating">~R</p>
              
                  </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/839033')}><span className="boxoffice__rank">5</span>The Lord of the Rings: The War of ...</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">49%</p>
                <p className="boxoffice__rating">~PG</p>
               
                 </div>
        </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/845781')}><span className="boxoffice__rank">6</span>Red One</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">30%</p>
                 <p className="boxoffice__rating">PG~13</p>
              
                 </div>
            </div>
           
        
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/857598')}><span className="boxoffice__rank">7</span>Pushpa: The Rule - Part 2</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">-</p>
                <p className="boxoffice__rating">-</p>
              
                  </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/157336')}><span className="boxoffice__rank">8</span>Interstellar</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">73%</p>
                <p className="boxoffice__rating">PG~13</p>
              
                </div>
                
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1357633')}><span className="boxoffice__rank">9</span>Solo Leveling - ReAwakening</h4>
                
                <div className="boxofficer">
                <p className="boxoffice__rt">-</p>
                <p className="boxoffice__rating">~</p>
               
                </div>
            </div>
           
           
          
           
            
           
           
           
          
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/762509')}> <span className="boxoffice__rank">10</span>Mufasa - The Lion King</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">-</p>
                 <p className="boxoffice__rating">~</p>
                 </div>
            </div>
          
            
        </div>
        <div className="boxoffice" style={{backgroundImage: `url(${backdrop})`  , backgroundRepeat: 'no-repeat' , backgroundSize: 'contain' , backgroundPosition: 'center'}}>
          <div className="blurr">
          <div className="settitle">
            <div className="boxoffice__titlename" ><img className="backdropstream" src={backdrop} alt="Netflix" /></div>
            <h3 className="boxoffice__title">#POPULAR STREAMING</h3>
           
            </div>
            <div className="watchprov">
  <h5
    className={`netflix ${networkid === 213 ? 'active' : ''}`}
    onClick={() => {setNetworkid(213); setNettitle('Netflix') ; setBackdrop(netflix)}}
  >
    <img className="provimg" src={netflix} />
  </h5>
  <h5
    className={`apple ${networkid === 2552 ? 'active' : ''}`}
    onClick={() => {setNetworkid(2552); setNettitle('Apple TV+') ; setBackdrop(apple)}}
  >
    <img className="provimg" src={apple} />
  </h5>
  <h5
    className={`hbo ${networkid === 49 ? 'active' : ''}`}
    onClick={() => {setNetworkid(49); setNettitle('HBO Max') ; setBackdrop(hbo)}}
  >
    <img className="provimg" src={hbo} />
  </h5>
  <h5
    className={`hulu ${networkid === 453 ? 'active' : ''}`}
    onClick={() => {setNetworkid(453); setNettitle('Hulu') ; setBackdrop(hulu)}}
  >
    <img className="provimg" src={hulu} />
  </h5>
  <h5
    className={`max ${networkid === 6783 ? 'active' : ''}`}
    onClick={() => {setNetworkid(6783); setNettitle('Max') ; setBackdrop(max)}}
  >
    <img className="provimg" src={max} />
  </h5>
  <h5
    className={`fx ${networkid === 88 ? 'active' : ''}`}
    onClick={() => {setNetworkid(88); setNettitle('FX Network') ; setBackdrop(fx)}}
  >
    <img className="provimg" src={fx} />
  </h5>
  <h5
    className={`prime ${networkid === 1024 ? 'active' : ''}`}
    onClick={() => {setNetworkid(1024); setNettitle('Amazon Prime Video') ; setBackdrop(prime)}}
  >
    <img className="provimg" src={prime} />
  </h5>
  <h5
    className={`disney ${networkid === 2739 ? 'active' : ''}`}
    onClick={() => {setNetworkid(2739); setNettitle('Disney+') ; setBackdrop(disney)}}
  >
    <img className="provimg" src={disney} />
  </h5>
</div>
            <div className="boxoffice__lis">
  <ul>
    {shows.slice(0, showCount).map((show , s ) => (
      <li key={show.id} className="boxoffice__list">
        
        <h4 className="boxoffice__movie" onClick={() => navigate(`/tv/${show.id}`)}><span className="boxoffice__rank">{show.number}</span>{show.name}</h4>
        <p className="boxofficer">{show.vote_average.toFixed(1)}</p>
        <button
    className="boxofficerz"
    onClick={() => {
      saveShow(show);
      setSelectedItem(show);
    }}
  >
    <p
      style={{
        cursor: "pointer",
        color: watchlistStatus[show.id] ? "aqua" : "rgba(255, 255, 255, 0.549)",
      }}
    >
      {watchlistStatus[show.id] ? (
        <i className="bx bxs-bookmark-plus" style={{ fontSize: "19px" }}></i>
      ) : (
        <i className="bx bx-bookmark-plus" style={{ fontSize: "18px" }}></i>
      )}
    </p>
  </button>
      </li>
    ))}
  </ul>
  {showCount < shows.length && (
    <button className="boxoffice__button" onClick={() => setShowCount(showCount + 10)}>Show More</button>
  )}
</div>
        </div>
          </div>
           
        </div>
        
    )
}

export default BoxOffice;

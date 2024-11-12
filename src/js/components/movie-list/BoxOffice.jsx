import { useEffect, useState } from "react";
import "./movie-list.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apple from '../../assets/apple.png';
import netflix from '../../assets/netflix.png';
import prime from '../../assets/prime.png';
import fx from '../../assets/fx.png';
import hbo from '../../assets/hbo.png';
import hulu from '../../assets/hulu.png';
import disney from '../../assets/disney.png';
import max from '../../assets/max.png';
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
    const API_KEY = '861e1d76c42a3a6e9038e0bf6dc95277'; 
    //const NETWORK_ID = 213; // Netflix network ID
  
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
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchNetflixShows();
    }, [networkid , nettitle]);
   

   
    // Display loading, error, or the list of shows
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  

    return (
        <div className="mainbox">
            <div className="boxoffice">
            <h3 className="boxoffice__title">#TOP 10: BOX OFFICE</h3>
            <div className="boxoffice__list">
            
            <h4 className="boxoffice__movie" onClick={() => navigate('/movie/912649')}><span className="boxoffice__rank1">1</span>Venom: The Last Dance</h4>
             <div className="boxofficer">
                <p className="boxoffice__rt">41%</p>
                <p className="boxoffice__rating">PG~13</p>
            </div>
        </div>
        <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1206617')}><span className="boxoffice__rank1">2</span>The Best Christmas Pageant Ever</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">90%</p>
                <p className="boxoffice__rating">~PG</p>
               
                 </div>
        </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1138194')}><span className="boxoffice__rank1">3</span>Heretic</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">93%</p>
                <p className="boxoffice__rating">~R</p>
              
                  </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1184918')}><span className="boxoffice__rank">4</span>The Wild Robot</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">97%</p>
                <p className="boxoffice__rating">~PG</p>
              
                </div>
                
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1100782')}><span className="boxoffice__rank">5</span> Smile 2</h4>
                
                <div className="boxofficer">
                <p className="boxoffice__rt">85%</p>
                <p className="boxoffice__rating">~R</p>
               
                </div>
            </div>
           
           
          
           
            
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/974576')}><span className="boxoffice__rank">6</span>Conclave</h4>
                
                <div className="boxofficer">
                <p className="boxoffice__rt"> RT:89%</p>
                <p className="boxoffice__rating">PG~13</p>

                </div>
            </div>
           
           
          
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1064213')}> <span className="boxoffice__rank">7</span>Anora</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">78%</p>
                 <p className="boxoffice__rating">~R</p>
                 </div>
            </div>
          
          
           
            
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/940139')}><span className="boxoffice__rank">8</span>Here</h4>
                 <div className="boxofficer">
                 <p className="boxoffice__rt">36%</p>
                 <p className="boxoffice__rating">~PG</p>
              
                 </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1100099')}><span className="boxoffice__rank">9</span>We Live in Time</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">78%</p>
                <p className="boxoffice__rating">~R</p>
              
                  </div>
            </div>
            <div className="boxoffice__list">
                <h4 className="boxoffice__movie" onClick={() => navigate('/movie/1034541')}><span className="boxoffice__rank">10</span>Terrifier 3</h4>
                  <div className="boxofficer">
                  <p className="boxoffice__rt">75%</p>
                <p className="boxoffice__rating">~R</p>
              
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
    {shows.slice(0, showCount).map((show) => (
      <li key={show.id} className="boxoffice__list">
        
        <h4 className="boxoffice__movie" onClick={() => navigate(`/tv/${show.id}`)}><span className="boxoffice__rank">{show.number}</span>{show.name}</h4>
        <p className="boxofficer">{show.vote_average.toFixed(1)}</p>
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

export default BoxOffice

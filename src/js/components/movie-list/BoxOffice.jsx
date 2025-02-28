import { useEffect, useState } from "react";
import "./movie-list.scss";
import { useNavigate } from "react-router-dom";
//import apiConfig from "../../api/apiConfig";
import { UserAuth } from "../../context/AuthContext";
import { useFirestore } from "../../Firestore";
import apiConfig from "../../api/apiConfig";
import axios from "axios";
import apple from '../../assets/apple.png';
import netflix from '../../assets/netflix.png';
import prime from '../../assets/prime.png';
import betting from '../../assets/bettingad.jpg';
import fx from '../../assets/fx.png';
import hbo from '../../assets/hbo.png';
import hulu from '../../assets/hulu.png';
import disney from '../../assets/disney.png';
import max from '../../assets/max.png';
import { toast } from "react-toastify";
import Button from "../button/Button";
const BoxOffice = () => {
    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCount, setShowCount] = useState(100);
    const [networkid ,setNetworkid] = useState(2552);
    const [nettitle, setNettitle] = useState('Apple Tv+');
    const [backdrop, setBackdrop] = useState(apple);
    // Your TMDB API key
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
    const {user} = UserAuth();
    const { addToWatchlist, checkIfInWatchlist  } = useFirestore();
    //const NETWORK_ID = 213; // Netflix network ID
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [watchlistStatus, setWatchlistStatus] = useState({});
    const [pagecount, setPagecount] = useState(2);
    const [iscategory , setisCategory] = useState('tv')
    useEffect(() => {
      // Function to fetch TV shows from TMDB
      const fetchNetflixShows = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/${iscategory}`,
            {
              params: {
                api_key: API_KEY,
                with_networks: networkid,
                sort_by: "popularity.desc", // Sort by popularity
              },
            }
          );
          //setPagecount();
          setShows(response.data.results.filter((show) => Boolean(show.poster_path)));
        //wCount(shows.length);
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
    }, [networkid , iscategory]);

    const handlefetchmoreshows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/${iscategory}`,
          {
            params: {
              api_key: API_KEY,
              with_networks: networkid,
              sort_by: "popularity.desc", // Sort by popularity
              page: pagecount, // Increment the page number
            },
          }
        );
        //console.log('response', response.data.results);
        setShows((prevShows) => {
          const newShows = [...prevShows, ...response.data.results.filter((show) => Boolean(show.poster_path) && Boolean(show.vote_average))];
          console.log('new shows',newShows);
          return newShows;
        });
        //setShows((prevShows) => [...prevShows, ...response.data.results]);
        //setShowCount((prevShowCount) => prevShowCount + response.data.results.length);// Update showCount to include new results
        console.log('arr',showCount ,pagecount);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
const [shouldFetchMore, setShouldFetchMore] = useState(false);

useEffect(() => {
  if (shouldFetchMore && shows.length < showCount) {
    handlefetchmoreshows();
    setShouldFetchMore(false);
  }
}, [shows, shouldFetchMore ,user , iscategory]);

const handleShowMoreClick = () => {
  setShouldFetchMore(true);
};

  
    
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
          toast.error("Please login to add to your watchlist");
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

      const getColor = (votePercentage) => {
        if (votePercentage === null || votePercentage === undefined) {
          return 'gray'; // or some other default color
        }
        if (votePercentage >= 86) {
            return 'magenta';
        } else if (votePercentage >= 72) {
            return 'rgb(8, 164, 0)';
        } 
        else if (votePercentage >= 55) {
            return 'rgb(150, 135, 0)';
        } else {
          return 'red';
        }
            
       
  
    }
    const handleCardClick = (id, category, title, poster_path) => {
      let continueWatchingList = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
      if (!Array.isArray(continueWatchingList)) {
        continueWatchingList = [];
      }
      const foundItem = continueWatchingList.find((item) => item.id === id);
      if (!foundItem) {
        continueWatchingList = [...continueWatchingList, { id, category, title, poster_path }];
        localStorage.setItem('ContinueWatching', JSON.stringify(continueWatchingList));
      }
      navigate(`/${category === 'tv' ? 'tv' : 'movie'}/${id}`);
    };
    const scrollToTop = () => {
      window.scrollTo({ top: 1500, behavior: 'smooth' });
    };
     

    return (
        
      
    
        <div className="boxoffice" style={{
          backgroundImage: `url(${backdrop})`  , backgroundRepeat: 'repeat' , backgroundSize: 'contain' , backgroundPosition: 'bottom' }}>
          <div className="blurr">
          <div className="settitle">
            <div className="boxoffice__titlename" ><img className="backdropstream" src={backdrop} alt={nettitle} /></div>
            <h3 className="boxoffice__title">#POPULAR ON STREAMING</h3>
            
            </div>
            <div className="watchprov">
            <h5
            tabIndex={0}
    className={`apple ${networkid === 2552 ? 'active' : ''}`}
    onClick={() => {setNetworkid(2552); setNettitle('Apple TV+') ; setBackdrop(apple)}}
  >
    <img className="provimg" src={apple} />
  </h5>
  <h5
    tabIndex={0}
    className={`netflix ${networkid === 213 ? 'active' : ''}`}
    onClick={() => {setNetworkid(213); setNettitle('Netflix') ; setBackdrop('https://media.themoviedb.org/t/p/h60/wwemzKWzjKYJFfCeiB57q3r4Bcm.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'} />
  </h5>
 
  <h5
    tabIndex={0}
    className={`hbo ${networkid === 49 ? 'active' : ''}`}
    onClick={() => {setNetworkid(49); setNettitle('HBO Max') ; setBackdrop(hbo)}}
  >
    <img className="provimg" src={hbo} />
  </h5>
  <h5
    tabIndex={0}
    className={`showtime ${networkid === 67 ? 'active' : ''}`}
    onClick={() => {setNetworkid(67); setNettitle('Showtime') ; setBackdrop('https://media.themoviedb.org/t/p/h60/Allse9kbjiP6ExaQrnSpIhkurEi.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/Allse9kbjiP6ExaQrnSpIhkurEi.png'} />
  </h5>
  <h5
    tabIndex={0}
    className={`hulu ${networkid === 453 ? 'active' : ''}`}
    onClick={() => {setNetworkid(453); setNettitle('Hulu') ; setBackdrop('https://media.themoviedb.org/t/p/h100/pqUTCleNUiTLAVlelGxUgWn1ELh.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/pqUTCleNUiTLAVlelGxUgWn1ELh.png'} />
  </h5>
  <h5
   tabIndex={0}
    className={`max ${networkid === 3186 ? 'active' : ''}`}
    onClick={() => {setNetworkid(3186); setNettitle(' HBO Max') ; setBackdrop('https://media.themoviedb.org/t/p/h60/nmU0UMDJB3dRRQSTUqawzF2Od1a.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/nmU0UMDJB3dRRQSTUqawzF2Od1a.png'} />
  </h5>
  <h5
   tabIndex={0}
    className={`paramount ${networkid === 4330 ? 'active' : ''}`}
    onClick={() => {setNetworkid(4330); setNettitle('Paramount +') ; setBackdrop('https://media.themoviedb.org/t/p/h60/fi83B1oztoS47xxcemFdPMhIzK.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/fi83B1oztoS47xxcemFdPMhIzK.png'} />
  </h5>
  <h5
    tabIndex={0}
    className={`fx ${networkid === 88 ? 'active' : ''}`}
    onClick={() => {setNetworkid(88); setNettitle('FX Network') ; setBackdrop('https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/aexGjtcs42DgRtZh7zOxayiry4J.png')}}
  >
    <img className="provimg" src={fx} />
  </h5>
  <h5
  tabIndex={0}
    className={`prime ${networkid === 1024 ? 'active' : ''}`}
    onClick={() => {setNetworkid(1024); setNettitle('Amazon Prime Video') ; setBackdrop('https://media.themoviedb.org/t/p/h60/ifhbNuuVnlwYy5oXA5VIb2YR8AZ.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/ifhbNuuVnlwYy5oXA5VIb2YR8AZ.png'} />
  </h5>
   
  <h5
    tabIndex={0}
    className={`disney ${networkid === 2739 ? 'active' : ''}`}
    onClick={() => {setNetworkid(2739); setNettitle('Disney+') ; setBackdrop(disney)}}
  >
    <img className="provimg" src={disney} />
  </h5>
  <h5
    tabIndex={0}
    className={`fox ${networkid === 19 ? 'active' : ''}`}
    onClick={() => {setNetworkid(19); setNettitle('FOX') ; setBackdrop('https://media.themoviedb.org/t/p/h100_filter(negate,000,666)/1DSpHrWyOORkL9N2QHX7Adt31mQ.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/1DSpHrWyOORkL9N2QHX7Adt31mQ.png'} />
  </h5>
  <h5
    tabIndex={0}
    className={`comedyc ${networkid === 47 ? 'active' : ''}`}
    onClick={() => {setNetworkid(47); setNettitle('Comedy Central') ; setBackdrop('https://media.themoviedb.org/t/p/h60/6ooPjtXufjsoskdJqj6pxuvHEno.png')}}
  >
    <img className="provimg" src={'https://media.themoviedb.org/t/p/h60/6ooPjtXufjsoskdJqj6pxuvHEno.png'} />
  </h5>
            </div>
            <div className="boxoffice__lis">
  
    {shows && shows.map((show , s ) => (
      <div key={show.id + s} className="boxoffice__list"   >
       <img className="posterpp" src={apiConfig.w200Image(show.poster_path)} alt="Netflix" onClick={() => handleCardClick(show.id, 'tv' , show.title || show.name, show.poster_path)}/> 
        <h4 className="boxoffice__movie" onClick={() => handleCardClick(show.id, 'tv' , show.title || show.name, show.poster_path)} >{show.name || show.title}</h4>
        <p className="overviewboxoff">{show.overview}</p>
         <button
    //tabIndex={0}
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
  <p className="boxofficera" style={{ border: getColor(show.vote_average * 10) ,
  background: `linear-gradient(to top, ${getColor(show.vote_average * 10)} ${show.vote_average * 10}%,rgba(255, 255, 255, 0) 0)`
}}>
  {show.vote_average.toFixed(1)}
</p>
      </div>
    ))}
  
  {shows.length < showCount &&  (
    <div className="zest">
    <Button className="btn" onClick={() => { handlefetchmoreshows(networkid , nettitle  , pagecount + 1 ) ; setPagecount(pagecount + 1) ; handleShowMoreClick();} }>Show More shows from { nettitle}</Button>
    <Button className="btn" onClick={() => { scrollToTop()} }> <i className="bx bx-chevron-up"></i> </Button>
  
    </div>
   )}
</div>

        </div>
          </div>
           
   
    )
}

export default BoxOffice;

import React ,{ useEffect , useState }from "react";

import{UserAuth} from '../../context/AuthContext';
import { useFirestore } from "../../Firestore";
//import { getWatchlist, setWatchlist } from "../../Firestore";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import {db} from "../../Firebase";
//import {updateDoc,onSnapshot, doc} from "firebase/firestore";
import './savedshows.scss' ;
import Skeleton , { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { category } from "../../api/tmdbApi";


const SavedMovies = () => {
  const { user } = UserAuth();
  
  const{  getWatchlist , getFavourites ,addToFavourites , checkIfInFavourites  ,removeFromWatchlist , removeFromFavourites} = useFirestore();
  const [watchlist, setWatchlist] = useState({ all: [], movies: [], tv: [] });
const [activeList, setActiveList] = useState('all');
  const [myFavourites , setFavourites] = useState([])
  const [isLoading, setIsLoading] = useState(true);
 const [infavourites , setIsInFavourites] = useState(false)
 const [selectedItem, setSelectedItem] = useState(null);
 const [isInWatchlist, setIsInWatchlist] = useState(true);
 //const [isInFavourites, setIsIntyFavourites] = useState(false);
  useEffect(() => {
    if (user?.uid) {
      getWatchlist(user?.uid)
      .then((data) => {
        const movies = data.filter((item) => item.category === 'movie');
        const tv = data.filter((item) => item.category === 'tv');
        setWatchlist({ all: data, movies, tv });
       // console.log(movies, "tv", tv, "watchlist", watchlist.all);
     
      })
      
        getFavourites(user?.uid)
        .then((data) => {
          setFavourites(data);
          
          //console.log(data, "data");
        })
        .catch((err) => {
          console.log(err, "error getting Favourites");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.uid, getWatchlist ,getFavourites ,selectedItem , myFavourites]);


  const handleListChange = (list) => {
    setActiveList(list);
  };
  
  const AddfavShow = async(item) => {

      if (!user) {
        toast.error('Please log in to save a movie');
        return;
      }
  
      const data = {
        id: item?.id,
        title: item?.title || item?.name,
        category: item.category,
        poster_path: item?.poster_path,
        release_date: item?.release_date || item?.first_air_date,
        vote_average: item?.vote_average,
        //overview: details?.overview,
      };
      //console.log(data)
  
      const dataId = item?.id?.toString();
      await addToFavourites(user?.uid, dataId, data);
      const isSetToWatchlist = await checkIfInFavourites(user?.uid, dataId);
      setIsInFavourites(isSetToWatchlist);
    };
  
    useEffect(() => {
      if (selectedItem) {
        checkIfInFavourites(user?.uid, selectedItem?.id).then((data) => {
          setIsInFavourites(data);
        });
      }
    }, [selectedItem, user, checkIfInFavourites , AddfavShow ]);
    useEffect(() => {
      if (watchlist.all && watchlist.all.length > 0) {
       // setActiveList('all');
      }
    }, [watchlist]);
    // ...


    const handleRemoveFromWatchlist = async (item) => {
      await removeFromWatchlist(user?.uid, item.id);
      const updatedWatchlist = await getWatchlist(user?.uid);
      const movies = updatedWatchlist.filter((item) => item.category === 'movie');
      const tv = updatedWatchlist.filter((item) => item.category === 'tv');
      setWatchlist({ all: updatedWatchlist, movies, tv });
    };
    const handleRemoveFromFavourites = async (item) => {
      await removeFromFavourites(user?.uid, item.id);
      const updatedFavourites = await getFavourites(user?.uid);
  
      setFavourites(updatedFavourites);
    };
    //console.log(myFavourites)
 

    const handlecardClick = (id,category, title, poster_path) => {
      let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
      if (!Array.isArray(continueWatching)) {
          continueWatching = [];
      }
      const foundItem = continueWatching.find(item => item.id === id);
      if (!foundItem) {
          continueWatching = [...continueWatching, {id,category, title, poster_path }];
          localStorage.setItem('ContinueWatching' , JSON.stringify(continueWatching));
          //console.log(continueWatching);
      }
      navigate(`/${category}/${id}`);
    }
    const navigate = useNavigate();

   return(
     <>
        {isLoading && (
        <div className="load">loading</div>
      )}
      {!isLoading && watchlist?.length === 0 && (
        <div className="load">No Saved Movies</div>
      )}
      {!isLoading &&  watchlist[activeList] && watchlist[activeList].length > 0 ? (
        <>
        <div className="categorytoggle">
        <Button
          className={`toggle-button ${activeList === 'all' ? 'active' : ''}`}
          onClick={() => handleListChange('all')}
        >
          All
        </Button>
        <Button
          className={`toggle-button ${activeList === 'movies' ? 'active' : ''}`}
          onClick={() => handleListChange('movies')}
        >
          Movies
        </Button>
        <Button
          className={`toggle-button ${activeList === 'tv' ? 'active' : ''}`}
          onClick={() => handleListChange('tv')}
        >
          TV Shows
        </Button>
      </div>
           <div className="watchlist" style={{color : 'white'}}>
            <div className="fave"><h3  className="favz">thy Watchlist</h3></div>
          
             {
           watchlist[activeList].map((item, i) => 
              <div  
               key={i}
               className="watchlistcard">
                  
                  <div className="watchlistimgcontainer" onClick={() => handlecardClick(item.id, item.category, item.title, item.poster_path)}>
                  {
                      item ? (<img  className="watchlistimg" 
                      src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                      alt=""
                      
                      />) : (  <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular"  className="movie-imgx" />
                      </SkeletonTheme>
                      )
                    }
              </div>
              <div className="features">
                <div className="featuretitlew" onClick={() => {handleRemoveFromWatchlist(item)}}><h4 className="r">Watched </h4> <i className='bx bx-check-double'></i></div>
               
                {Object.values(myFavourites).some((favourite) => favourite.id === item.id) ? (
   
    <div
      className="featuretitlef"
    >
      <h4 className="r">I likey </h4>
      <i className="bx bxs-heart"></i>
    </div>
  ) : (
    <div
      className="featuretitlef"
      onClick={() => {
        AddfavShow(item);
        setSelectedItem(item);
      }}
    >
      <h4 className="r">add to Favourite</h4>
      <i className="bx bx-heart"></i>
    </div>
  )
} 
<div className="featuretitle"> <h4 className="r">{item.title} • {item.release_date.split('-')[0]}</h4> </div>
              </div>
             </div>  
              
           )}
           </div>
           </>
      ) : (
        <div className="load">There's Nothing Here <i className='bx bxs-bowl-hot'></i> <Button  className={`toggle-button ${activeList === 'all' ? 'active' : ''}`}
        onClick={() => handleListChange('all')}> go back</Button><button
       
      ></button></div>
      )}
     
      
      {isLoading && (
        <div className="load">loading</div>
      )}
      {!isLoading && myFavourites?.length === 0 && (
        <div className="load">No Favourites</div>
      )}
      {!isLoading && myFavourites?.length > 0 && (
        
           <div className="watchlist" style={{color : 'white'}}>
            <div className="fave"><h3  className="fav">thy Favourites</h3></div>
             {
           myFavourites.map((item, i) => 
              <div  
               key={i}
               className="watchlistcard">
                  
                  <div className="watchlistimgcontainer" onClick={() => handlecardClick(item.id, item.category, item.title, item.poster_path)}>
                  {
                      item ? (<img  className="watchlistimg" 
                      src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                      alt=""
                      
                      />) : (  <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular"  className="watchlistimg" />
                      </SkeletonTheme>
                      )
                    }
              </div>
              <div className="featureswa">
                  <div className="featuretitlefz" >⋆ ── .⋆ <h4 className="r"><i class='bx bxs-heart'></i></h4>  </div>
                  <div className="featuretitlewf"> <h4 className="r2">----</h4></div>
              
                <div className="featuretitle" onClick={() => {handleRemoveFromFavourites(item)}}> <h4 className="r">{item.title} • {item.release_date.split('-')[0]}</h4> <i className='bx bxs-trash'></i> </div>
                 
              </div>
             </div>  
              
           )}
           </div>
      )}
        
     </>
   )
}
export default SavedMovies;

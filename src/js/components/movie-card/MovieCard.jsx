import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './movie-card.scss';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import apiConfig from "../../api/apiConfig";
import {UserAuth} from "../../context/AuthContext";
import {db} from "../../Firebase";
import { useFirestore } from "../../Firestore";
import{arrayUnion , doc , updateDoc , setDoc} from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Skeleton , { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { addDoc, collection } from "firebase/firestore"; 
import { category } from '../../api/tmdbApi';


const MovieCard = React.memo((props) => {
    const {user} = UserAuth();
    const { addToWatchlist, checkIfInWatchlist  } = useFirestore();
 
    const [saved , setSaved] = useState(false);

    const item = props.item  // Add a fallback empty object if item is undefined

    const [isInWatchlist, setIsInWatchlist] = useState(false);
     const releaseYear = item?.release_date || item?.first_air_date;
    const year = (new Date(releaseYear)).getFullYear();
    //console.log(year);
    //const movieDoc = doc(db , 'users' ,  `${user?.email}`);
    const saveShow = async (event) => {
      event.preventDefault();
      event.stopPropagation();

        if (!user) {
          toast.error('Please log in to save a movie');
          return;
        }
    
        const data = {
          id: item?.id,
          title: item?.title || item?.name,
          category: props.category,
          poster_path: item?.poster_path,
          release_date: item?.release_date || item?.first_air_date,
          vote_average: item?.vote_average,
          //overview: details?.overview,
        };
    
        const dataId = item?.id?.toString();
        await addToWatchlist(user?.uid, dataId, data);
        const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
        setIsInWatchlist(isSetToWatchlist);
      };
    
      useEffect(() => {
        if (!user) {
          setIsInWatchlist(false);
          return;
        }
    
        checkIfInWatchlist(user?.uid, item?.id).then((data) => {
          setIsInWatchlist(data);
        });
      }, [item, user, checkIfInWatchlist]);
    
    const navigate = useNavigate();

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
    const inCinema = (releaseDate) => {
        const today = new Date();
        const threeWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (4 * 7));
        if (props.category === 'movie') {
            if (releaseDate < today) {
                return releaseDate > threeWeeksAgo ? '  In Cinema' : '';
            }
            else{
                return 'Coming Soon';
            }
        }
        return '';
    }
    const cinemaStatus = inCinema(new Date(item.release_date || item.first_air_date));
    const [isLoading, setIsLoading] = useState(true);
    const [bg, setBg] = useState(null);
  
    React.useEffect(() => {
      if (item?.title !== 'Conclave') {
        const img = new Image();
        img.onload = () => {
          setIsLoading(false);
          setBg(apiConfig.w500Image(item.poster_path)); // Set the bg state variable using the apiConfig.w500Image function
        };
        img.src = apiConfig.w200Image(item.poster_path);
      } else {
        setIsLoading(false);
      }
    }, [item.poster_path]);
    if (item?.title === 'Conclave') {
      return null;
    }

    const voteAverage = item.vote_average; // example vote average
    const votePercentage = voteAverage * 10; // convert to percentage

    const getColor = (votePercentage) => {
      if (votePercentage >= 86) {
        return '#9b59b6'; // Royal Purple for the best of the best
      } else if (votePercentage >= 70) {
        return '#2ecc71'; // Emerald Green for 70 and above
      } else if (votePercentage >= 60) {
        return '#f1c40f'; // Sunflower Yellow for 60 and above
      } else if (votePercentage >= 55) {
        return '#e67e22'; // Carrot Orange for 55 and above
      } else {
        return '#e74c3c'; // Red for lower ratings
      }
          
     
  
  }

  
    //console.log(`${votePercentage}%`); // output: 74%
  
    return (
        <>
        <div>
        
        {isLoading ? (
          <SkeletonTheme  baseColor='#ffffff11' enableAnimation={false} >
            <Skeleton borderRadius={20} className="movie-card" style={{background: 'linear-gradient(120deg, rgba(20, 20, 20, 0.7), rgba(91, 81, 0, 0.38))' ,margin :'0 5px' , height : '270px' , width : '190px'}} customHighlightBackground = 'linear-gradient(120deg, rgba(0, 28, 0, 0.7), rgba(66, 0, 13, 0.7))' variant="rect" />
          </SkeletonTheme>
        ) : (
         
          <div className="movie-card" onClick={() => handlecardClick(item.id,props.category, item.title || item.name, item.poster_path)}  style={{backgroundImage : `url(${bg})`, backgroundSize : 'cover' , backgroundPosition : 'center' , backgroundRepeat : 'no-repeat'}}>
            <div className="inCinema">
              <i className='bx bx-badge-check' style={{fontSize :'12px'}}></i> { cinemaStatus}
            </div>
             <div className="btnz">
            <i className='bx bx-play-circle'></i>
            </div>
            <h4 className='year'>
            {Number.isNaN(year) ? '' : year}
           </h4>
              
            <div className="infomovie">
            <div className="title">
              <div className="titlename">
                {item.title || item.name }
              </div> 
            </div>
            <div className="vote" style={{color: getColor(votePercentage.toFixed(0))}}>{votePercentage.toFixed(0)}%</div> 
          
            <div className="cat"> 
            <div className="catz">{props.category === 'tv' ? 'Show' : 'Movie'}</div> 
          
            <button className="savemovie" onClick={saveShow}>    <p style={{ cursor : 'pointer' , color : isInWatchlist ? 'aqua' : 'rgba(255, 255, 255, 0.549)'}}>
          {isInWatchlist ? <i className='bx bxs-bookmark-plus'  style={{fontSize :'19px'}}></i> :<i className='bx bx-bookmark-plus' style={{fontSize :'18px'}}></i>}
           </p>
              </button>
                </div>
          </div>
          </div> 
         
          
        )}
    
          
         
           </div>
        </>
    );
});
MovieCard.propTypes = {
  category: PropTypes.string.isRequired,
  item: PropTypes.shape({ title : PropTypes.string , name : PropTypes.string , poster_path : PropTypes.string , id : PropTypes.number.isRequired , vote_average : PropTypes.number }).isRequired
};

export default MovieCard;

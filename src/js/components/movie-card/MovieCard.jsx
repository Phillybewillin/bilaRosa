import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './movie-card.scss';
import {Link} from 'react-router-dom';
import {category} from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import {UserAuth} from "../../context/AuthContext";
import {db} from "../../Firebase";
import{arrayUnion , doc , updateDoc} from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Skeleton , { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MovieCard = (props) => {
    const {user} = UserAuth();
    const [saved , setSaved] = useState(false);

    const item = props.item  // Add a fallback empty object if item is undefined


    const movieDoc = doc(db , 'users' ,  `${user?.email}`);
    const releaseYear = item?.release_date || item?.first_air_date;
    const year = (new Date(releaseYear)).getFullYear();
    //console.log(year);
    
    const saveShow = async () => {
        if(user?.email){
            if(user){
            setSaved(true);
            try{
                const collection = item.title ? 'movies' : 'tv';
                await updateDoc(movieDoc , {
                [collection] : arrayUnion({
                    id : item.id,
                    title : item.title || item.name,
                    img : item.poster_path || item.backdrop_path

                })
            })
            }catch(error){
                console.log("error saving ", error);
            }
        }else{
            console.log("invalid data");
        }
            
        }else{
            toast.error("Please logIn to save a Movie");
        }
    }
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
    
    const link = '/' + category[props.category] + '/' + item.id;

    //onst bg = apiConfig.w500Image(item.poster_path || item.backdrop_path);
    const inCinema = (releaseDate) => {
        const today = new Date();
        const threeWeeksAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (5 * 7));
        if (props.category === 'movie') {
            if (releaseDate < today) {
                return releaseDate > threeWeeksAgo ? ' • In Cinema' : '';
            }
            else{
                return '.Coming soon';
            }
        }
        return '';
    }
    const cinemaStatus = inCinema(new Date(item.release_date || item.first_air_date));
    const [isLoading, setIsLoading] = useState(true);
    const [bg, setBg] = useState(null);
  
    React.useEffect(() => {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setBg(apiConfig.w500Image(item.poster_path || item.backdrop_path)); // Set the bg state variable using the apiConfig.w500Image function
      };
      img.src = apiConfig.w500Image(item.poster_path || item.backdrop_path);
    }, [item]);

    const voteAverage = item.vote_average; // example vote average
    const votePercentage = voteAverage * 10; // convert to percentage

    const getColor = (votePercentage) => {
      if (votePercentage >= 86) {
          return 'magenta';
      } else if (votePercentage >= 70) {
          return 'rgb(9, 255, 0)';
      } 
      else if (votePercentage >= 55) {
          return 'yellow';
      } else {
        return 'red';
      }
          
     

  }
    //console.log(`${votePercentage}%`); // output: 74%
  
    return (
        <>
        <div>
        <Link to={link}>
        {isLoading ? (
          <SkeletonTheme color="#000000" highlightColor="#444444">
            <Skeleton baseColor="#161616d6" variant="rectangular"  className="movie-card" width={'100%'} height={'100%'} />
          </SkeletonTheme>
        ) : (
          <div className="movie-card" loading="lazy" onClick={() => handlecardClick(item.id, props.category ,item.title || item.name, item.poster_path, )} style={{backgroundImage : `url(${bg})`, backgroundSize : 'cover' , backgroundPosition : 'center' , backgroundRepeat : 'no-repeat'}}>
            <div className="inCinema">
              <i className='bx bx-badge-check' style={{fontSize :'13px'}}></i> {cinemaStatus}
            </div>
            <div className="catz">{props.category }</div> 
            <div className="btnz" style={{fontSize : '20px'}}>
              <i className="bx bx-play"></i>
            </div>
            <div loading="lazy"  className="infomovie">
            <div className="title">
              <div className="titlename">
                {item.title || item.name || <Skeleton count={1}/>}
              </div> 
              <div className="savemovie">
                 <p onClick={saveShow} style={{cursor : 'pointer' , color : saved ? 'red' : 'rgba(255, 255, 255, 0.549)'}}>
          {saved ? <i class='bx bxs-bookmark-plus'  style={{fontSize :'19px'}}></i> :<i class='bx bx-bookmark-plus' style={{fontSize :'18px'}}></i>}
           </p>
              </div>
           
            </div>
            <div className="cat"> 
            <h4 className='year'>
            • {Number.isNaN(year) ? '' : year}
           </h4>
                <div className="vote" style={{color: getColor(votePercentage.toFixed(0))}}>{votePercentage.toFixed(0)}%</div> </div>
          </div>
          </div> 
        )}
      </Link>
          
         
           </div>
        </>
    );
}

export default MovieCard;

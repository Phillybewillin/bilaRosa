import { useState, useEffect } from 'react';
import{  useParams } from 'react-router-dom';

//import PageHeader from '../../components/page-header/PageHeader';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';
import Button, { OutlineButton }  from '../../components/button/Button';

import {UserAuth} from "../../context/AuthContext";
import {db} from "../../Firebase";
import{arrayUnion , doc , updateDoc} from "firebase/firestore";

import './detail.scss';
import Seasons from './Seasons';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
      
    const { category, id } = useParams();

    const [item, setItem] = useState(null);

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params: {}});
            setItem(response);
            window.scrollTo(0, 0);
           // console.log(response);
        }
        getDetail();
    }, [category, id]);

    const getColor = (vote_average) => {
        if (vote_average >= 7.4) {
            return 'rgb(9, 255, 0)';
        } else if (vote_average >= 5.1) {
            return 'rgb(255, 251, 0';
        } else {
            return 'red';
        }

    }

    const getGenreColor = (genre) => {
        switch (genre) {
            case 'Action':
                return 'red';
            case 'Horror':
                return 'black';
            case 'Adventure':
                return 'orange';
            case 'Drama':
                return 'crimson';
            case 'Animation':
                return 'aquamarine';
            case 'Fantasy':
                return ' #f505a1';
            case 'Science Fiction':
                return 'silver';
            case 'Romance':
                return 'red';
            case 'Comedy':
                return 'yellow';
            case 'Crime':
                return 'darkgrey';
            case 'Thriller':
                return 'grey';
            case 'Family':
                return 'gold';
            case 'Mystery':
                return 'brown';
            case 'War':
                return 'junglegreen';
            case 'History':
                return 'lightbrown';
            case 'Music':
                return 'pink';
            case 'Western':
                return 'lightorange';
            case 'Documentary':
                return 'brown';
            case 'TV Movie':
                return 'aqua';
            case 'Foreign':
                return 'lightgreen';
            case 'Action & Adventure':
                return ' #05f5bd';
            case 'Science Fiction & Action':
                return 'lightblue';
            case 'Science Fiction & Horror':
                return '#052f01';
            case 'Sci-Fi & Fantasy':
                return '#5b07c0';
            case 'Horror & Thriller':
                return 'black';
            case 'Action & Thriller':
                return 'red';
            case 'Sci-Fi':
                return 'silver';
            case 'Horror & Mystery':
                return 'darkred';
            case 'kids':
                return 'pink';
            case 'Drama & Horror':
                return 'black';
            case 'War & Politics':
                return 'rgb(98, 65, 0)';

            default:
                return 'white';
        }
    }
    const {user} = UserAuth();
    const [ ,setSaved] = useState(false);

    const movieID = doc(db , 'users' ,  `${user?.email}`);

    const saveShow = async () => {
        if(user?.email){
            if(user){
            setLike(!like);
            setSaved(true);
            try{
                const collection = item.title ? 'movies' : 'tv';
                await updateDoc(movieID , {
                [collection] : arrayUnion({
                    id : item.id,
                    title : item.title || item.name,
                    img : item.poster_path || item.backdrop_path

                })
               
            })
            }catch(error){
                console.log("error saving ", error);
            }
            toast.success('Saved successfully');
        }else{
            console.log("invalid data");
        }
            
        }else{
            toast.error('Please logIn to save a movie');
        }
    }
    
    const [like , setLike] = useState(false);
   
   
         
        // Function to set the iframe src based on the item type

        useEffect(() => {
            const blurDivs = document.querySelectorAll('.movie-content__poster');
            blurDivs.forEach(div => {
                const img = div.querySelector('.movie-content__poster__img');
                const originalImageUrl = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);
        
                function loaded() {
                    div.classList.add('loaded');
                    div.classList.remove('w200');
                    img.style.backgroundImage = `url(${originalImageUrl})`;
                }
        
                if (img.complete) {
                    loaded();
                } else {
                    img.addEventListener('load', loaded);
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        useEffect(() => {
            const blurDivs = document.querySelectorAll('.movie-content__poste');
            blurDivs.forEach(div => {
                const img = div.querySelector('.banner');
                const originalImageUrl = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);
        
                function loaded() {
                    div.classList.add('loaded');
                    div.classList.remove('w200');
                    img.style.backgroundImage = `url(${originalImageUrl})`;
                }
        
                if (img.complete) {
                    loaded();
                } else {
                    img.addEventListener('load', loaded);
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        
        const navigate = useNavigate();
  
        const handlePlayer = (itemId, itemName) => {
          console.log('handlePlayer function called', itemId, itemName);

          if (itemName && itemId) {
              const encodedTitle = encodeURIComponent(itemName.replace(/ /g, '-').toLowerCase());
              console.log(`Navigating to: /watch/${encodedTitle}/${itemId}`);
              navigate(`/watch/${encodedTitle}/${itemId}`);
              console.log(itemId, itemName);
          }
      };

    return (
        <>
            {
                item && (
                    <>
                    <div className="movie-content__poste" style={{backgroundImage: `url(${apiConfig.w200Image(item.backdrop_path ? item.backdrop_path : item.poster_path)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transition: 'filter 0.5s ease'}}>
                    <div className="banner" loading="lazy" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',position: 'fixed', top: '0' , left: '0' , width: '100%' , height: '100vh'}}></div>
                    </div> 
                       <div className="detail-container">
                           <div className="movie-content__poster" style={{ backgroundImage: `url(${apiConfig.w200Image(item.poster_path ? item.poster_path : item.backdrop_path)})`, backgroundSize: 'cover', backgroundPosition: 'center',backgroundRepeat: 'no-repeat',borderRadius: '10px'}} >
                               <div className="movie-content__poster__img" loading="lazy" style={{ backgroundImage: `url(${apiConfig.w1280Image(item.poster_path ? item.poster_path : item.backdrop_path)})`}}>
                               </div>
                           </div>

                           <div className="movie-content__info">
                               <h2 className="title">
                                   {item.title || item.name}
                               </h2>
                               <div className="genres" >
                                {
                                    item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item" style={{borderColor:  getGenreColor(genre.name)}}>{genre.name}</span>
                                    ))
                                }
                               </div>
                              <p onClick={saveShow} style={{position : 'absolute', backgroundColor : 'white' , padding : '5px' ,borderRadius : '5px', top : '2px' , right : '5px' , cursor : 'pointer' , color : like ? 'red' : 'black'}}>
                                     {like ? <i className='bx bxs-bookmark-plus'  style={{fontSize :'17px'}}></i> :<i className='bx bx-bookmark-plus' style={{fontSize :'17px'}}></i> }
                               </p>
                               <div className="secz">
                                <div className="runtime"><i className="bx bx-time"></i>{item.runtime || item.episode_run_time} min</div>
                                <div className="rating" style={{color: getColor(item.vote_average)}}>
                      
                              <h4> Rating : {item.vote_average} </h4>
                             
                               <i className={`bx bx-bomb ${getColor(item.vote_average)}`} ></i>
                                 
                              </div>
                              <div className="release-date"><i className="bx bx-calendar"></i> {item.release_date || item.first_air_date}</div>
                            <div className="language"><i className="bx bx-world"></i> {item.original_language.toUpperCase()}</div>
                               </div>
                               <div className="overviewz">
                                <h4 className='titleoverview'>Overview</h4>
                                 <p className="overview">{item.overview}</p>
                                 </div>
                               
                              {category === 'tv' && <Seasons category={category}
                              id={item.id} title={item.name || item.title}/>
                              }
                              {category === 'movie' && 
                              <>
                              <div className="playbtn" onClick={() => handlePlayer(item.id, item.name || item.title)}><i className='bx bx-play-circle' style={{color: 'white', fontSize: '50px'}}></i>Play</div>
                        
                        <div className="butz">

                        <Button className="btn" onClick={() => handlePlayer(item.id, item.name || item.title)}>Watch Now</Button>
                      </div>
                              </>
                            
                             }  

                                 
                           </div>
                       </div> 
                       <div className="overview">
                                       <div className="overview">
                                           <h4 className='titledetails'>Casts</h4>
                                       </div>
                                       <CastList id={item.id}/> 
                        </div>
                       <div className="section mb-3">
                               <div className="overview">
                                   <h3 className='titledetails'>You might also like</h3>
                               </div>
                               <MovieList category={category} type="similar" id={item.id}/>
                           </div>
                       
                       <ToastContainer theme='dark' position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#ff0000' , color : 'white', borderRadius : '5px'}}/>
           
                    </>
                )
            }
        </>
    );
}

export default Detail;

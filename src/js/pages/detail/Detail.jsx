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
import MovieCard from '../../components/movie-card/MovieCard';

const Detail = () => {
      
    const { category, id } = useParams();

    const [item, setItem] = useState(null);
    const [items, setItems] = useState([]);
     
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, {params: {}});
      const similar = await tmdbApi.similar(category, id )

      setItems(similar)

      setItem(response);
     //console.log(similar);
  }
  useEffect(() => {
    document.title =  item ? `${item?.title || item?.name} - Watch on ZillaXR` : 'ZillaXR';
    getDetail();
    //console.log('items:', items);
  }, [category, id , item]);

  

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
      const releaseYear = item?.release_date || item?.first_air_date;
      const year = (new Date(releaseYear)).getFullYear();
    
      const voteAverage = item?.vote_average;
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
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <>
            {
                item && (
                    <>
                    
                       <div className="detail-container">
                       <>
                    <div className="banner" loading="lazy" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',position: 'absolute', top: '0' , left: '0' , width: '100%' , height: '55vh'}}></div>
                    </>
                        <div className="movie-content">
                           <div className="movie-content__info">
                            <div className="titleholder">
                               <h2 className="title">
                                   {item.title || item.name}
                                  
                               </h2>
                               <div className="language"><i className="bx bx-world" style={{fontSize:'11px'}}></i> {item.original_language.toUpperCase()}</div>
                               <div className="language">• {Number.isNaN(year) ? '' : year}</div>
                                <div className="language"><i className="bx bx-time" style={{fontSize:'11px'}}></i>{item.runtime || item.episode_run_time} min</div>
                            
                            </div>
                              
          
                               <div className="overviewz">
                                
                                 <p className="overviewz">{item.overview}</p>
                                 </div>
                               <div className="genres" >
                                {
                                    item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="genres__item" style={{borderColor:  getGenreColor(genre.name)}}>{genre.name}</span>
                                    ))
                                }
                               </div>
                               <div className="rating" style={{color: getColor(votePercentage.toFixed(0))}}>{votePercentage.toFixed(0)}%</div>
                               <p onClick={saveShow} style={{ position:'absolute', bottom:'0' ,right:'0',cursor : 'pointer' , color : like ? 'red' : 'black'}}>
                                     {like ? <i className='bx bxs-bookmark-plus'  style={{fontSize :'17px'}}></i> :<i className='bx bx-bookmark-plus' style={{fontSize :'17px'}}></i> }
                               </p>
                            
                               
                              {category === 'tv' && <Seasons category={category}
                              id={item.id} title={item.name || item.title}/>
                              }
                              {category === 'movie' && 
                              <>
                              
                        <div className="playbtn">

                        <Button className="btn" onClick={() => handlePlayer(item.id, item.name || item.title)}>Watch Now</Button>
                      </div>
                              </>
                            
                             }  

                                 
                           </div>
                        </div>

                        <div className="castdiv">
                        <h4 className='titledetailz'>Cast</h4>

                                       <div className="castdix">
                                           <p className='cast'><CastList id={item.id}/></p>
                                            
                                       </div>
                                       
                        </div>
                           
                       </div> 
                       <div className="overviewz">
                                   <h3 className='titledetails'>Recommendations based on {item.title || item.name}</h3>
                      </div>
                       <div className="wrappwez">
                              
                               {
                   items.results.map((itemz ,ia) =>(
                    
                            <div className="wrappwezs" key={ ia} onClick={scrollToTop}>
                            
                            <MovieCard item={itemz} category={category} key={itemz.id}/>
                            {itemz.overview && <p className="overviewz">{itemz.overview}</p>}
                        </div>
                        
                        
                        
                    ))
                }
                           </div>
                       
                       <ToastContainer theme='dark' position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#ff0000' , color : 'white', borderRadius : '5px'}}/>
           
                    </>
                )
            }
        </>
    );
}

export default Detail;

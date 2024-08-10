import React ,{ useEffect , useState}from "react";

import{UserAuth} from '../../context/AuthContext';

import { useNavigate } from "react-router-dom";

import {db} from "../../Firebase";
import {updateDoc,onSnapshot, doc} from "firebase/firestore";

import './savedshows.scss' ;

import Skeleton , { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const SavedShows = () => {
    const {user} = UserAuth();

    const [items, setItems] = useState([]);

    
    useEffect(()=>{
       if(user?.email){
        const docRef = doc(db , 'users' ,user.email );
        const unsubscribe = onSnapshot(docRef,(docSnapshot)=>{
            const tv = docSnapshot.data()?.tv || [];
            setItems(tv);
        });
       
        return () => unsubscribe();
       }
    },[user?.email]);
    
    const deleteShow = async (passedID) => {
      if(user?.email){
         const movieRef = doc(db , 'users' , user.email)
         try{
            const tvresult = items.filter((item) => item.id !== passedID);
            await updateDoc(movieRef , {
              tv: tvresult.filter((item) => item.title !== undefined),
            });
          }catch(error){
             console.log(error);
          }
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
    const handleClick = (id) => {
      if(id) {
        navigate(`/tv/${id}`, {replace: true});
      } else {
        console.log("hello");
      }
    }
   return(
     <>
        
           <div className="movie-gridz">
             {
               items.map((item, i) => 
              <div  
               key={i}
               className="movie-cardx" onClick={() => handleClick(item.id)}>
                  
                  <div className="d" onClick={() => handlecardClick(item.id, 'tv', item.title, item.img)}>
                    {
                      item ? (<img  className="movie-imgx"
                      src={`https://image.tmdb.org/t/p/w500/${item.img}`}
                      alt=""
                      
                      />) : (
                      <SkeletonTheme color="#000000" highlightColor="#444">
                        <Skeleton baseColor="#161616d6" variant="rectangular"  className="movie-imgx" />
                      </SkeletonTheme>)
                    }
                
               <div onClick={(e)=> {
                  e.stopPropagation();
                  deleteShow(item.id);
               }} style={{position : 'absolute' , top : '2px' , right : '-3px' , cursor : 'pointer' , fontSize : '1.5rem', color : 'red'}} ><i className="bx bx-trash"></i>
               </div>
               <h4 className="movie-titlex">{item.title}</h4>
               </div>
                
                 
             
             </div>  
              
           )}
           </div>
        
     </>
   )
}
export default SavedShows;

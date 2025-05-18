import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import './detail.scss';
import MovieCard from "../../components/movie-card/MovieCard";

const CastList = (props) => {
  const { category } = useParams();
  const [casts, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const getCredits = async () => {
      try {
        const res = await tmdbApi.credits(category, props.id);
        setCast(res.cast.slice(0, 15));
        setCrew(res.crew.filter(c =>
          ['Director', 'Producer', 'Writer', 'Screenplay'].includes(c.job)
        ));
      } catch (error) {
        console.error(error);
      }
    };
    getCredits();
  }, [category, props.id]);

const openModal = async (actor) => {
  try {
    const res = await tmdbApi.personCombinedCredits(actor.id);

    // Filter for released items only
    const releasedItems = res.cast.filter(item => {
      const releaseDate = item.release_date || item.first_air_date;
      return releaseDate && new Date(releaseDate) <= new Date();
    });

    // Remove duplicates by ID
    const uniqueItemsMap = new Map();
    releasedItems.forEach(item => {
      if (item.poster_path && !uniqueItemsMap.has(item.id)) {
        uniqueItemsMap.set(item.id, item);
      }
    });

    // Convert map to array and sort by rating
    const sorted = Array.from(uniqueItemsMap.values())
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 30);

    setModalData({
      ...actor,
      known_for: sorted,
    });

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};



  const closeModal = () => setModalData(null);

 useEffect(() => {
  const handleEsc = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const handlePopState = (event) => {
    // Only close this modal if the popped state was ours
    if (event.state?.modalA) {
      closeModal();
    }
  };

  // Push Modal A's own state
  const currentState = window.history.state || {};
  const newState = { ...currentState, modalA: true };
  window.history.pushState(newState, '');

  // Add listeners
  document.addEventListener('keydown', handleEsc);
  window.addEventListener('popstate', handlePopState);

  return () => {
    document.removeEventListener('keydown', handleEsc);
    window.removeEventListener('popstate', handlePopState);

    // Only pop history if we actually pushed it
    if (window.history.state?.modalA) {
      window.history.back();
    }
  };
}, []);


useEffect(() => {

 closeModal();
}, [props.id , category , casts]);

  console.log('modalData', modalData);
  return (
<>
 <div className="castlist">
        <div className="one">
            {crew.length > 0 && (
                  <h4 className='sammzy'>THE CREW</h4>
                          
            )}
                                      
                            </div>
    <div className="crewdetails">

         {/* Crew Info */}
      {crew.length > 0 && (
        <div className="crew">
          {crew.map((person, i) => (
            <div key={i} className="crew__item" onClick={() => openModal(person)}>
              <strong>{person.job}:
             </strong> {person.name}
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="one">
        {casts.length > 0 && (
         <h4 className='sammzy'>THE CAST</h4>
       
        )}
                                       
    </div>
    <div className="casts">
      {/* Cast List */}
      {casts.map((item, i) =>
        item.profile_path && (
          <div
            key={i}
            className="casts__item"
            onClick={() => openModal(item)}
          >
            <div
              className="casts__item__img"
              style={{
                backgroundImage: `url(${apiConfig.w200Image(item.profile_path)})`,
              }}
            ></div>
            <div className="aligners">
              <h6 className="casts__item__name">{item.name}</h6>
              <h6 className="casts__item__char">as {item.character}</h6>
            </div>
          </div>
        )
      )}

      
    </div>
     
    </div> 
     {/* Modal */}
      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
            
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                
              <img
                src={apiConfig.w500Image(modalData.profile_path)}
                alt={modalData.name}
                className="modal-avatar"
              />
              <h3>Name : {modalData.name}</h3>
               <h4> as {modalData.character || modalData.department}</h4>
                <h3 className="modal-deps">Department: {modalData.known_for_department}</h3>
          
            </div>
              
            <div className="modal-body">
                {modalData.known_for.length > 0 && <h4>Known For:</h4>}
               
              <div className="modal-movies">
                {modalData.known_for.map((movie, idx) => (
                  <div key={idx} className="modal-movie">
                    <MovieCard item={movie} category={movie.media_type} />
                  </div>
                ))}
              </div>
           
             
            </div>
            <button className="close-btn" onClick={closeModal}><i className="bx bx-x"></i></button>
          </div>
        </div>
      )}
</>
   
  );
};

export default CastList;

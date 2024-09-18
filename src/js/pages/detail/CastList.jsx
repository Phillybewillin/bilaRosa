import React , { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import './detail.scss';

const CastList = (props) => {

    const {category} = useParams();

    const [casts , setCast] = useState([]);

    useEffect(() => {

        const getCredits = async () => {
            try {
                const res = await tmdbApi.credits(category , props.id);
                setCast(res.cast.slice(0 , 15));
               // console.log(res.cast.slice(0 , 15));
            } catch (error) {
                console.error(error);
            }
        }
        getCredits();
    },[category , props.id]);

    
    return (
      <div className="casts">
         {
             casts && casts.map((item , i) => (
                 item.profile_path && (
                     <div key={i} className="casts__item">
                         <div className="casts__item__img" loading="lazy" style={{ backgroundImage: `url(${apiConfig.w200Image(item.profile_path)})` }}>
                        </div>
                        <div className="aligners">
                         
                        <h6 className="casts__item__name">{item.name}</h6>
                        <h6 className="casts__item__char"> as {item.character}</h6>
                      
                        </div>
                       
                     </div>
                 )
             ))
         }
      </div>
  );
}

export default CastList;

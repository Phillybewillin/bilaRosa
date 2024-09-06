import React , { useState , useEffect} from "react";
import PropTypes from "prop-types";

import "./movie-list.scss"

import { SwiperSlide , Swiper } from "swiper/react";
import "swiper/css";

import { FreeMode,Navigation } from "swiper/modules";
import tmdbApi , {category} from "../../api/tmdbApi";
//import 'swiper/css/navigation';
const MovieCard = React.lazy(() => import('../movie-card/MovieCard'));




const MovieList = (props) => {

    const [items, setItems] = useState([]);
    useEffect(() => {
        const getList = async () => {
            let response = null; 
            const params = {};
                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(props.type, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(props.type, {params});
                }
            setItems(response.results);
        }
        getList();

    }, [props.category, props.type]);

    const mySwiperConfig = {
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
        },
        
        
    }
    return (
        <div className="movie-list" loading="lazy">
          
           <Swiper
               {...mySwiperConfig}
               grabCursor={true}
                spaceBetween={8}
                slidesPerView={"auto"}
                lazy={true}
                preloadImages={false}
                //mousewheel={ forceTouchEvents ? true : false}
                height={"100%"}
                direction={'horizontal'}
               navigation={true}
               //freeMode={true}
               cssMode={true}
               speed={100}
               

        modules={[FreeMode ,Navigation]}
        style={{
            minHeight: "300px",
            "--swiper-navigation-position": "absolute",
            "--swiper-navigation-margin-top": "10px",
            "--swiper-navigation-margin-bottom": "20px",
            "--swiper-navigation-left": "auto",
            "--swiper-navigation-right": "10px",
            "--swiper-navigation-size": "35px",
            "--swiper-navigation-color": "#1eff00",
          }}  
                
            >
                {
                    items.map((item) =>(
                    
                            <div className="wrappwe" key={item.id}>
                            <SwiperSlide key={item.id} >
                            <MovieCard item={item} category={props.category} key={item.id}/>
                        </SwiperSlide>
                        </div>
                        
                        
                        
                    ))
                }
            </Swiper>
           
        </div>
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired 
}

export default MovieList;

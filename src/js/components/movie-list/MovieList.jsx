import React , { useState , useEffect} from "react";
import PropTypes from "prop-types";

import "./movie-list.scss"

import { SwiperSlide , Swiper } from "swiper/react";
import "swiper/css";
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { FreeMode,Scrollbar,Mousewheel,Navigation } from "swiper/modules";
import tmdbApi , {category} from "../../api/tmdbApi";
import 'swiper/css/navigation';
import MovieCard from "../movie-card/MovieCard";


const MovieList = (props) => {

    const [items, setItems] = useState([]);
    useEffect(() => {
        const getList = async () => {
            let response = null; 
            const params = {};
            
            if (props.type !== "similar") {

                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(props.type, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(props.type, {params});
                }
            }else {
                response = await tmdbApi.similar(props.category, props.id);
            }
            setItems(response.results);
        }
        getList();

    }, [props.id, props.category, props.type]);

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
                //mousewheel={ forceTouchEvents ? true : false}
                height={"100%"}
                direction={'horizontal'}
               navigation={true}
               freeMode={true}
                scrollbar={true}
                cssMode={true}

        modules={[FreeMode, Scrollbar, Mousewheel, Navigation]}
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
                    items.map((item ,ia) =>(
                    
                            <div className="wrappwe" key={ ia}>
                            <SwiperSlide key={item.id || ia}
                            style={{fontSize: '18px', height: 'auto', WebkitBoxSizing: 'border-box', boxSizing: 'border-box', WebkitTapHighlightColor: 'red',overflow: 'auto'}}
                            >
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

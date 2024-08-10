import React,{useState, useEffect} from "react";

import { useParams } from "react-router-dom";

import tmdbApi from "../../api/tmdbApi";

const VideoList = (props) => {
    
    
    const {category} = useParams();

    const [videos , setVideos] = useState([]);

    useEffect(() => {

        const getVideos = async () => {
            const res = await tmdbApi.getVideos(category , props.id);
            setVideos(res.results.slice(0 , 1));
        }
        getVideos();
    },[category , props.id]);

    return (
        <>
        {
              videos.map((item , i) => (<Video key={i} item={item}/>))
        
        }
        </>
    );
}

const Video = (props) => {

    const item = props.item;

    const iframeRef = React.useRef(null);
    

    useEffect(() => {
        const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
        iframeRef.current.setAttribute('height' , height);
    })
   
    
    return (
        <div className="video">
            <div className="video__title">
                {item.name}
            </div>
            <iframe
                width="100%"
                height="auto"
                src={`https://www.youtube.com/embed/${item.key}`}
                title={item.name}
                ref={iframeRef}
                frameBorder="0"
                referrerpolicy="strict-origin-when-cross-origin" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    )
}


export default VideoList;
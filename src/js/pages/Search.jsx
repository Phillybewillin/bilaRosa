import React from "react";
import MovieCard from "../components/movie-card/MovieCard";
import apiConfig from "../api/apiConfig";
import { useLocation } from 'react-router-dom';
import './search.scss';
const Search = () => {
  const location = useLocation();
  const movies = location.state.movies;
  const value = location.state.value;

  document.title = `Search results for ${value} - ZillaXR`;
   // const { keyword } = useParams();
    //const [movies, setMovies] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');

    const getMoviesResult = async (searchValue) => {
        if (searchValue) {
            const url = `https://api.themoviedb.org/3/search/multi?query=${searchValue}&api_key=${apiConfig.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if(data.results){
                setMovies(data.results);}
        
        } else {
            setMovies([]);
        }
    };
    React.useEffect(() => {
        getMoviesResult(searchValue);
    }, [searchValue]);

    return (
        <div className="searchcontainer">
            <h1 className="searchtitle">SHOWING RESULTS FOR "{value}"</h1>
            <div className="movie-gridk">
                {
                    movies.map((item, i) => (
                        <MovieCard category={item.media_type} item={item} key={i} />
                    ))}
            </div>
        </div>
    );
};
  

export default Search;

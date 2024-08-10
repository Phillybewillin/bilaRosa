import React from "react";

import { useParams } from "react-router-dom";
import tmdbApi from "../api/tmdbApi";

import { category } from "../api/tmdbApi";
import Input from "../components/input/Input";

import MovieCard from "../components/movie-card/MovieCard";
import MovieList from "../components/movie-list/MovieList";
import apiConfig from "../api/apiConfig";

const Search = (props) => {
    const [movies, setMovies] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');

    const getMoviesResult = async (searchValue) => {
        if (searchValue) {
            const url = `https://api.themoviedb.org/3/search/${category}?query=${searchValue}&api_key=${apiConfig.apiKey}`;
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
        <div>
            <h1>Search for {searchValue}</h1>
            <Input
                type="search"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="movie-grid">
                {
                    movies.map((item, i) => (
                        <MovieCard category={props.category} item={item} key={i} />
                    ))}
            </div>
        </div>
    );
};
  

export default Search;
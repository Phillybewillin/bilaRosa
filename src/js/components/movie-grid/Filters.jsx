import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";
import "./filters.scss";
import Button,{OutlineButton} from "../button/Button";
import { ToastContainer } from "react-toastify";
const Filters = () => {
    const [genres, setGenres] = useState([]);
    const [countries] = useState([
        { name: 'United States', code: 'US' },
        { name: 'Canada', code: 'CA' },
        { name: 'Mexico', code: 'MX' },
        { name: 'United Kingdom', code: 'GB' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'Japan', code: 'JP' },
        { name: 'India', code: 'IN' },
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'Italy', code: 'IT' },
        { name: 'Russia', code: 'RU' },
        { name: 'South Korea', code: 'KR' },
        { name: 'Spain', code: 'ES' },
        { name: 'Argentina', code: 'AR' },
        { name: 'Netherlands', code: 'NL' },
        { name: 'Nigeria', code: 'NG' },
        { name: 'Sweden', code: 'SE' },
        { name: 'Poland', code: 'PL' },
        { name: 'Indonesia', code: 'ID' },
        { name: 'South Africa', code: 'ZA' },
        { name: 'Thailand', code: 'TH' },
        { name: 'Egypt', code: 'EG' },
        { name: 'Colombia', code: 'CO' },
        { name: 'Kenya', code: 'KE' }
      ]
      );
    const [category, setCategory] = useState('movie'); // Default category
    const [items, setItems] = useState([]); // Movies or TV shows
    const [selectedGenre, setSelectedGenre] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [years, setYears] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMinimized, setIsMinimized] = useState(false);// Default to minimized
    const [draftSelectedGenre, setDraftSelectedGenre] = useState([]);
    const [draftSelectedCountry, setDraftSelectedCountry] = useState("");
    const [draftSelectedYear, setDraftSelectedYear] = useState("");
    
    useEffect(() => {
        const fetchData = async (url) => {
            try {
                const response = await axios.get(url, { params: { api_key: apiConfig.apiKey } });
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        const fetchGenres = async () => {
            const data = await fetchData(`https://api.themoviedb.org/3/genre/${category}/list?api_key=${apiConfig.apiKey}`);
            if (data) {
                setGenres(data.genres);
            }
        };

        fetchGenres();
    }, [ category ]);

    useEffect(() => {
        // Fetch movies or TV shows based on category
        const fetchItems = async () => {
            const filters = {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: currentPage,
                sort_by: 'popularity.desc',
                primary_release_year: category === 'movie' ? selectedYear : undefined,
                first_air_date_year: category === 'tv' ? selectedYear : undefined,
                with_genres: selectedGenre.length > 0 ? selectedGenre.join(',') : undefined,
                with_origin_country: selectedCountry
            };
            const params = new URLSearchParams(filters).toString();
            const url = `https://api.themoviedb.org/3/discover/${category}?${params}`;
    
            try {
                const response = await axios.get(url, { params: { api_key: apiConfig.apiKey } });
                setItems(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchItems();
    }, [category, selectedGenre, selectedCountry, selectedYear, currentPage]);
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Update final selected values
        setSelectedGenre(draftSelectedGenre);
        setSelectedCountry(draftSelectedCountry);
        setSelectedYear(draftSelectedYear);
        setCurrentPage(1); // Reset page number
        setIsMinimized(true); // Minimize filters after submit
        // Fetch items with finalized filters
        setItems();
    };

    const handleClearFilters = () => {
        setDraftSelectedGenre([]);
        setDraftSelectedCountry("");
        setDraftSelectedYear("");
        setItems([]); // Optionally clear items if needed
        setCurrentPage(1);
    };
    

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);

        window.scrollTo({
            top: 10,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const yearOptions = [];
        for (let year = new Date().getFullYear(); year >= 2000; year--) {
            yearOptions.push(year.toString());
        }
        setYears(yearOptions);
    }, []);
    const toggleCategory = (newCategory) => {
        setCategory(newCategory);
        setCurrentPage(1); // Reset page number when category changes
    };
    const toggleFilters = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <>
        <div className="filters">
        <div className="toggle-filters">
                <Button className="small" onClick={toggleFilters}>
                    {isMinimized ? "Show Filters" : "Hide Filters"}
                </Button>
            </div>
            {!isMinimized && (
                <> 
            <div className="category-toggle">
                <div className="genrezz">
                    <input
                        type="radio"
                        id="movie"
                        name="category"
                        value="movie"
                        checked={category === 'movie'}
                        onChange={() => toggleCategory('movie')}
                    />
                    <label htmlFor="movie">Movies</label>
                    <input
                        type="radio"
                        id="tv"
                        name="category"
                        value="tv"
                        checked={category === 'tv'}
                        onChange={() => toggleCategory('tv')}
                    />
                    <label htmlFor="tv">TV Shows</label>
                </div>
            </div>
           
            <form onSubmit={handleFormSubmit}>
                <h3>Genres:</h3>
            <div className="gen">
                {genres.map((genre) => (
                    <label className={`checkbox-label ${draftSelectedGenre.includes(genre.id) ? 'checked' : ''}`} key={genre.id}>
                        <div className="genrezz">
                        <input
                                        type="checkbox"
                                        value={genre.id}
                                        checked={draftSelectedGenre.includes(genre.id)}
                                        onChange={(e) => {
                                            const genreId = parseInt(e.target.value);
                                            if (e.target.checked) {
                                                setDraftSelectedGenre([...draftSelectedGenre, genreId]);
                                            } else {
                                                setDraftSelectedGenre(draftSelectedGenre.filter(id => id !== genreId));
                                            }
                                        }}
                                    />
                                    
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">{genre.name}</span>
                    
                        </div>
                        </label>
                ))}
            </div>

                <br />
                   <h3>Country:</h3>
                    <div className="gen">
                        {countries && countries.map((country) => (
                            <label
                            className={`radio-label ${selectedCountry === country.code ? 'checked' : ''}`}
                            onClick={() => setSelectedCountry(country.code)}
                            key={country.code}
                              >
                            <div className="genrezz" key={country.code}>
                            <input
                                        type="radio"
                                        value={country.code}
                                        checked={draftSelectedCountry === country.code}
                                        onChange={() => setDraftSelectedCountry(country.code)}
                                    />
                                <span className="radio-custom"></span>
                                <span className="radio-text">{country.name}</span>
                                
                            </div>
                            </label>
                        ))}
                    </div>
                
                <br />
                <div className="gensz">
                    
                        <h3>Select Year:</h3>
                        <div className="gen">
                            {years.map((year) => (
                                <label className={`radio-label ${selectedYear ? 'checked' : ''}`}
                                onClick={() => setSelectedYear(year)}
                                key={year}
                            >
                                <div key={year} className="genrezz">
                                <input
                                        type="radio"
                                        value={year}
                                        checked={draftSelectedYear === year}
                                        onChange={() => setDraftSelectedYear(year)}
                                    />
                                    <span className="radio-custom"></span>
                                    <span className="radio-text">{year}</span>
                                </div>
                            </label>
                            ))}
                        </div>
                    
                </div>
                <br />
                <div className="cbut">
                <Button type="submit">Submit</Button>
                <OutlineButton type="button" onClick={handleClearFilters}>Clear Filters</OutlineButton>
                </div>
                 </form>
                 </>
            )}
            <div className="movie-gridk">
            {items && items.length === 0 ? (
                    <p>Nothing to see here</p>
                ) : (
                    items && items.filter(item => item.poster_path).map((item) => (
                        <MovieCard
                          key={item.id}
                          poster_path={item.poster_path}
                          item={item}
                          category={category}
                        />
                      ))
                )}
            </div>
           <div className="lod">
                {items && items.length > 0 && (
                    <Button className="btn" onClick={handleLoadMore}>Next Page</Button>
                )}
           </div>
        </div>
        <ToastContainer theme="dark" position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#ff0000' , color : 'white', borderRadius : '10px'}}/>
        </>
    );
    
};


export default Filters;

import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";
import "./filters.scss";
import Button, { OutlineButton } from "../button/Button";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router";

const Filters = () => {
  document.title = "Filters • ZILLA-XR";

  // List of countries remains unchanged.
  const [countries] = useState([
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "Mexico", code: "MX" },
    { name: "United Kingdom", code: "GB" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "Japan", code: "JP" },
    { name: "India", code: "IN" },
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "Italy", code: "IT" },
    { name: "Russia", code: "RU" },
    { name: "South Korea", code: "KR" },
    { name: "Spain", code: "ES" },
    { name: "Argentina", code: "AR" },
    { name: "Netherlands", code: "NL" },
    { name: "Nigeria", code: "NG" },
    { name: "Sweden", code: "SE" },
    { name: "Poland", code: "PL" },
    { name: "Indonesia", code: "ID" },
    { name: "South Africa", code: "ZA" },
    { name: "Thailand", code: "TH" },
    { name: "Egypt", code: "EG" },
    { name: "Colombia", code: "CO" },
    { name: "Kenya", code: "KE" }
  ]);

  // Final states used for fetching items.
  const [category, setCategory] = useState("movie"); // default category
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Draft states for the form inputs.
  const [draftSelectedGenre, setDraftSelectedGenre] = useState([]);
  const [draftSelectedCountry, setDraftSelectedCountry] = useState("");
  const [draftSelectedYear, setDraftSelectedYear] = useState("");

  // Other states.
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  // Flag to indicate URL parameters (if any) have been processed.
  const [paramsLoaded, setParamsLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Process URL query parameters once.
  useEffect(() => {
    if (location.search && location.search.trim() !== "") {
      const params = new URLSearchParams(location.search);
      const categoryParam = params.get("category");
      const genreParam = params.get("genre");
      const countryParam = params.get("country");
      const yearParam = params.get("year");
      const pageParam = params.get("page");

      if (categoryParam) {
        setCategory(categoryParam);
      }
      if (genreParam) {
        const arr = genreParam.split(",").map(Number);
        setSelectedGenre(arr);
        setDraftSelectedGenre(arr);
      }
      if (countryParam) {
        setSelectedCountry(countryParam);
        setDraftSelectedCountry(countryParam);
      }
      if (yearParam) {
        setSelectedYear(yearParam);
        setDraftSelectedYear(yearParam);
      }
      if (pageParam) {
        setCurrentPage(Number(pageParam));
      }
      // Hide the filter panel if parameters exist.
      setIsMinimized(true);
    }
    setParamsLoaded(true);
  }, [location.search]);

  // Fetch available genres whenever the category changes.
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/${category}/list`,
          { params: { api_key: apiConfig.apiKey } }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error(error);
      }
    };
    window.scrollTo({ top: 10, behavior: "smooth" });
    fetchGenres();
  }, [category]);

  // Fetch movies or TV shows using only the final filter states.
  useEffect(() => {
    if (!paramsLoaded) return;

    const fetchItems = async () => {
      // Build the filters object.
      const filters = {
        include_adult: false,
        include_video: false,
        language: "en-US",
        page: currentPage,
        sort_by: "popularity.desc"
      };

      // Add year only if set.
      if (category === "movie" && selectedYear) {
        filters.primary_release_year = selectedYear;
      } else if (category === "tv" && selectedYear) {
        filters.first_air_date_year = selectedYear;
      }

      // Add genres if available.
      if (selectedGenre && selectedGenre.length > 0) {
        filters.with_genres = selectedGenre.join(",");
      }

      // Add country only if set.
      if (selectedCountry) {
        filters.with_origin_country = selectedCountry;
      }

      // Remove any keys with undefined or empty-string values.
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined || filters[key] === "") {
          delete filters[key];
        }
      });

      // Build the query string and replace encoded commas with literal commas.
      const paramsStr = new URLSearchParams(filters)
        .toString()
        .replace(/%2C/g, ",");

      const url = `https://api.themoviedb.org/3/discover/${category}?${paramsStr}`;
      try {
        const response = await axios.get(url, {
          params: { api_key: apiConfig.apiKey }
        });
        setItems(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [paramsLoaded, category, selectedGenre, selectedCountry, selectedYear, currentPage]);

  // Build the URL from the current draft filters (including the category) and navigate.
  const updateURL = (page) => {
    const queryParams = new URLSearchParams();
    if (draftSelectedGenre.length > 0)
      queryParams.set("genre", draftSelectedGenre.join(","));
    if (draftSelectedCountry)
      queryParams.set("country", draftSelectedCountry);
    if (draftSelectedYear)
      queryParams.set("year", draftSelectedYear);
    if (category) queryParams.set("category", category);
    queryParams.set("page", page);
    // Replace encoded commas with literal commas.
    const queryStr = queryParams.toString().replace(/%2C/g, ",");
    navigate(`/filter?${queryStr}`);
  };

  // When the form is submitted, update the final filter states.
  // We require that at least one genre is selected.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!draftSelectedGenre || draftSelectedGenre.length === 0) {
      console.log("Please select at least one genre.");
      return;
    }
    setSelectedGenre(draftSelectedGenre);
    setSelectedCountry(draftSelectedCountry);
    setSelectedYear(draftSelectedYear);
    setCurrentPage(1);
    setIsMinimized(true);
    updateURL(1);
  };

  const handleClearFilters = () => {
    setDraftSelectedGenre([]);
    setDraftSelectedCountry("");
    setDraftSelectedYear("");
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    updateURL(newPage);
    window.scrollTo({ top: 10, behavior: "smooth" });
  };

  // Generate year options (from the current year back to 2000).
  useEffect(() => {
    const yearOptions = [];
    for (let y = new Date().getFullYear(); y >= 2000; y--) {
      yearOptions.push(y.toString());
    }
    setYears(yearOptions);
  }, []);

  // When the user toggles between Movies and TV Shows.
  const toggleCategory = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setDraftSelectedGenre([]);
    setDraftSelectedCountry("");
    setDraftSelectedYear("");
    setItems([]);
  };

  const toggleFilters = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <div className="filters">
        <div className="toggle-filters">
          <Button className="btn" onClick={toggleFilters}>
            {isMinimized ? "Show Filters" : "Hide Filters"}
          </Button>
        </div>
        {!isMinimized && (
          <>
            <div className="bigmovie">
              <div
                className={`lefter ${category === "movie" ? "select" : ""}`}
                onClick={() => toggleCategory("movie")}
              >
                <h3>MOVIES</h3>
                <i className="bx bx-movie"></i>
              </div>
              <div
                className={`righter ${category === "tv" ? "select" : ""}`}
                onClick={() => toggleCategory("tv")}
              >
                <h3>TV SHOWS</h3>
                <i className="bx bx-tv"></i>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <h3 className="formtitle">GENRES</h3>
              <div className="gen">
                {genres.map((genre) => (
                  <label
                    className={`checkbox-label ${
                      draftSelectedGenre.includes(genre.id) ? "checked" : ""
                    }`}
                    key={genre.id}
                  >
                    <div className="genrezzx">
                      <input
                        type="checkbox"
                        value={genre.id}
                        checked={draftSelectedGenre.includes(genre.id)}
                        onChange={(e) => {
                          const genreId = parseInt(e.target.value, 10);
                          if (e.target.checked) {
                            setDraftSelectedGenre([
                              ...draftSelectedGenre,
                              genreId
                            ]);
                          } else {
                            setDraftSelectedGenre(
                              draftSelectedGenre.filter((id) => id !== genreId)
                            );
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
              <h3 className="formtitle">COUNTRIES</h3>
              <div className="gen">
                {countries.map((country) => (
                  <label
                    className={`radio-label ${
                      draftSelectedCountry === country.code ? "checked" : ""
                    }`}
                    key={country.code}
                  >
                    <div className="genrezz">
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
                <h3 className="formtitle">YEAR</h3>
                <div className="gen">
                  {years.map((year) => (
                    <label
                      className={`radio-label ${
                        draftSelectedYear === year ? "checked" : ""
                      }`}
                      key={year}
                    >
                      <div className="genrezz">
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
                <Button type="submit">Search</Button>
                <OutlineButton type="button" onClick={handleClearFilters}>
                  Clear Filters
                </OutlineButton>
              </div>
            </form>
          </>
        )}
        {items && items.length > 0 &&
          (category === "movie" ? (
            <div className="righters">
              <h3>MOVIES</h3>
              <i className="bx bx-movie"></i>
            </div>
          ) : (
            <div className="righters">
              <h3>TV SHOWS</h3>
              <i className="bx bx-tv"></i>
            </div>
          ))}
        <div className="movie-gridk">
          {items && items.length === 0 ? (
            <p className="formtitle">Try selecting some filters</p>
          ) : (
            items
              .filter((item) => item.poster_path)
              .map((item) => (
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
            <Button className="btn" onClick={handleLoadMore}>
              Next
            </Button>
          )}
        </div>
      </div>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        backdrop={true}
        progressStyle={{
          backgroundColor: "#ff0000",
          color: "white",
          borderRadius: "10px"
        }}
      />
    </>
  );
};

export default Filters;

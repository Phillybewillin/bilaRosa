import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";
import "./filters.scss";
import Button, { OutlineButton } from "../button/Button";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router";
import Select from "react-select";

const Filters = () => {
  document.title = "Filters • ZILLA-XR";

  // List of countries for react-select
  const [countryOptions] = useState([
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "GB", label: "United Kingdom" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "JP", label: "Japan" },
    { value: "IN", label: "India" },
    { value: "AU", label: "Australia" },
    { value: "BR", label: "Brazil" },
    { value: "IT", label: "Italy" },
    { value: "RU", label: "Russia" },
    { value: "KR", label: "South Korea" },
    { value: "ES", label: "Spain" },
    { value: "AR", label: "Argentina" },
    { value: "NL", label: "Netherlands" },
    { value: "NG", label: "Nigeria" },
    { value: "SE", label: "Sweden" },
    { value: "PL", label: "Poland" },
    { value: "ID", label: "Indonesia" },
    { value: "ZA", label: "South Africa" },
    { value: "TH", label: "Thailand" },
    { value: "EG", label: "Egypt" },
    { value: "CO", label: "Colombia" },
    { value: "KE", label: "Kenya" },
  ]);

  // Final states used for fetching items.
  const [category, setCategory] = useState("movie"); // default category
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null); // Changed to null for react-select
  const [selectedYear, setSelectedYear] = useState(null); // Changed to null for react-select
  const [sortBy, setSortBy] = useState("popularity.desc"); // Added sort by

  // Draft states for the form inputs.
  const [draftSelectedGenre, setDraftSelectedGenre] = useState([]);
  const [draftSelectedCountry, setDraftSelectedCountry] = useState(null); // Changed to null for react-select
  const [draftSelectedYear, setDraftSelectedYear] = useState(null); // Changed to null for react-select
  const [draftSortBy, setDraftSortBy] = useState("popularity.desc"); // Added draft sort by

  // Other states.
  const [genres, setGenres] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]); // Changed to options for react-select
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  // Flag to indicate URL parameters (if any) have been processed.
  const [paramsLoaded, setParamsLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Sort by options for react-select
  const sortByOptions = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    { value: "release_date.desc", label: "Release Date Descending" },
    { value: "release_date.asc", label: "Release Date Ascending" },
    { value: "revenue.desc", label: "Revenue Descending" },
    { value: "revenue.asc", label: "Revenue Ascending" },
    { value: "primary_release_date.desc", label: "Primary Release Date Descending" }, // Movie specific
    { value: "primary_release_date.asc", label: "Primary Release Date Ascending" },   // Movie specific
    { value: "first_air_date.desc", label: "First Air Date Descending" },       // TV specific
    { value: "first_air_date.asc", label: "First Air Date Ascending" },        // TV specific
  ];

  // Process URL query parameters once.
  useEffect(() => {
    if (location.search && location.search.trim() !== "") {
      const params = new URLSearchParams(location.search);
      const categoryParam = params.get("category");
      const genreParam = params.get("genre");
      const countryParam = params.get("country");
      const yearParam = params.get("year");
      const pageParam = params.get("page");
      const sortByParam = params.get("sort_by");

      if (categoryParam) {
        setCategory(categoryParam);
      }
      if (genreParam) {
        const arr = genreParam.split(",").map(Number);
        setSelectedGenre(arr);
        setDraftSelectedGenre(arr);
      }
      if (countryParam) {
        setSelectedCountry(countryOptions.find(option => option.value === countryParam) || null);
        setDraftSelectedCountry(countryOptions.find(option => option.value === countryParam) || null);
      }
      if (yearParam) {
        setSelectedYear(yearsOptions.find(option => option.value === yearParam) || null);
        setDraftSelectedYear(yearsOptions.find(option => option.value === yearParam) || null);
      }
      if (pageParam) {
        setCurrentPage(Number(pageParam));
      }
      if (sortByParam) {
        setSortBy(sortByParam);
        setDraftSortBy(sortByParam);
      }
      // Hide the filter panel if parameters exist.
      setIsMinimized(true);
    }
    setParamsLoaded(true);
  }, [location.search, countryOptions, yearsOptions]);

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
        sort_by: sortBy, // Use the final sortBy state
      };

      // Add year only if set.
      if (category === "movie" && selectedYear?.value) {
        filters.primary_release_year = selectedYear.value;
      } else if (category === "tv" && selectedYear?.value) {
        filters.first_air_date_year = selectedYear.value;
      }

      // Add genres if available.
      if (selectedGenre && selectedGenre.length > 0) {
        filters.with_genres = selectedGenre.join(",");
      }

      // Add country only if set.
      if (selectedCountry?.value) {
        filters.with_origin_country = selectedCountry.value;
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
  }, [paramsLoaded, category, selectedGenre, selectedCountry, selectedYear, currentPage, sortBy]);

  // Build the URL from the current draft filters (including the category) and navigate.
  const updateURL = (page) => {
    const queryParams = new URLSearchParams();
    if (draftSelectedGenre.length > 0)
      queryParams.set("genre", draftSelectedGenre.join(","));
    if (draftSelectedCountry?.value)
      queryParams.set("country", draftSelectedCountry.value);
    if (draftSelectedYear?.value)
      queryParams.set("year", draftSelectedYear.value);
    if (draftSortBy)
      queryParams.set("sort_by", draftSortBy);
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
    setSortBy(draftSortBy);
    setCurrentPage(1);
    setIsMinimized(true);
    updateURL(1);
  };

  const handleClearFilters = () => {
    setDraftSelectedGenre([]);
    setDraftSelectedCountry(null);
    setDraftSelectedYear(null);
    setDraftSortBy("popularity.desc");
    setCurrentPage(1);
    updateURL(1); // Update URL to reflect cleared filters
  };

  const handleLoadMore = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    updateURL(newPage);
    window.scrollTo({ top: 10, behavior: "smooth" });
  };

  // Generate year options for react-select (from the current year back to 2000).
  useEffect(() => {
    const yearOptions = [];
    for (let y = new Date().getFullYear(); y >= 2000; y--) {
      yearOptions.push({ value: y.toString(), label: y.toString() });
    }
    setYearsOptions(yearOptions);
  }, []);

  // When the user toggles between Movies and TV Shows.
  const toggleCategory = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setDraftSelectedGenre([]);
    setDraftSelectedCountry(null);
    setDraftSelectedYear(null);
    setItems([]);
  };

  const toggleFilters = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <div className="filters">
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
        <div className="toggle-filters">
          <Button className="btn" onClick={toggleFilters}>
            {isMinimized ? "Show Filters" : "Hide Filters"}
          </Button>
        </div>
        <div className="backback">
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
              <h3 className="formtitle">FILTER</h3>
                <div className="lent">
                <div className="gen">
                <h3 className="formtitle">COUNTRIES</h3>
           
                <Select
                  value={draftSelectedCountry}
                  onChange={(selectedOption) => setDraftSelectedCountry(selectedOption)}
                  options={countryOptions}
                  placeholder="Select Country"
                  isClearable
                  theme={(theme) => ({
                    ...theme,
                  
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: "#ffffff2a",
                      primary: "#ffffff1a",
                      neutral0: "#00000e2",
                      neutral5: "grey",
                      neutral10: "#38383879",
                      neutral20: "#ffffff5a",
                      neutral30: "red",
                      neutral40: "red",
                      neutral50: "#a9a9a9",
                      neutral60: "red",
                      neutral70: "#696969",
                      neutral80: "#ffffff5a",
                      neutral90: "#303030",
                    },
                  })}
                />
              </div>

              <br />
              <div className="gensz">
               
                <div className="gen">
                <h3 className="formtitle">YEAR</h3>
                  <Select
                    value={draftSelectedYear}
                    onChange={(selectedOption) => setDraftSelectedYear(selectedOption)}
                    options={yearsOptions}
                    placeholder="Select Year"
                    isClearable
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 10,
                      colors: {
                        ...theme.colors,
                        primary25: "#ffffff2a",
                        primary: "#ffffff1a",
                        neutral0: "#00000e2",
                        neutral5: "grey",
                        neutral10: "#38383879",
                        neutral20: "#ffffff5a",
                        neutral30: "red",
                        neutral40: "red",
                        neutral50: "#a9a9a9",
                        neutral60: "red",
                        neutral70: "#696969",
                        neutral80: "#ffffff5a",
                        neutral90: "#303030",
                      },
                    })}
                  />
                </div>
              </div>
              <br />

              <div className="gensz">
               
                <div className="gen">
                <h3 className="formtitle">SORT BY</h3>
                  <Select
                    value={{ value: draftSortBy, label: sortByOptions.find(option => option.value === draftSortBy)?.label || "Popularity Descending" }}
                    onChange={(selectedOption) => setDraftSortBy(selectedOption?.value || "popularity.desc")}
                    options={sortByOptions}
                    placeholder="Sort By"
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 10,
                      colors: {
                        ...theme.colors,
                        primary25: "#ffffff2a",
                        primary: "#ffffff1a",
                        neutral0: "#00000e2",
                        neutral5: "grey",
                        neutral10: "#38383879",
                        neutral20: "#ffffff5a",
                        neutral30: "red",
                        neutral40: "red",
                        neutral50: "#a9a9a9",
                        neutral60: "red",
                        neutral70: "#696969",
                        neutral80: "#ffffff5a",
                        neutral90: "#303030",
                      },
                    })}
                  />
                </div>
              </div>
                </div>
              <br />

              {/* --- ADDED: Other Potential Filters --- */}
              {/* You can add more react-select components or other UI elements for these filters */}
              {/* <h3 className="formtitle">Minimum Rating</h3> */}
              {/* <input type="number" value={draftMinRating} onChange={(e) => setDraftMinRating(e.target.value)} placeholder="e.g., 7" /> */}

              {/* <h3 className="formtitle">Keywords</h3> */}
              {/* <input type="text" value={draftKeywords} onChange={(e) => setDraftKeywords(e.target.value)} placeholder="e.g., action, adventure" /> */}
              <h3 className="formtitle">SEARCH</h3>
              <div className="cbut">
                <Button type="submit">Search</Button>
                <OutlineButton type="button" onClick={handleClearFilters}>
                  Clear Filters
                </OutlineButton>
              </div>
            </form>
          </>
        )}
        </div>
        
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";
import "./filters.scss";
import Button, { OutlineButton } from "../button/Button";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TrueFocus from "../reactbits/TrueFocus";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Filters = () => {
  document.title = "Filters • MoviePluto";

  // List of countries for react-select
  const [countryOptions] = useState([
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "RU", label: "Russia" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "IN", label: "India" },
    { value: "CN", label: "China" },
    { value: "MX", label: "Mexico" },
    { value: "BR", label: "Brazil" },
    { value: "AR", label: "Argentina" },
    { value: "AU", label: "Australia" },
    { value: "NL", label: "Netherlands" },
    { value: "SE", label: "Sweden" },
    { value: "PL", label: "Poland" },
    { value: "ID", label: "Indonesia" },
    { value: "TH", label: "Thailand" },
    { value: "PH", label: "Philippines" },
    { value: "TR", label: "Turkey" },
    { value: "EG", label: "Egypt" },
    { value: "NG", label: "Nigeria" },
    { value: "ZA", label: "South Africa" },
    { value: "CO", label: "Colombia" },
    { value: "KE", label: "Kenya" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "NO", label: "Norway" },
    { value: "BE", label: "Belgium" },
    { value: "CH", label: "Switzerland" },
    { value: "HK", label: "Hong Kong" },
    { value: "SG", label: "Singapore" },
    { value: "MY", label: "Malaysia" },
    { value: "NZ", label: "New Zealand" },
    { value: "IL", label: "Israel" },
    { value: "IE", label: "Ireland" },
    { value: "AT", label: "Austria" },
    { value: "GR", label: "Greece" },
    { value: "PT", label: "Portugal" },
    { value: "CZ", label: "Czech Republic" },
    { value: "HU", label: "Hungary" },
    { value: "UA", label: "Ukraine" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "AE", label: "United Arab Emirates" },
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
  const [isLoading, setIsLoading] = useState(false); // Added loading state

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
    ...(category === "movie"
      ? [
          {
            value: "primary_release_date.desc",
            label: "Primary Release Date Descending",
          }, // Movie specific
          {
            value: "primary_release_date.asc",
            label: "Primary Release Date Ascending",
          }, // Movie specific
        ]
      : []),
    ...(category === "tv"
      ? [
          { value: "first_air_date.desc", label: "First Air Date Descending" }, // TV specific
          { value: "first_air_date.asc", label: "First Air Date Ascending" }, // TV specific
        ]
      : []),
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
        setSelectedCountry(
          countryOptions.find((option) => option.value === countryParam) || null
        );
        setDraftSelectedCountry(
          countryOptions.find((option) => option.value === countryParam) || null
        );
      }
      if (yearParam) {
        setSelectedYear(
          yearsOptions.find((option) => option.value === yearParam) || null
        );
        setDraftSelectedYear(
          yearsOptions.find((option) => option.value === yearParam) || null
        );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchGenres();
  }, [category]);

  // Fetch movies or TV shows using only the final filter states.
  useEffect(() => {
    if (!paramsLoaded) return;

    const fetchItems = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
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
          params: { api_key: apiConfig.apiKey },
        });
        setItems(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading to false when fetching completes
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
    if (draftSortBy) queryParams.set("sort_by", draftSortBy);
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
  const fbg =
    items.length > 0
      ? apiConfig.w200Image(items[0].backdrop_path || items[0].poster_path)
      : null; // Corrected 'poster_path' to 'items[0].poster_path'

  // Framer Motion variants for the filter panel
  const filterPanelVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5 } },
  };

  // Framer Motion variants for the movie grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="filters">
        <div
          className="filtblur"
          style={{ backgroundImage: `url(${fbg})` }}
        ></div>
        {items && items.length > 0 &&
          (category === "movie" ? (
            <div className="righters">
              <TrueFocus
                sentence="Filter Movies"
                manualMode={true}
                blurAmount={4}
                borderColor="pink"
                animationDuration={0.7}
                pauseBetweenAnimations={1}
              />
            </div>
          ) : (
            <div className="righters">
              <TrueFocus
                sentence="Filter Shows"
                manualMode={true}
                blurAmount={4}
                borderColor="pink"
                animationDuration={0.7}
                pauseBetweenAnimations={1}
              />
            </div>
          ))}
        <div className="toggle-filters">
          <Button className="btn" onClick={toggleFilters}>
            {isMinimized ? "Show Filters" : "Hide Filters"}
          </Button>
        </div>

        {/* Framer Motion for the filter panel */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              className="backback"
              variants={filterPanelVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
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
                <div className="lent">
                  <div className="gen">
                    <h3 className="formtitle">COUNTRIES</h3>

                    <Select
                      value={draftSelectedCountry}
                      onChange={(selectedOption) =>
                        setDraftSelectedCountry(selectedOption)
                      }
                      options={countryOptions}
                      placeholder="Select Country"
                      isClearable
                      classNamePrefix="custom-select"
                      styles={{
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menuList: (base) => ({
                          ...base,
                          maxHeight: "250px",
                          overflowY: "auto",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 10,
                        colors: {
                          ...theme.colors,
                          primary25: "#ffffff2a",
                          primary: "#ffffff1a",
                          neutral0: "#00000e4",
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
                      <CreatableSelect
                        classNamePrefix="custom-select"
                        styles={{
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          menuList: (base) => ({
                            ...base,
                            maxHeight: "250px",
                            overflowY: "auto",
                          }),
                        }}
                        value={draftSelectedYear}
                        onChange={(selectedOption) =>
                          setDraftSelectedYear(selectedOption)
                        }
                        options={yearsOptions}
                        placeholder="Type or Select Year"
                        isClearable
                        isValidNewOption={(inputValue) =>
                          /^\d{4}$/.test(inputValue)
                        }
                        onCreateOption={(inputValue) => {
                          if (/^\d{4}$/.test(inputValue)) {
                            const newOption = {
                              value: inputValue,
                              label: inputValue,
                            };
                            setYearsOptions((prev) => [newOption, ...prev]);
                            setDraftSelectedYear(newOption);
                          }
                        }}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 10,
                          colors: {
                            ...theme.colors,
                            primary25: "#ffffff2a",
                            primary: "#ffffff1a",
                            neutral0: "#00000e4",
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
                        classNamePrefix="custom-select"
                        styles={{
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          menuList: (base) => ({
                            ...base,
                            maxHeight: "250px",
                            overflowY: "auto",
                            zIndex: 9999,
                          }),
                        }}
                        value={{
                          value: draftSortBy,
                          label:
                            sortByOptions.find(
                              (option) => option.value === draftSortBy
                            )?.label || "Popularity Descending",
                        }}
                        onChange={(selectedOption) =>
                          setDraftSortBy(
                            selectedOption?.value || "popularity.desc"
                          )
                        }
                        options={sortByOptions}
                        placeholder="Sort By"
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 10,
                          colors: {
                            ...theme.colors,
                            primary25: "#ffffff2a",
                            primary: "#ffffff1a",
                            neutral0: "#00000e4",
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
                                genreId,
                              ]);
                            } else {
                              setDraftSelectedGenre(
                                draftSelectedGenre.filter(
                                  (id) => id !== genreId
                                )
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

    
                <h3 className="formtitle">Filter</h3>
                <div className="cbut">
                  <Button type="submit">Search</Button>
                  <OutlineButton type="button" onClick={handleClearFilters}>
                    Clear Filters
                  </OutlineButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Framer Motion for loading and movie grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-indicator"
          >
            <div className="spinner"></div> {/* Basic spinner */}
            <p>Loading items...</p>
          </motion.div>
        ) : (
          <motion.div
            className="movie-gridk"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {items && items.length === 0 ? (
              <p className="formtitle">Try selecting some filters</p>
            ) : (
              items
                .filter((item) => item.poster_path)
                .map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <MovieCard
                      poster_path={item.poster_path}
                      item={item}
                      category={category}
                    />
                  </motion.div>
                ))
            )}
          </motion.div>
        )}

        <div className="lod">
          {items && items.length > 0 && (
            <Button className="btn" onClick={handleLoadMore}>
              Next
            </Button>
          )}
        </div>
      </div>
      <ToastContainer
        toastClassName="blurred-toast"
        bodyClassName="toast-body"
        theme="dark"
        position="botton-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </>
  );
};

export default Filters;

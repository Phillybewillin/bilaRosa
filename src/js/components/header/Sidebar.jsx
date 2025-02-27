import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import Button, { OutlineButton } from '../button/Button';
import './sidebar.scss';
import Mlist from './Mlist';
import Input from '../input/Input';
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import apiConfig from '../../api/apiConfig';

const Sidebar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const SidebarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [ai, setAi] = useState([]);
  const [movies, setMovies] = useState([]);
  const [izloading, setIzLoading] = useState(true);
  const [hidesearch, setHidesearch] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [noResults, setNoResults] = useState(false);

  // Parse the "query" parameter from the URL on mount.
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchValue(queryParam);
    }
  }, [location.search]);

  // Debounce the search input to avoid rapid URL updates.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Whenever the debounced search value changes, update the URL and trigger search.
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
      searchParams.set("query", debouncedSearchValue);
    } else {
      searchParams.delete("query");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    
    if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
      getMoviesResult(debouncedSearchValue);
    }
    setNoResults(false);
    setShowModal(false);
  }, [debouncedSearchValue, user]);

  // Header navigation items with active/inactive icons.
  const headerNav = [
    {
      inactiveIcon: 'bx bx-home-alt-2',
      activeIcon: 'bx bxs-home-alt-2',
      text: 'Home',
      path: '/',
    },
    {
      inactiveIcon: 'bx bx-carousel',
      activeIcon: 'bx bxs-carousel',
      text: 'Filters',
      path: '/filter',
    },
    {
      inactiveIcon: 'bx bx-movie',
      activeIcon: 'bx bxs-movie',
      text: 'Movies',
      path: '/z/movie',
    },
    {
      inactiveIcon: 'bx bx-tv',
      activeIcon: 'bx bxs-tv',
      text: 'Shows',
      path: '/z/tv',
    },
  ];

  // Conditionally add "My Library" if there is a user.
  if(user) {
    headerNav.push({
      inactiveIcon: 'bx bx-library',
      activeIcon: 'bx bxs-library', // Change if you have an alternate active icon.
      text: 'My Library',
      path: '/account',
    });
  }



  // Search function: Fetch movies/TV based on the search value.
  const getMoviesResult = async (query) => {
    if (query && query.trim() !== "") {
      const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiConfig.apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.total_results === 0) {
          setMovies([]);
          setNoResults(true);
          setIzLoading(false);
        }
        if (data.results) {
          // Filter results with poster and vote_average.
          const filteredMovies = data.results.filter(movie => movie.poster_path && movie.vote_average);
          // Also get suggestions that have a title.
          const filteraisuggest = data.results.filter(movie => movie.poster_path && movie.vote_average && movie.title);
          setMovies(filteredMovies);
          setAi(filteraisuggest);
          setIzLoading(false);
        } else {
          setMovies([]);
          setIzLoading(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setIzLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Sidebar shrink/hide effect on scroll.
  useEffect(() => {
    const handleScroll = () => {
      if (SidebarRef.current) {
        const scrolledDown = window.scrollY > 50;
        const scrolledUp = window.scrollY < window.prevScrollY;
        SidebarRef.current.classList.toggle('shrinker', scrolledDown);
        if (scrolledUp) {
          SidebarRef.current.classList.remove('hideer');
        } else if (scrolledDown) {
          SidebarRef.current.classList.add('hideer');
        }
      }
      window.prevScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={SidebarRef} className="newheader">
        {/* Search modal */}
        {!hidesearch && (
          <div className="searchabsolute">
            <div className="searchmovieabsolute">
              <div className="searchios" onClick={() => setHidesearch(!hidesearch)}>
                <h2 className="searchabsolutetitle">
                  {searchValue ? ` Showing Results for '${searchValue}'` : 'Search'}
                </h2>
                <div className="searchabsolutetitleicon">
                  <i className='bx bx-search-alt'></i>
                </div>
              </div>
              <div className="searchbar-container">
                <Input
                  type="text"
                  placeholder="Search anything 🍿"
                  value={searchValue}
                  onChange={handleInputChange}
                />
                <button 
                  onClick={() => {navigate('/filter') ; setHidesearch(!hidesearch)}} 
                  className="filter-button"
                >
                  <i className="bx bx-filter" style={{fontWeight:'400', fontSize:'20px'}}></i>
                </button>
                {searchValue ? (
                <div className="clearsearch" onClick={() => setSearchValue('')}>
                  <i className='bx bx-x'></i>
                </div>
              ) : (
                <div className="clearsearch" onClick={() => setHidesearch(!hidesearch)}>
                 <i className='bx bx-x'></i>
                </div>
              )}
              </div>
              <div className="aisuddestiondiv">
                {searchValue !== '' ? (
                  <h4 className='suggy'>Suggestions :</h4>
                ) : (
                  <h4 className='suggy'>An Action Movie Maybe?</h4>
                )}
                {ai && ai.map((aisuggest, idx) => (
                  <div className="nameaisuggestion" key={idx} onClick={() => { setSearchValue(aisuggest.title); setAi([]); }}>
                    <p className="aititlesu">{aisuggest.title}</p>
                  </div>
                ))}
              </div>
             
              {!izloading && noResults && (
                <div className="mdsa" onClick={() => setHidesearch(!hidesearch)}>
                  <h3 className='noresult'> ¯\_(ツ)_/¯</h3>
                  <p className='noresult'>This item does not exist</p>
                </div>
              )}
              {!izloading && movies.length > 0 && (
                <div className="mdsa" onClick={() => setHidesearch(!hidesearch)}>
                  <Mlist movies={movies || []} value={searchValue} />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="headersidebar">
          <nav className="sidebar">
            {/* Search icon with dynamic active icon */}
            <div className="icserch">
              <span 
                className={`iconsidebox ${!hidesearch ? 'active' : ''}`} 
                onClick={() => setHidesearch(!hidesearch)}
              >
                <i 
                  className={!hidesearch ? 'bx bx-search-alt' : 'bx bx-search'} 
                  style={{fontWeight:'400', fontSize:'20px'}}
                ></i>
                <h5 className='iconvz'>Search</h5>
              </span>
            </div>
            {/* Render header navigation items */}
            {headerNav.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.path}
                className={({ isActive }) => `iconsideboxitem ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <span className="iconsidebox">
                    <i 
                      className={isActive ? navItem.activeIcon : navItem.inactiveIcon} 
                      style={{fontWeight:'400', fontSize:'20px'}}
                    ></i>
                    <h5 className="iconvz">{navItem.text}</h5>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          {/* Discord Icon below header nav */}
          <div className="discord-container">
            <a 
              href="https://discord.gg/MCt2R9gqGb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="iconsidebox"
            >
              <i className="bx bxl-discord-alt" style={{fontWeight:'400', fontSize:'20px'}}></i>
              <h5 className="iconvz">Discord</h5>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useRef, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const [noResults, setNoResults] = useState(false);

  // When the component mounts, parse the "query" parameter from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchValue(queryParam);
    }
  }, [location.search]);

  // Whenever searchValue changes, update the URL so that the query persists.
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchValue && searchValue.trim() !== "") {
      searchParams.set("query", searchValue);
    } else {
      searchParams.delete("query");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }, [navigate, searchValue]);

  const headerNav = [
    {
      display: (
        <span className="iconsidebox">
          <i className='bx bx-home-alt-2'></i>
          <h5 className="iconvz">Home</h5>
        </span>
      ),
      path: '/',
    },
    {
      display: (
        <span className="iconsidebox">
          <i className='bx bx-equalizer'></i>
          <h5 className="iconvz">Filters</h5>
        </span>
      ),
      path: '/filter',
    },
    {
      display: (
        <span className="iconsidebox">
          <i className="bx bx-movie"></i>
          <h5 className="iconvz">Movies</h5>
        </span>
      ),
      path: '/z/movie',
    },
    {
      display: (
        <span className="iconsidebox">
          <i className="bx bx-tv"></i>
          <h5 className="iconvz">Shows</h5>
        </span>
      ),
      path: '/z/tv',
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  // Trigger search when searchValue changes.
  useEffect(() => {
    if (searchValue && searchValue.trim() !== "") {
      getMoviesResult(searchValue);
    }
    setNoResults(false);
    setShowModal(false);
  }, [searchValue, user]);

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
              <h2 className="searchabsolutetitleicon">
                <i className='bx bx-search-alt'></i>
            </h2>
            </div>
              <Input
                type="text"
                placeholder="Search anything 🍿"
                value={searchValue}
                onChange={handleInputChange}
              />
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
              {searchValue ? (
                <div className="clearsearch" onClick={() => setSearchValue('')}>
                  <i className='bx bx-x'></i>
                </div>
              ) : (
                <div className="clearsearch" onClick={() => setHidesearch(!hidesearch)}>
                  Close Search
                </div>
              )}
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
            <div className="icserch">
              <span className="iconsidebox" onClick={() => setHidesearch(!hidesearch)}>
                <i className='bx bx-search-alt'></i>
                <h5 className='iconvz'>Search</h5>
              </span>
            </div>
            {headerNav.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.path}
                className={({ isActive }) => `iconsideboxitem ${isActive ? 'active' : ''}`}
              >
                {navItem.display}
              </NavLink>
            ))}
            {user && (
              <div className="icserch">
                <span className="iconsidebox" onClick={() => navigate('/account')}>
                  <i className='bx bx-library'></i>
                  <h5 className='iconvz'>My Library</h5>
                </span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

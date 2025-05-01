import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import Button, { OutlineButton } from '../button/Button';
import './sidebar.scss';
import Mlist from './Mlist';
import Input from '../input/Input';
import logo from '../../assets/LOGGO3.png';
import apiConfig from '../../api/apiConfig';

const Sidebar = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const SidebarRef = useRef(null);
  const prevScrollY = useRef(window.scrollY);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideSearch, setHideSearch] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    if (debouncedSearchValue.trim() !== '') {
      getMoviesResult(debouncedSearchValue);
    } else {
      setMovies([]);
      setNoResults(false);
    }
  }, [debouncedSearchValue]);

  const getMoviesResult = async (query) => {
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiConfig.apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const filtered = data.results.filter(movie => movie.poster_path && movie.vote_average);
      setMovies(filtered);
      setNoResults(filtered.length === 0);
      setIsLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => setSearchValue(e.target.value);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const down = current > 50;
      const up = current < prevScrollY.current;

      if (SidebarRef.current) {
        SidebarRef.current.classList.toggle('shrinker', down);
        if (up) SidebarRef.current.classList.remove('hideer');
        else if (down) SidebarRef.current.classList.add('hideer');
      }

      prevScrollY.current = current;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on ESC
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') setHideSearch(true);
    };
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, []);

  const headerNav = [
    { inactiveIcon: 'bx bx-home-smile', activeIcon: 'bx bxs-home-smile', text: 'Home', path: '/' },
    { inactiveIcon: 'bx bx-slider', activeIcon: 'bx bx-slider-alt', text: 'Filters', path: '/filter' },
    { inactiveIcon: 'bx bx-camera-movie', activeIcon: 'bx bxs-camera-movie', text: 'Movies', path: '/z/movie' },
    { inactiveIcon: 'bx bx-tv', activeIcon: 'bx bxs-tv', text: 'Shows', path: '/z/tv' },
  ];

  if (user) {
    headerNav.push({
      inactiveIcon: 'bx bx-folder',
      activeIcon: 'bx bxs-folder',
      text: 'My Library',
      path: '/account',
    });
  }

  return (
    <>
       {!hideSearch && (
          <div className="searchabso">
            <div className="backdrop" onClick={() => setHideSearch(true)} />
            <div className="searchmovieabsolute" onClick={(e) => e.stopPropagation()}>
              <div className="searchios">
                <h2 className="searchabsolutetitle">
                  {searchValue ? `Showing results for '${searchValue}'` : 'Search'}
                </h2>
              </div>
              <div className="searchbar-container">
                <Input
                  type="text"
                  placeholder="Try typing something..."
                  value={searchValue}
                  onChange={handleInputChange}
                />
                <div className="searchabsolutetitleicon" onClick={() => setSearchValue('')}>
                  <i className='bx bx-x' ></i>
                </div>
                <button
                  onClick={() => { navigate('/filter'); setHideSearch(true); }}
                  className="filter-button"
                >
                  <i className="bx bx-filter-alt" style={{ fontSize: '20px' }}></i>
                </button>
                <div
                  className="clearsearch"
                  onClick={() => setHideSearch(true)}
                >
                  <i className='bx bx-x'></i>
                </div>
              </div>
              

              {!isLoading && noResults && (
                <div className="mdsa">
                  <h3 className='noresult'>¯\_(ツ)_/¯</h3>
                  <p className='noresult'>This Movie or Show doesn't seem to exist</p>
                </div>
              )}
              {!isLoading && movies.length > 0 && (
                <div className="mdsa">
                  <Mlist movies={movies} value={searchValue} />
                </div>
              )}
            </div>
          </div>
        )}
      <div ref={SidebarRef} className="newheader">
        {/* Search Overlay */}
       

        {/* Sidebar */}
        <div className="headersidebar">
          <nav className="sidebar">
            {/* Search Button */}
            <div className="icserch">
              <span
                className={`iconsidebox ${!hideSearch ? 'search-active' : ''}`}
                onClick={() => setHideSearch(!hideSearch)}
              >
                <i className={!hideSearch ? 'bx bx-search-alt-2' : 'bx bx-search'} style={{ fontSize: '20px' }}></i>
                <h5 className='iconvz'>Search</h5>
              </span>
            </div>

            {/* Navigation Links */}
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
                      style={{ fontSize: '20px' }}
                    ></i>
                    <h5 className="iconvz">{navItem.text}</h5>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Discord */}
          <div className="discord-container">
            <a
              href="https://discord.gg/ynfvjgHrBd"
              target="_blank"
              rel="noopener noreferrer"
              className="iconsidebox"
            >
              <i className="bx bxl-discord-alt" style={{ fontSize: '20px' }}></i>
              <h5 className="iconvz">Join our Discord</h5>
            </a>
          </div>
          <div className="logoside">
            <img src={logo} alt="Moviepluto" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

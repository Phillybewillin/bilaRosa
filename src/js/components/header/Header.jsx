import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import Button, { OutlineButton } from '../button/Button';
import './header.scss';
import Mlist from './Mlist';
import Input from '../input/Input';
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import Signup from '../../pages/authpages/Signup';
import Login from '../../pages/authpages/Login';
import { Menu, MenuItem, MenuButton, MenuDivider } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import Avatar from 'react-avatar';
import apiConfig from '../../api/apiConfig';

const Header = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(true);
  const [movies, setMovies] = useState([]);
  const [izloading, setIzLoading] = useState(true);
  const [hidesearch, setHidesearch] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showrandom, setShowRandom] = useState(false);
 
  // Persist search query from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchValue(queryParam);
    }
  }, [location.search]);

  // Debounce the searchValue to prevent flickering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Update the URL query parameter when debouncedSearchValue changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
      searchParams.set("query", debouncedSearchValue);
    } else {
      searchParams.delete("query");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }, [debouncedSearchValue, navigate, location.pathname, location.search]);

  // Trigger search when debouncedSearchValue changes
  useEffect(() => {
    if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
      getMoviesResult(debouncedSearchValue);
    }
    setNoResults(false);
    setShowModal(false);
  }, [debouncedSearchValue, user]);

  // Updated headerNav with active and inactive icons
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

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logOut, navigate]);

  // Search function
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
        } else if (data.results) {
          const filteredMovies = data.results.filter(movie => movie.poster_path);
          setMovies(filteredMovies);
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

  // Header shrink/hide effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrolledDown = window.scrollY > 50;
        const scrolledUp = window.scrollY < window.prevScrollY;
        headerRef.current.classList.toggle('shrink', scrolledDown);
        if (scrolledUp) {
          headerRef.current.classList.remove('hide');
        } else if (scrolledDown) {
          headerRef.current.classList.add('hide');
        }
      }
      window.prevScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={headerRef} className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="ZillaXR" />
        </div>
        {!hidesearch && (
          <div className="mlrowa">
            <div className="searchmovie">
              <Input
                type="text"
                placeholder="What if, you searched for a movie ?"
                value={searchValue}
                onChange={handleInputChange}
              />
              {searchValue && movies.length === 0 && noResults && (
                <div className="mds">
                  <h3 className='noresult'> ¯\_(ツ)_/¯ Not found</h3>
                </div>
              )}
              {!izloading && movies.length > 0 && (
                <div className="mds">
                  <Mlist movies={movies || []} value={searchValue} />
                </div>
              )}
              {searchValue ? (
                <div className="clearsearchan" onClick={() => setSearchValue('')}>
                  <i style={{ fontSize: '20px' }} className='bx bx-x'></i>
                </div>
              ) : (
                <div className="clearsearchan" onClick={() => setHidesearch(!hidesearch)}>
                  <i style={{ fontSize: '20px' }} className='bx bx-x'></i>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="header__wrap container">
          <div className="sideber"></div>
          <nav className="header__nav">
            {headerNav.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <span className="iconbox">
                    <i className={isActive ? navItem.activeIcon : navItem.inactiveIcon}></i>
                    <h5 className="iconv">{navItem.text}</h5>
                  </span>
                )}
              </NavLink>
            ))}
            <div className="icserch">
              <span className="iconbox" onClick={() => setHidesearch(!hidesearch)}>
                <i 
                  className={!hidesearch ? 'bx bx-search-alt' : 'bx bx-search'} 
                 
                ></i>
                <h5 className='iconv'>Search</h5>
              </span>
            </div>
            <div className="menuzz">
              <Menu 
                menuButton={
                  <MenuButton>
                    <Avatar
                      name={user?.email || ''}
                      size="43"
                      round='5px'
                      src={user?.photoURL}
                      color="#000000a9"
                    />
                  </MenuButton>
                }
                transition
              >
                {user?.email ? (
                  <>
                    <MenuItem onClick={() => navigate('/account')}>
                      <div className="loggz"><i className='bx bxs-collection'></i> My Library</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem onClick={handleLogout}>
                      <div className="loggz"><i className='bx bx-log-out'></i> LogOut</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem>
                      <div className="socialzz">
                        <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}>
                          <i className='bx bxl-telegram'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}>
                          <i className='bx bxl-discord-alt'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}>
                          <i className='bx bxl-reddit'></i>
                        </div>
                      </div>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(false); }}>
                      <div className="loggz"><i className='bx bxs-user-plus'></i> LogIn</div>
                    </MenuItem>
                    <MenuItem style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(true); }}>
                      <div className="loggz"><i className='bx bx-user-plus'></i> Sign-Up</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'pink', borderRadius: '5px' }}/>
                    <MenuItem onClick={() => navigate('/dmca')}>
                      <div className="loggz"><i className='bx bxs-bot'></i> DMCA</div>
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/privacypolicy')}>
                      <div className="loggz"><i className='bx bxs-shield-plus'></i> Privacy Policy</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem>
                      <div className="socialzz">
                        <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}>
                          <i className='bx bxl-telegram'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}>
                          <i className='bx bxl-discord-alt'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}>
                          <i className='bx bxl-reddit'></i>
                        </div>
                      </div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'pink', borderRadius: '5px' }}/>
                  </>
                )}
              </Menu>
            </div>
          </nav>
          <div className="drccbtn" onClick={() => setShowRandom(!showrandom)}>
            RANDOM <i className='bx bx-shuffle'></i>
          </div>
          {showrandom && (
            <div className="dracco" onClick={() => setShowRandom(!showrandom)}>
              <h2 className="draccotext">Do you want to watch a random Movie or TV Show?</h2>
              <div className="draccocont">
                <button className="randombtn" onClick={() => fetchRandomId("movie")} disabled={loading}>
                  {loading ? "a Random Movie " : " a Random Movie"} 
                  <p className='randompic'><i className='bx bx-movie'></i></p>
                </button>
                <button className='randombtn' onClick={() => fetchRandomId("tv")} disabled={loading}>
                  {loading ? "a Random Show" : " a Random Show"}
                  <p className='randompic'><i className='bx bx-tv'></i></p>
                </button>
              </div>
            </div>
          )}
          <div className="hosz">
            <div className="menuzz">
              <Menu 
                menuButton={
                  <MenuButton>
                    <Avatar
                      name={user?.email || ''}
                      size="43"
                      round='5px'
                      src={user?.photoURL}
                      color="#000000a9"
                    />
                  </MenuButton>
                }
                transition
              >
                {user?.email ? (
                  <>
                    <MenuItem onClick={() => navigate('/account')}>
                      <div className="loggz"><i className='bx bxs-collection'></i> My Library</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem onClick={handleLogout}>
                      <div className="loggz"><i className='bx bx-log-out'></i> LogOut</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem>
                      <div className="socialzz">
                        <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}>
                          <i className='bx bxl-telegram'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}>
                          <i className='bx bxl-discord-alt'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}>
                          <i className='bx bxl-reddit'></i>
                        </div>
                      </div>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(false); }}>
                      <div className="loggz"><i className='bx bxs-user-plus'></i> LogIn</div>
                    </MenuItem>
                    <MenuItem style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(true); }}>
                      <div className="loggz"><i className='bx bx-user-plus'></i> Sign-Up</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'pink', borderRadius: '5px' }}/>
                    <MenuItem onClick={() => navigate('/dmca')}>
                      <div className="loggz"><i className='bx bxs-bot'></i> DMCA</div>
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/privacypolicy')}>
                      <div className="loggz"><i className='bx bxs-shield-plus'></i> Privacy Policy</div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'grey', borderRadius: '5px' }}/>
                    <MenuItem>
                      <div className="socialzz">
                        <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}>
                          <i className='bx bxl-telegram'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}>
                          <i className='bx bxl-discord-alt'></i>
                        </div>
                        <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}>
                          <i className='bx bxl-reddit'></i>
                        </div>
                      </div>
                    </MenuItem>
                    <MenuDivider style={{ backgroundColor: 'pink', borderRadius: '5px' }}/>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modala">
          <div className="modal_content">
            {showSignup ? <Signup /> : <Login />}
            <Button className="btn" onClick={() => setShowSignup(prev => !prev)}>
              {showSignup ? 'Switch to Login' : 'Switch to Signup'}
            </Button>
            <Button className="btn" onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

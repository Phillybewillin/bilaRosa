import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import Button, { OutlineButton } from '../button/Button';
import './header.scss';
import Mlist from './Mlist';
import Input from '../input/Input';
import logo from '../../assets/LOGGO3.png';
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
  const [randomItem, setRandomItem] = useState(null);
  const [randomType, setRandomType] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);

 
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

    useEffect(() => {
    if (searchValue && searchValue.trim() !== "") {
      getMoviesResult(searchValue);
    }
    setNoResults(false);
    setShowModal(false);
  }, [searchValue, user]);
 

  const intervalRef = useRef(null); // Store interval globally
  
  const fetchRandomId = async (type) => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  
    setLoading(true);
    setShowCountdown(false);
    setRandomItem(null);
    
    try {
      const totalPages = 500;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const response = await fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${apiConfig.apiKey}&page=${randomPage}`);
      const data = await response.json();
  
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const item = data.results[randomIndex];
  
        setRandomItem(item);
        setRandomType(type);
        setCountdown(10);
        setShowCountdown(true);
  
        let counter = 10;
        intervalRef.current = setInterval(() => {
          counter--;
          setCountdown(counter);
          if (counter === 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            handlePlayer(item.id, item.title || item.name, type);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching random ID:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handlePlayer = (id, name, type) => {
    if (!id || !name) return;
    const detailslug = encodeURIComponent(name.trim().replace(/ /g, "-").toLowerCase());
    const path = `/watch/${detailslug}/${id}${type === 'tv' ? '/1/1' : ''}`;
    navigate(path);
  };

  const goToDetails = (id,category, title, poster_path) => {
    let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
    if (!Array.isArray(continueWatching)) {
        continueWatching = [];
    }
    const foundItem = continueWatching.find(item => item.id === id);
    if (!foundItem) {
        continueWatching = [...continueWatching, {id,category, title, poster_path }];
        localStorage.setItem('ContinueWatching' , JSON.stringify(continueWatching));
        //console.log(continueWatching);
    }
    navigate(`/${category}/${id}`);
}
  // Header shrink/hide effect on scroll
  

  const prevScrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (headerRef.current) {
        const scrolledDown = currentScrollY > 50;
        const scrolledUp = currentScrollY < prevScrollY.current;
  
        headerRef.current.classList.toggle('shrink', scrolledDown);
  
        if (scrolledUp) {
          headerRef.current.classList.remove('hide');
        } else if (scrolledDown) {
          headerRef.current.classList.add('hide');
          setShowRandom(false);
        }
  
        prevScrollY.current = currentScrollY;
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <>
      <div ref={headerRef} className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="MOVIEPLUTO" />
        </div>
        {!hidesearch && (
          <div className="mlrowa">
            <div className="searchmovie">
              <Input
                type="text"
                placeholder="What if, you searched for a nothing ?"
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
                        <div className="lozg" onClick={() => window.open('https://discord.gg/ynfvjgHrBd')}>
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
                        <div className="lozg" onClick={() => window.open('https://discord.gg/ynfvjgHrBd')}>
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
          <div className="drccbtn" onClick={() => {setShowRandom(!showrandom)}}>
            
            GAMBLE <i className='bx bx-shuffle'></i>
          </div>
          {showrandom && (
  <div className="dracco" onClick={() => setShowRandom(false)}>
    <div className="dracco-inner" onClick={(e) => e.stopPropagation()}>
      {showCountdown && randomItem && (
        <div className="random-confirmation">
          <h4>START'S IN {countdown}S</h4>
          <img
            src={apiConfig.w500Image(randomItem.backdrop_path || randomItem.poster_path)}
            alt={randomItem.title || randomItem.name}
          />

          <div className="random-actions">
            <div className="tiova">
              <h3>{randomItem.title || randomItem.name}</h3>
              <p>{randomItem.overview}</p>
              <p>{randomType.toUpperCase()} : {randomItem.release_date || randomItem.first_air_date}</p>
            </div>

            <div className="buttondual">
              <button
                className="aga"
                onClick={() =>
                  handlePlayer(randomItem.id, randomItem.title || randomItem.name, randomType)
                }
              >
                <i className="bx bx-play"></i>
              </button>
              <button
                className="aga"
                onClick={() =>
                  goToDetails(randomItem.id, randomType, randomItem.title, randomItem.poster_path)
                }
              >
                <i className="bx bx-info-square"></i>
              </button>
              <button
  className="aga"
  onClick={() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const types = ["movie", "tv"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    fetchRandomId(randomType);
    //setShowRandom(false);
    setCountdown(null); // Optional: clear the countdown display
  }}
>
  <i className="bx bx-x"></i>
</button>

            </div>
          </div>
        </div>
      )}

      <img
        className="draccopic"
        onClick={() => fetchRandomId("movie")}
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm5uZW0yMjRsdjNib2dueGswNmF1bG1hZjQxMW0xdTd5dnJjYWY3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QOXIRdZnubGlrdfsQB/giphy.gif"
        alt="Random Movie"
      />
      <img
        className="draccopicb"
        onClick={() => fetchRandomId("tv")}
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG03MDd1aDVvdWx4cXc5bGVhcHFrY3h5bHBqcjB6cjhsZjZ1Y2NkMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYw2nPaMz5PnNzG/giphy.gif"
        alt="Random TV"
      />

      <div className="draccocont">
      <h2 className="draccotext">Gamble on something to watch?</h2>
     
        <button
          className="randombtn"
          onClick={(e) => {
            e.stopPropagation();
            fetchRandomId("movie");
          }}
          disabled={loading}
        >
          {loading ? "A Movie" : "Movie"}
          <p className="randompic"><i className="bx bx-movie"></i></p>
        </button>

        <button
          className="randombtn"
          onClick={(e) => {
            e.stopPropagation();
            fetchRandomId("tv");
          }}
          disabled={loading}
        >
          {loading ? "A Show" : "Show"}
          <p className="randompic"><i className="bx bx-tv"></i></p>
        </button>

        <button
          className="randombtn"
          onClick={(e) => {
            e.stopPropagation();
            const types = ["movie", "tv"];
            const randomType = types[Math.floor(Math.random() * types.length)];
            fetchRandomId(randomType);
          }}
          disabled={loading}
        >
          Luck <i className="bx bx-dice-6"></i>
        </button>
        <button
  className="aga2"
  onClick={() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setShowRandom(false);
    setCountdown(null); // Optional: clear the countdown display
  }}
>
  <i className="bx bx-x"></i>
</button>
      </div>
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
                        <div className="lozg" onClick={() => window.open('https://discord.gg/ynfvjgHrBd')}>
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
                        <div className="lozg" onClick={() => window.open('https://discord.gg/ynfvjgHrBd')}>
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

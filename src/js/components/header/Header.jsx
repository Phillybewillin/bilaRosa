import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
import {DNA} from 'react-loader-spinner'
const Header = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(true);
  const [movies, setMovies] = useState([]);
  const [izloading , setIzLoading] = useState(true);
  const [hidesearch , setHidesearch] =  useState(true);
  const [searchValue, setSearchValue] = useState('');
  
  const headerNav = [
    {
      display: (
        <span className="iconbox">
          <i className='bx bx-home-alt-2'></i>
          <h5 className="iconv">Home</h5>
        </span>
      ),
      path: '/',
    },
    {
      display: (
        <span className="iconbox">
          <i className='bx bx-equalizer'></i>
          <h5 className="iconv">Filters</h5>
        </span>
      ),
      path: '/filter',
    },
    {
      display: (
        <span className="iconbox">
          <i className="bx bx-movie"></i>
          <h5 className="iconv">Movies</h5>
        </span>
      ),
      path: '/z/movie',
    },
    {
      display: (
        <span className="iconbox">
          <i className="bx bx-tv"></i>
          <h5 className="iconv">Shows</h5>
        </span>
      ),
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



  const getMoviesResult = async (searchValue) => {
      if (searchValue) {
          const url = `https://api.themoviedb.org/3/search/multi?query=${searchValue}&api_key=${apiConfig.apiKey}`;
          const response = await fetch(url);

          const data = await response.json();
          //console.log(data);

          if(data.results){
              const filteredMovies = data.results.filter(movie => movie.poster_path && movie.overview);
              setMovies(filteredMovies);
              setIzLoading(false);
          } else {
              setMovies(-1);
              setIzLoading(false);
          }
      }
  };
  useEffect(() => {
      //handleInputChange({ target: { value: searchValue } });
      if(searchValue !== null || searchValue !== ''){
        getMoviesResult(searchValue);
      }
      
      setShowModal(false)
  }, [searchValue ,user]);
  
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setMovies([]); // Reset movies when user types in the search input
  };
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrolledDown = window.scrollY > 50;
        const scrolledUp = window.scrollY < window.prevScrollY;
        headerRef.current.classList.toggle('shrink', scrolledDown);
        if (scrolledUp ) {
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
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZILLAXR</h4>
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

    {
     searchValue && movies === -1 &&  (
        <div className="mds">
          <h3 className='noresult'> ¯\_(ツ)_/¯ Not found</h3>
        </div>
      )
    }
    {
      !izloading && movies.length > 0 && (
        <div className="mds">
          <Mlist movies={movies || []} value={searchValue} />
        </div>
      )
    }

      
    </div>
  </div>
)}

        <div className="header__wrap container">
          <nav className="header__nav">
            {headerNav.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {navItem.display}
              </NavLink>
            ))}
            <div className="icserch">
            <span className="iconbox" onClick={() => setHidesearch(!hidesearch)}>
           <i className='bx bx-search-alt'></i>
           <h5 className='iconv'>Search</h5>
            </span>
            </div>
           
            <div className="menuzz">
            <Menu 
              menuButton={
                <MenuButton >
                  <Avatar
                    name={user?.email || ''}
                    size="43"
                    round
                    color="#000000d9"
                  />
                  
                </MenuButton>
              }
              transition
            >
              {user?.email ? (
                <>
                  <MenuItem onClick={() => navigate('/account')}> <div className="loggz"> <i class='bx bxs-collection'></i> My Library </div> </MenuItem>
                  <MenuDivider  style={{ backgroundColor: 'grey' , borderRadius : '5px'}}/>
                  <MenuItem onClick={handleLogout}> <div className="loggz"> <i className='bx bx-log-out'></i> LogOut </div></MenuItem>
                  <MenuItem > <div className="loggz"> --------     -------</div></MenuItem>
                 
                  <MenuItem>
                  <div className="socialzz">
                  <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}><i className='bx bxl-telegram'> </i></div>
                  <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}><i className='bx bxl-discord-alt'> </i></div>
                  <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}><i className='bx bxl-reddit'> </i></div>

                  </div>
                    
                  </MenuItem>

                </>
              ) : (
                <>
                  <MenuItem  style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(false); }}> <div className="loggz"> <i className='bx bxs-user-plus'></i> LogIn 
                    </div></MenuItem>
                  <MenuItem  style={{ justifyContent: 'flex-start' }} onClick={() => { setShowModal(true); setShowSignup(true); }}> <div className="loggz">  <i className='bx bx-user-plus'></i> Sign-Up</div></MenuItem>
                  <MenuDivider  style={{ backgroundColor: 'pink' , borderRadius : '5px'}}/>
                  <MenuItem  onClick={() => navigate('/dmca')}> <div className="loggz"> <i className='bx bxs-bot'></i> DMCA </div></MenuItem>
                  <MenuItem  onClick={() => navigate('/privacypolicy')}> <div className="loggz"><i className='bx bxs-shield-plus'></i>  Privacy Policy </div></MenuItem>
                  <MenuDivider  style={{ backgroundColor: 'grey' , borderRadius : '5px'}}/>
                 
                  <MenuItem>
                  <div className="socialzz">
                  <div className="lozg" onClick={() => window.open('https://t.me/+MQUUqEx2WXA0ZmZk')}><i className='bx bxl-telegram'> </i></div>
                  <div className="lozg" onClick={() => window.open('https://discord.gg/MCt2R9gqGb')}><i className='bx bxl-discord-alt'> </i></div>
                  <div className="lozg" onClick={() => window.open('https://reddit.com/r/zillaXRxyz')}><i className='bx bxl-reddit'> </i></div>

                  </div>
                    
                  </MenuItem>
                  <MenuDivider  style={{ backgroundColor: 'pink' , borderRadius : '5px'}}/>
                 

                   
                </>
              )}
            </Menu>
          </div>
          </nav>
          
        </div>
      </div>
      {showModal && (
        <div className="modala">
          <div className="modal_content">
            {showSignup ? <Signup /> : <Login />}
            <Button className="btn" onClick={() => setShowSignup((prev) => !prev)}>
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

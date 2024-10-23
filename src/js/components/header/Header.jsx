import React from 'react';

import { useRef , useEffect ,useCallback } from 'react';

import { Link , NavLink} from 'react-router-dom';
import apiConfig from '../../api/apiConfig';
import { useNavigate } from 'react-router-dom';

import Button ,{ OutlineButton } from '../button/Button';
import './header.scss';
import {UserAuth} from '../../context/AuthContext'
import Mlist from './Mlist';
import Input from '../input/Input';
//import logo from '/icons8-cool-64.png';
import logo from '../../assets/icons8-alien-monster-emoji-48.png';
import Signup from '../../pages/authpages/Signup';
import Login from '../../pages/authpages/Login';


// eslint-disable-next-line react/display-name
const Header = React.memo(() => {

    //const { user , logOut } = React.useContext(UserAuth) || {};
    const [showModal, setShowModal] = React.useState(false);
    const [showSignup, setShowSignup] = React.useState(true);
    const [hidesearch , sethide] =  React.useState(false);
    const headerNav = [
      {
          display:<span className="iconbox"><i className='bx bx-home-alt'></i> <h5 className='iconv'>Home</h5></span>,
          path: '/'
      }
      ,
      {
          display: <span className="iconbox"><i className='bx bxs-invader'></i><h5 className='iconv'>Filters</h5></span>,
          path: '/filter'
      },
      {
          display: <span className="iconbox"><i className="bx bx-movie"></i> <h5 className='iconv'>Movies</h5></span>,
          path: '/z/movie'
      },
      {
          display: <span className="iconbox"><i className="bx bx-tv"></i> <h5 className='iconv'>Shows</h5></span>,
          path: '/z/tv'
      },
  
      {
          display: <span className="iconbox"><i className='bx bxs-hide'></i><h5 className='iconv'>Hide</h5></span>,
          onClick: () => sethide(!hidesearch), // add this line
   
      }
  ]


   const handleShowModal = () => {
    setShowModal(true);
    setShowSignup(false);
    //localStorage.setItem('updateModalShown', 'true');
 };
    const { user, logOut } = UserAuth();
    const  navigate= useNavigate(); // Move useNavigate here

    const handlelogout = useCallback(async () => {
        try {
            await logOut();
            navigate('/'); // Now you can use navigate here
        } catch (error) {
            console.log(error);
        }
    }, [logOut, navigate]);
    //const { pathname } = useLocation();
    const headerRef = useRef(null);

    //const active = headerNav.findIndex(e => e.path === pathname);

    
     
    const [movies , setMovies] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');


    const getMoviesResult = async (searchValue) => {
        if (searchValue) {
            const url = `https://api.themoviedb.org/3/search/multi?query=${searchValue}&api_key=${apiConfig.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if(data.results){
                const filteredMovies = data.results.filter(movie => movie.poster_path && movie.overview);
                setMovies(filteredMovies);
            } else {
                setMovies([]);
            }
        }
    };
    useEffect(() => {
        //handleInputChange({ target: { value: searchValue } });
        getMoviesResult(searchValue);
        setShowModal(false)
    }, [searchValue ,user]);
    
    const handleInputChange = (e) => {
      setSearchValue(e.target.value);
      setMovies([]); // Reset movies when user types in the search input
    };

    useEffect(() => {
      const shrinkHeader = () => {
          if (headerRef.current && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
              headerRef.current.classList.add('shrink');
          } else if (headerRef.current) {
              headerRef.current.classList.remove('shrink');
          }
      }
      window.addEventListener('scroll', shrinkHeader);
      return () => {
          window.removeEventListener('scroll', shrinkHeader);
      };
  }, []);
    return (
        <>
        <div ref={headerRef} className="header">
        <div className="logo" onClick={() => navigate('/')}>
               <img src={logo} alt="ZillaXR"/>
               <h4 className="logotext">ZillaXR</h4>
       </div>
       {!hidesearch && (
  <div className="mlrowa">
    <div className="searchmovie">
      <Input
        type="text"
        placeholder="Scary Movie 3 " 
        value={searchValue}
        onChange={handleInputChange}
      />
      <div className="mds">
        <Mlist movies={movies || []} value={searchValue} />
      </div>
    </div>
  </div>
)}
       

   
       <div className="header__wrap container">
           <nav className="header__nav">
           {headerNav.map((navItem) => (
  <NavLink
    key={navItem.path}
    to={navItem.path}
    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    onClick={navItem.onClick ? navItem.onClick : null}
  >
    {navItem.display}
  </NavLink>
))}
          </nav>
        
         
                     
    {user?.email? (
              
                <div className="bur">
                    
                <div className="login" style={{display: 'flex',justifyContent:'space-between'}}>
                <Link to ="/account">
                <OutlineButton className="blue"><i className="bx bx-user"></i></OutlineButton>
                </Link> 
                <OutlineButton onClick={handlelogout} className="blue">LogOut</OutlineButton>
                </div> 
                </div>
            ) : (
               <div className="bur" >
               
                <Button onClick={handleShowModal} className="pink"><i className="bx bx-user"></i></Button>
               
          </div>
           )}      
           
       </div> 
       
           </div>
                <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
               <div className="modal_content">
      {showSignup ? (
        <Signup />
      ) : (
        <Login />
      )
      }
      <div className="ggd">
      <Button className="btn" onClick={() => setShowSignup(true)}>
        signup
    </Button>
      <Button className="btn" onClick={() => setShowModal(false)}>
        close
    </Button>
      </div>
    
  
</div>
          </div>


        </>
        
    );
}, );

export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import './movie-grid.scss';
import './genre.scss';
import  Button, { OutlineButton } from '../button/Button';
import tmdbApi, { category} from '../../api/tmdbApi';
import { ToastContainer } from 'react-toastify';
import apiConfig from '../../api/apiConfig';
import axios from 'axios';


const MovieCard = React.lazy(() => import("../movie-card/MovieCard"));

const MovieGrid = props => {

    const [items, setItems] = useState([]);

    document.title = `${props.category === category.movie ? 'Movies • ZillaXR' : 'TV Series • ZillaXR'} `;

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const { keyword } = useParams();

    useEffect(() => {
        const getList = async () => {
            let response = null;
            if (keyword === undefined) {
                const params = {};
                switch(props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(movieType.popular, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(tvType.airing_today, {params});
                }
            } else {
                const params = {
                    query: keyword
                }
                response = await tmdbApi.search({params});
            }
            const uniqueItems = Array.from(new Set(items.map(item => item.id))).map(id => items.find(item => item.id === id));
           
            if (response.results) {
                setItems(response.results);
                setTotalPage(response.total_pages);
            }else{
                setItems(uniqueItems);
                 setTotalPage(response.total_pages);
            }
          //setItems(uniqueItems);
            //setItems(response.results);
           
        }
        getList();
    }, [props.category, keyword,  setItems, setTotalPage]);


    
    const genres = [
        {
          "id": 28,
          "name": "Action"
        },
        {
          "id": 12,
          "name": "Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 14,
          "name": "Fantasy"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 27,
          "name": "Horror"
        },
        {
          "id": 10402,
          "name": "Music"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10749,
          "name": "Romance"
        },
        {
          "id": 878,
          "name": "Science Fiction"
        },
        {
          "id": 10770,
          "name": "TV Movie"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 10752,
          "name": "War"
        },
        {
          "id": 37,
          "name": "Western"
        }
      ]
      const tvgenres = [
        {"id": 10759, "name": "Action & Adventure"},
        {"id": 16, "name": "Animation"},
        {"id": 35, "name": "Comedy"},
        {"id": 80, "name": "Crime"},
        {"id": 99, "name": "Documentary"},
        {"id": 18, "name": "Drama"},
        {"id": 10751, "name": "Family"},
        {"id": 9648, "name": "Mystery"},
        {"id": 10762, "name": "Kids"},
        {"id": 10763, "name": "News"},
        {"id": 10764, "name": "Reality"},
        {"id": 10765, "name": "Sci-Fi & Fantasy"},
        {"id": 10766, "name": "Soap"},
        {"id": 10767, "name": "Talk"},
        {"id": 10768, "name": "War & Politics"},
        {"id": 37, "name": "Western"}
      ]
      const movieType = {
        upcoming: 'TRENDING',
        popular: 'POPULAR',
        top_rated: 'TOP RATED'
    }
    const tvType = {
      popular: 'POPULAR',
      top_rated: 'TOP RATED',
      on_the_air: ' TRENDING',
      airing_today: 'AIRING TODAY'
  }
      const [tags, setTags] = useState([]);
      const [selectedGenre, setSelectedGenre] = useState([]);
    
      const [selectedType, setSelectedType] = useState([]);
      
     
    useEffect(() => {
      const BASE_URL = 'https://api.themoviedb.org/3';
      const API_URL2 = `${BASE_URL}/${props.category}/${selectedType}?api_key=${apiConfig.apiKey}`;
    
      const fetchzData = async () => {
        try {
          const response = await axios.get(API_URL2);
          setItems(response.data.results);
          setPage(1);
          setTotalPage(response.data.total_pages);
          //console.log(response.data.results);
        } catch (error) {
          //console.error(error);
        }
      };
    
        //setTre(tvType);
      
      fetchzData();
    }, [ props.category, selectedType]);
      
      const handleGenreClick = async (genreId) => {
        setSelectedGenre((prevSelectedGenre) => {
          const index = prevSelectedGenre.findIndex((id) => id === genreId);
      
          if (index !== -1) {
            return prevSelectedGenre.filter((id) => id !== genreId);
          } else {
            return [...prevSelectedGenre, genreId];
          }
        });
      };
      useEffect(() => {
        setSelectedGenre([]);
    }, [props.category]);
      
      useEffect(() => {
        const BASE_URL = 'https://api.themoviedb.org/3';
        const API_URL = `${BASE_URL}/discover/${props.category}?sort_by=popularity.desc&api_key=${apiConfig.apiKey}&with_genres=${selectedGenre.map(encodeURIComponent).join(',')}`;
      
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL);
            setItems(response.data.results);
            setPage(1);
            setTotalPage(response.data.total_pages);
            //console.log(response.data.results);
          } catch (error) {
            //console.error(error);
          }
        };
        if(props.category === 'tv') {
          setTags(tvgenres);
        } else {
          setTags(genres);
        }
        fetchData();
      }, [selectedGenre ,props.category]);
      
      const loadMore = async () => {
        if (page >= totalPage) return;
      
         const limit = 750;
        let API_URL = '';
      
        if (selectedGenre && selectedGenre.length > 0) {
          API_URL = `https://api.themoviedb.org/3/discover/${props.category}?sort_by=popularity.desc&api_key=${apiConfig.apiKey}&with_genres=${selectedGenre.map(encodeURIComponent).join('&')}&page=${page + 1}`;
        } else if (selectedType && selectedType.length > 0) {
          API_URL = `https://api.themoviedb.org/3/${props.category}/${selectedType}?api_key=${apiConfig.apiKey}&page=${page + 1}`;
        } else {
          API_URL = `https://api.themoviedb.org/3/${props.category}/popular?api_key=${apiConfig.apiKey}&page=${page + 1}`;
        }
      
        try {
          const response = await axios.get(API_URL);
          setItems(prevItems => [...prevItems, ...response.data.results]);
          setPage(prevPage => prevPage + 1);
        } catch (error) {
          console.error(error);
        }
      };
      
   
   // Define a debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Modify your useEffect hook to use debounce
useEffect(() => {
  const loadMoreOnScroll = debounce(() => {
    const limit = 750;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 0 && scrollTop + clientHeight >= scrollHeight * 0.75) {
      if (items.length < limit) {
        loadMore();
      }
    }
  }, 200); // Adjust delay as needed

  window.addEventListener('scroll', loadMoreOnScroll);

  return () => {
    window.removeEventListener('scroll', loadMoreOnScroll);
  };
}, [items.length, loadMore]);


    useEffect(() => {
      const genreElements = document.getElementsByClassName('tag');
    
      Array.from(genreElements).forEach((genreElement) => {
        genreElement.addEventListener('click', () => {
          // Scroll back to the top of the page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      });
    
      return () => {
        Array.from(genreElements).forEach((genreElement) => {
          genreElement.removeEventListener('click', () => {});
        });
      };
    }, []);
 
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    const navigate = useNavigate();
    const handleFilter = () => {
      navigate(`/filter`);
    }
    
    return (
        <>
            <div className="section mb-3">
               
                <div className="section_header">
                  <div className="section_search">
                  {props.category === category.movie && (
        <div className='label'>
          <label><h3 className="mb2x">BROWSE MOVIES:</h3></label>
          <div className='select-container'>
          {Object.entries(movieType).map(([value, label]) => (
              <div
                key={value}
                className={`select-option ${selectedType === value ? 'selected' : ''}`}
                onClick={() => setSelectedType(value)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
      {props.category === category.tv && (
        <div className='label'>
          <label><h3 className="mb2x">BROWSE TV SHOWS:</h3></label>
          <div className='select-container'>
            {Object.entries(tvType).map(([value, label]) => (
              <div
                key={value}
                className={`select-option ${selectedType === value ? 'selected' : ''}`}
                onClick={() => setSelectedType(value)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )} 
        <Button className="btn" onClick={handleFilter}>Filters</Button>
               
                </div>
               </div>
                
                <div className="tags">
  {tags.map((genre) => (
    <div  className={`tagOutline ${selectedGenre.includes(genre.id) ? 'selected' : ''}`} key={genre.id}
    >
    <div
      key={genre.id}
      className={`tag ${selectedGenre.includes(genre.id) ? 'selected' : ''}`}
      id={genre.id}
      onClick={() => {
        handleGenreClick(genre.id);
      }}
    >
      {genre.name}
    </div>
    </div>
   
  ))}
</div>
     
      
                  <div className="movie-grid" loading="lazy">
                  <React.Suspense fallback={<div id="spinner"></div>}>
                  {
                    items.map((item, i) => <MovieCard category={props.category} item={item} key={i}/>)
                  }
                  </React.Suspense>
                
               </div>
               
            {
              
                page < totalPage ? (
                    <div className="movie-grid__loadmore">
                        <OutlineButton className="small" onClick={loadMore}>+</OutlineButton>
                    </div>
                ) : null
            }
            <div className="scrolltotop" onClick={scrollToTop} style={{position: 'fixed', bottom: '50px', right: '20px', cursor: 'pointer',fontSize: '20px',backgroundColor: 'black', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',color: '#00ffbb'}}><i className="bx bx-chevron-up"></i></div>
            </div>
            <ToastContainer theme="dark" position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} backdrop={true} progressStyle={{ backgroundColor: '#ff0000' , color : 'white', borderRadius : '10px'}}/>
        </>
    );
}


export default MovieGrid;

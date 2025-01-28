import  {Suspense} from 'react';
import { Routes, Route,matchPath,useLocation} from 'react-router-dom';
import './App.scss';
import Header from './js/components/header/Header';
import Footer from './js/components/footer/Footer';
import './js/assets/boxicons-2.1.4/css/boxicons.min.css';
import Home from './js/pages/Home'; 
import Catalog from './js/pages/Catalog';
import Detail from './js/pages/detail/Detail';
import lazyWithPreload from 'react-lazy-with-preload';
import { AuthContextProvider } from './js/context/AuthContext';
import ContactPage from './js/pages/authpages/Contact';
import Search from './js/pages/Search';
import Player from './js/pages/player/Player';
import Sidebar from './js/components/header/Sidebar';
import {motion} from 'motion/react'
//const Player = lazyWithPreload(() => import('./js/pages/player/Player'));
const Filters = lazyWithPreload(() => import('./js/components/movie-grid/Filters'));
//const Login = lazyWithPreload(() => import('./js/pages/authpages/Login'));
const Account = lazyWithPreload(() => import('./js/pages/authpages/Account'));
const ProtectedRoutes = lazyWithPreload(() => import('./js/pages/ProtectedRoutes'));
const Socials = lazyWithPreload(() => import('./js/pages/authpages/Socials'));
const Info = lazyWithPreload(() => import('./js/pages/Infoz'));

const DMCATakedownRequest = lazyWithPreload(() => import('./js/pages/authpages/Dmca'));

//Player.preload();
Filters.preload();
Account.preload();
Socials.preload();
const App = () => {
    const location = useLocation();
  
    const hideHeaderPaths = [
      "/watch/:title/:id",
      "/watch/:title/:id/:season_number/:episode_number",
      "/movie/:id", // assuming you only want to hide header for movie details
      "/tv/:id",
    ];
  
    // Check if the current location matches any of the hideHeaderPaths
    const hideHeader = hideHeaderPaths.some(path =>
      matchPath({ path, end: true }, location.pathname)
    );

  return (
    <>
      <AuthContextProvider>
      {!hideHeader && <Header />}
      {!hideHeader && <Sidebar />}
        <Routes>
          <Route path="/" element={
             <motion.div 
             initial={{opacity: 0}}
             animate={{opacity: 1}}
             exit={{opacity: 0}}
             transition={{duration : 1.4}}
             >
              <Home />
              </motion.div>
            } />
          <Route path="/z/:category" element={<Catalog />} />
          <Route path="/filter" element={  
            <Suspense fallback={null}>
              <Filters />
            </Suspense>} />
           
            <Route path="/:category/:id" element={ 
              
                <Detail />
              
              } />
        
           
            
          <Route path="/search/:keyword" element={<Search />} />
          <Route path="/watch/:title/:id" element= {<Player />} />
         <Route path="/watch/:title/:id/:season_number/:episode_number" element={ <Suspense fallback={null}><Player /> </Suspense>} />
         <Route path='/contact' element={ <Suspense fallback={null}><ContactPage/> </Suspense>} />
           <Route path='/dmca' element={ <Suspense fallback={null}><DMCATakedownRequest/> </Suspense>} />
          <Route path="/privacypolicy" element={ <Suspense fallback={null}><Socials /> </Suspense>} />
          <Route path="/account" element={ <Suspense fallback={null}>
            <ProtectedRoutes><Account /></ProtectedRoutes>
          </Suspense>} />
        
          <Route path="/aboutzilla" element={ <Suspense fallback={null}><Info /></Suspense>} />
         
      
        <Route path="*" element={<h1> You got lost somehow , Damn  a 404  </h1>} />
        </Routes>
        {!hideHeader && <Footer />}
     </AuthContextProvider>
    </>
  );
};

export default App;


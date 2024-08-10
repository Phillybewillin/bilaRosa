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
const Player = lazyWithPreload(() => import('./js/pages/player/Player'));
const Filters = lazyWithPreload(() => import('./js/components/movie-grid/Filters'));
//const Login = lazyWithPreload(() => import('./js/pages/authpages/Login'));
const Account = lazyWithPreload(() => import('./js/pages/authpages/Account'));
const ProtectedRoutes = lazyWithPreload(() => import('./js/pages/ProtectedRoutes'));
const Socials = lazyWithPreload(() => import('./js/pages/authpages/Socials'));
const Info = lazyWithPreload(() => import('./js/pages/Infoz'));

Player.preload();
Filters.preload();
Account.preload();
const App = () => {
    const location = useLocation();
  
    const hideHeaderPaths = [
      "/watch/:title/:id",
      "/watch/:title/:id/:season_number/:episode_number",
    ];
  
    // Check if the current location matches any of the hideHeaderPaths
    const hideHeader = hideHeaderPaths.some(path =>
      matchPath({ path, end: true }, location.pathname)
    );

  return (
    <>
      <AuthContextProvider>
      {!hideHeader && <Header />}
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:category" element={<Catalog />} />
          <Route path="/filter" element={  
            <Suspense fallback={null}>
              <Filters />
            </Suspense>} />
          <Route path="/:category/:id" element={<Detail />} />
          
          <Route path="/:category/search/:keyword" element={<Catalog />} />
          
          <Route path="/socials" element={<Socials />} />
          <Route path="/account" element={ <Suspense fallback={null}>
            <ProtectedRoutes><Account /></ProtectedRoutes>
          </Suspense>} />
          <Route path="/watch/:title/:id" element= {<Suspense fallback={null}><Player /> </Suspense>} />
        <Route path="/watch/:title/:id/:season_number/:episode_number" element={ <Suspense fallback={null}><Player /> </Suspense>} />
        
          <Route path="/info" element={ <Suspense fallback={null}><Info /></Suspense>} />
         
      
        <Route path="*" element={<h1>404</h1>} />
        </Routes>
        {!hideHeader && <Footer />}
     </AuthContextProvider>
    </>
  );
};

export default App;


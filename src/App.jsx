import { Suspense } from 'react';
import { Routes, Route, matchPath, useLocation } from 'react-router-dom';
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
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { ToastContainer } from 'react-toastify';
import useAdControl from './js/hooks/useAdControl';
import Collection from './js/components/collections/collections';
import AnimatedPage from './js/components/animatedpage/AnimatedPage'; // Import the AnimatedPage component

// Lazy-loaded components
const Filters = lazyWithPreload(() => import('./js/components/movie-grid/Filters'));
const Account = lazyWithPreload(() => import('./js/pages/authpages/Account'));
const ProtectedRoutes = lazyWithPreload(() => import('./js/pages/ProtectedRoutes'));
const Socials = lazyWithPreload(() => import('./js/pages/authpages/Socials'));
const Info = lazyWithPreload(() => import('./js/pages/Infoz'));
const DMCATakedownRequest = lazyWithPreload(() => import('./js/pages/authpages/Dmca'));

// Preload components
Filters.preload();
Account.preload();
Socials.preload();

const App = () => {
  useAdControl();
  const location = useLocation();

  const hideHeaderPaths = [
    "/watch/:title/:id",
    "/watch/:title/:id/:season_number/:episode_number",
    "/movie/:id",
    "/tv/:id",
  ];

  const hideSidebar = hideHeaderPaths.some(path =>
    matchPath({ path, end: true }, location.pathname)
  );

  const hideHeader = hideHeaderPaths.some(path =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <>
    
      <AuthContextProvider>
        {!hideHeader && <Header />}
        {!hideSidebar && <Sidebar />}
        {/*
          Wrap your Routes with AnimatePresence.
          The 'key' prop on Routes (or directly on the element if you prefer)
          is crucial for AnimatePresence to detect when a component is
          being replaced. `location.pathname` is a common and effective key.
          'mode="wait"' ensures the exiting page animates out before the new one enters.
        */}
        <div style={{ position: 'relative', minHeight: '100vh'  , overflowX: 'hidden' }}> {/* Parent container for absolute positioning */}
           <ToastContainer
          toastClassName="blurred-toast"
          bodyClassName="toast-body"
          theme="dark"
          //fontSize="11px"
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          //rtl={false}
         
          draggable={false}
          pauseOnHover={true}
          icon={false}
        />
          <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/z/:category" element={<AnimatedPage><Catalog /></AnimatedPage>} />
              <Route path="/filter" element={
                <AnimatedPage>
                  <Suspense fallback={null}>
                    <Filters />
                  </Suspense>
                </AnimatedPage>} />
              <Route path='/collections' element={<AnimatedPage><Suspense fallback={null}><Collection /></Suspense></AnimatedPage>} />
              <Route path="/:category/:id" element={<AnimatedPage><Detail/></AnimatedPage>} />
              <Route path="/search" element={<AnimatedPage><Search /></AnimatedPage>} />
              <Route path="/watch/:title/:id" element={<AnimatedPage><Player /></AnimatedPage>} />
              <Route path="/watch/:title/:id/:season_number/:episode_number" element={<AnimatedPage><Suspense fallback={null}><Player /></Suspense></AnimatedPage>} />
              <Route path='/contact' element={<AnimatedPage><Suspense fallback={null}><ContactPage /></Suspense></AnimatedPage>} />
              <Route path='/dmca' element={<AnimatedPage><Suspense fallback={null}><DMCATakedownRequest /></Suspense></AnimatedPage>} />
              <Route path="/privacypolicy" element={<AnimatedPage><Suspense fallback={null}><Socials /></Suspense></AnimatedPage>} />
              <Route path="/account" element={
                <AnimatedPage>
                  <Suspense fallback={null}>
                    <ProtectedRoutes><Account /></ProtectedRoutes>
                  </Suspense>
                </AnimatedPage>} />
              <Route path="/aboutzilla" element={<AnimatedPage><Suspense fallback={null}><Info /></Suspense></AnimatedPage>} />
              <Route path="*" element={<AnimatedPage><h1> You got lost somehow, Damn a 404 </h1></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </div>
       
      </AuthContextProvider>
    </>
  );
};

export default App;

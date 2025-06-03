import React, { useEffect, useState } from "react";
import { UserAuth } from '../../context/AuthContext';
import { useFirestore } from "../../Firestore";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { toast } from 'react-toastify'; // Make sure you have react-toastify installed

import './savedshows.scss'; // Assuming this SCSS file will now style the main library sections

const SavedMovies = () => { // Renamed for clarity but keeps original file name for now
    const { user } = UserAuth();

    const { getWatchlist, getFavourites, addToFavourites, checkIfInFavourites, removeFromWatchlist, removeFromFavourites } = useFirestore();
    const [watchlist, setWatchlist] = useState({ all: [], movies: [], tv: [] });
    const [activeList, setActiveList] = useState('all'); // Controls filtering within watchlist
    const [myFavourites, setFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [infavourites, setIsInFavourites] = useState(false); // This seems to be for a single selected item
    const [selectedItem, setSelectedItem] = useState(null); // Used for checking fav status of a specific item

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                setIsLoading(true);
                try {
                    const watchlistData = await getWatchlist(user?.uid);
                    const movies = watchlistData.filter((item) => item.category === 'movie');
                    const tv = watchlistData.filter((item) => item.category === 'tv');
                    setWatchlist({ all: watchlistData, movies, tv });

                    const favouritesData = await getFavourites(user?.uid);
                    setFavourites(favouritesData);
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    toast.error("Failed to load your library. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUserData();

        // Re-check favorite status if selectedItem changes
        if (selectedItem) {
            checkIfInFavourites(user?.uid, selectedItem?.id).then((data) => {
                setIsInFavourites(data);
            });
        }
    }, [user?.uid, selectedItem]);

    const handleListChange = (list) => {
        setActiveList(list);
    };

    const AddfavShow = async (item) => {
        if (!user) {
            toast.error('Please log in to add to favorites.');
            return;
        }

        const data = {
            id: item?.id,
            title: item?.title || item?.name,
            category: item.category,
            poster_path: item?.poster_path,
            release_date: item?.release_date || item?.first_air_date,
            vote_average: item?.vote_average,
        };

        const dataId = item?.id?.toString();
        try {
            await addToFavourites(user?.uid, dataId, data);
            toast.success(`${item.title || item.name} added to Favorites!`);
            // Update myFavourites state immediately
            const updatedFavourites = await getFavourites(user?.uid);
            setFavourites(updatedFavourites);
        } catch (error) {
            console.error("Error adding to favorites:", error);
            toast.error(`Failed to add ${item.title || item.name} to Favorites.`);
        }
    };

    const handleRemoveFromWatchlist = async (item) => {
        try {
            await removeFromWatchlist(user?.uid, item.id);
            toast.info(`${item.title || item.name} removed from Watchlist.`);
            const updatedWatchlist = await getWatchlist(user?.uid);
            const movies = updatedWatchlist.filter((i) => i.category === 'movie');
            const tv = updatedWatchlist.filter((i) => i.category === 'tv');
            setWatchlist({ all: updatedWatchlist, movies, tv });
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            toast.error(`Failed to remove ${item.title || item.name} from Watchlist.`);
        }
    };

    const handleRemoveFromFavourites = async (item) => {
        try {
            await removeFromFavourites(user?.uid, item.id);
            toast.info(`${item.title || item.name} removed from Favorites.`);
            const updatedFavourites = await getFavourites(user?.uid);
            setFavourites(updatedFavourites);
        } catch (error) {
            console.error("Error removing from favorites:", error);
            toast.error(`Failed to remove ${item.title || item.name} from Favorites.`);
        }
    };

    const handlecardClick = (id, category, title, poster_path) => {
        let continueWatching = JSON.parse(localStorage.getItem('ContinueWatching')) || [];
        if (!Array.isArray(continueWatching)) {
            continueWatching = [];
        }
        const foundItem = continueWatching.find(item => item.id === id);
        if (!foundItem) {
            continueWatching = [...continueWatching, { id, category, title, poster_path }];
            localStorage.setItem('ContinueWatching', JSON.stringify(continueWatching));
        }
        navigate(`/${category}/${id}`);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }
    };

    // Helper function to get the display title for the active list
    const getListTitle = () => {
        switch (activeList) {
            case 'all':
                return 'Watchlist';
            case 'movies':
                return 'Movielist';
            case 'tv':
                return 'Showlist';
            case 'favourites':
                return 'Favourites';
            default:
                return 'Watchlist';
        }
    };

    // Determine the current list and its length for the header
    const currentList = activeList === 'favourites' ? myFavourites : watchlist[activeList];
    const listLength = currentList?.length || 0;


    return (
        <>
            {/* Watchlist Section */}
            <div className="watchlist-section">
                <div className="section-header">
                    <AnimatePresence mode="wait">
                        {listLength === 0 ? (
                            <motion.h3
                                key="empty-title"
                                className="favz"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {getListTitle()} is Empty!
                            </motion.h3>
                        ) : (
                            <motion.h3
                                key="populated-title"
                                className="favz"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                My {getListTitle()} ({listLength})
                            </motion.h3>
                        )}
                    </AnimatePresence>

                    <div className="category-toggle">
                        <Button
                            className={`toggle-button ${activeList === 'all' ? 'active' : ''}`}
                            onClick={() => handleListChange('all')}
                        >
                            All
                        </Button>
                        <Button
                            className={`toggle-button ${activeList === 'movies' ? 'active' : ''}`}
                            onClick={() => handleListChange('movies')}
                        >
                            Movies
                        </Button>
                        <Button
                            className={`toggle-button ${activeList === 'tv' ? 'active' : ''}`}
                            onClick={() => handleListChange('tv')}
                        >
                            TV-Shows
                        </Button>
                        <Button
                            className={`toggle-button ${activeList === 'favourites' ? 'active' : ''}`}
                            onClick={() => handleListChange('favourites')}
                        >
                            Favourites
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonTheme baseColor="#ffffff10" enableAnimation={false}>
                        <div className="watchlist-grid skeleton-grid">
                            {[...Array(6)].map((_, i) => ( // Show 6 skeleton cards
                                <Skeleton key={i} className="watchlistimgcontainer skeleton-card" />
                            ))}
                        </div>
                    </SkeletonTheme>
                ) : (
                    <AnimatePresence mode='wait'>
                        {/* Display watchlist or favourites based on activeList */}
                        {activeList !== 'favourites' && watchlist[activeList] && watchlist[activeList].length > 0 ? (
                            <motion.div
                                className="watchlist-grid"
                                key={activeList} // Key change for AnimatePresence
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.05 } },
                                    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                }}
                            >
                                {watchlist[activeList].map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="watchlistcard"
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="watchlistimgcontainer image-overlay" onClick={() => handlecardClick(item.id, item.category, item.title || item.name, item.poster_path)}>
                                            <img
                                                className="watchlistimg"
                                                src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                                                alt={item.title || item.name}
                                                loading="lazy"
                                            />
                                            {/* Play icon will be handled by SCSS on hover */}
                                        </div>
                                        <div className="features">
                                            <motion.div
                                                className="featuretitlew"
                                                onClick={() => handleRemoveFromWatchlist(item)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <i className='bx bx-check-double'></i>
                                                <h4>completed</h4>
                                            </motion.div>

                                            {Object.values(myFavourites).some((favourite) => favourite.id === item.id) ? (
                                                <motion.div
                                                    className="featuretitlef is-favourite"
                                                    onClick={() => handleRemoveFromFavourites(item)} // Allow removing from favourites directly
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <i className="bx bxs-heart"></i>
                                                   
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    className="featuretitlef"
                                                    onClick={() => { AddfavShow(item); setSelectedItem(item); }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <i className="bx bx-heart"></i>
                                                </motion.div>
                                            )}
                                            
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : activeList === 'favourites' && myFavourites.length > 0 ? (
                               <motion.div
                                    className="watchlist-grid"
                                    key="favourites-grid"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.05 } },
                                        exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                    }}
                                >
                                    {myFavourites.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="watchlistcard"
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.05, zIndex: 10 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="watchlistimgcontainer image-overlay" onClick={() => handlecardClick(item.id, item.category, item.title || item.name, item.poster_path)}>
                                                <img
                                                    className="watchlistimg"
                                                    src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                                                    alt={item.title || item.name}
                                                    loading="lazy"
                                                />
                                                {/* Play icon will be handled by SCSS on hover */}
                                            </div>
                                            <div className="featureswa">
                                                <motion.div
                                                    className="featuretitle"
                                                    onClick={() => { handleRemoveFromFavourites(item); }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                     <i className='bx bx-trash'></i>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                        ) : (
                            <motion.div
                                key="no-items"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="load no-items-message"
                            >
                                There's Nothing in your {activeList === 'all' ? 'watchlist' : activeList === 'favourites' ? 'favourites' : activeList === 'movies' ? 'movies watchlist' : 'TV shows watchlist'} <i className='bx bxs-binoculars'></i>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </>
    );
};

export default SavedMovies;
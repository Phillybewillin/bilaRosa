import React, { useState, useEffect , useCallback } from "react";
import { UserAuth } from "../../context/AuthContext";
import './account.scss';
import SavedMovies from "./SavedMovies";
import Avatar from "react-avatar";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to format time (e.g., seconds to HHh MMm)
const formatTime = (totalSeconds) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

// Emoji Picker Component - Now a proper modal
const EmojiPicker = ({ onSelectEmoji, onClose }) => {
    const emojis = ['😊', '😂', '😍', '🤩', '😎', '🥳', '🚀', '🔥', '🎉', '👍', '❤️', '🌟', '👾', '💯', '✨', '⚡' , '☠️','👌','😢','😶‍🌫️','🤯','😩','🤬','🤡','🥸','😈','💀','👺','👹','👽','🤖','🐺','🤺','🧑‍🦲','👨‍🚒','👩‍🚀','👨‍✈️','🤹','🎭','🏀','🤿','📽️','📎','🥀','🛸'];

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 10 } },
    };
  
    const onClear = () => {
        onSelectEmoji('');
        //onClose();
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="emoji-picker-overlay"
            onClick={onClose} // Close when clicking outside the modal
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="emoji-picker-modal"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="emoji-grid">
                    {emojis.map((emoji, index) => (
                        <motion.span
                            key={index}
                            variants={itemVariants}
                            onClick={() => { onSelectEmoji(emoji); onClose(); }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </div>
                <div className="buttonholder">
                    <button onClick={onClose} className="close-emoji-picker-btn">Close</button>
                     <button onClick={onClear} className="close-emoji-picker-btn">Remove Moji</button>
           
                </div>
                </motion.div>
        </motion.div>
    );
};

const Account = () => {
    const { user , logOut } = UserAuth();
    document.title = "My Library | MoviePluto";
    const navigate = useNavigate();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(localStorage.getItem('userEmojiAvatar') || '');

    // State for Watch Stats
    const [watchStreak, setWatchStreak] = useState(0);
    const [longestWatchStreak, setLongestWatchStreak] = useState(0);
    const [moviesWatchedCount, setMoviesWatchedCount] = useState(0);
    const [showsWatchedCount, setShowsWatchedCount] = useState(0);
    const [totalWatchTimeMinutes, setTotalWatchTimeMinutes] = useState(0); // New state for total watch time
    const [dynamicBackground, setDynamicBackground] = useState('');
    const [lastStreakUpdate, setLastStreakUpdate] = useState(0); // Timestamp of last streak update
    const [currentDayMarker, setCurrentDayMarker] = useState(0); // For streak visualization

    // State for Continue Watching items from localStorage
    const [continueWatching, setContinueWatching] = useState([]);
    const [uniqueWatchedMovies, setUniqueWatchedMovies] = useState([]);
    const [uniqueWatchedShows, setUniqueWatchedShows] = useState([]);


    const email = user?.email;
    const username = email ? email.split('@')[0] : 'Guest';
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    // Effect to calculate watch stats and set background
    useEffect(() => {
        const updateWatchStatsAndBackground = () => {
            const storedHistory = localStorage.getItem('playerDataList');
            let historyItems = [];
            if (storedHistory) {
                try {
                    historyItems = Object.values(JSON.parse(storedHistory) || {})
                        .filter(item => item && typeof item.lastWatched === 'number') // Filter out invalid items
                        .sort((a, b) => b.lastWatched - a.lastWatched); // Most recent first
                } catch (e) {
                    console.error("Error parsing playerDataList from localStorage:", e);
                    historyItems = [];
                }
            }

            // Set dynamic background from the most recent item
            if (historyItems.length > 0) {
                const mostRecentItem = historyItems[0];
                const backdropPath = mostRecentItem.backdrop_path || mostRecentItem.poster_path;
                if (backdropPath) {
                    setDynamicBackground(`https://image.tmdb.org/t/p/w500/${backdropPath}`);
                } else {
                    setDynamicBackground('');
                }
            } else {
                setDynamicBackground('');
            }

            // Calculate movies and shows watched counts correctly based on 'season'
            const uniqueMovies = [];
            const uniqueShows = [];
            const movieItemsWithDetails = [];
            const showItemsWithDetails = [];
            let totalTimeInSeconds = 0; // Initialize total watch time

            historyItems.forEach(item => {
                // Sum up timeSpent for all items
                if (item.timeSpent && typeof item.timeSpent === 'number') {
                    totalTimeInSeconds += item.timeSpent;
                }

                if (item.seasonNumber) {
                    if (!uniqueShows.includes(item.id)) {
                        uniqueShows.push(item.id );

                        // Store details for show boxes
                        showItemsWithDetails.push({ id: item.id, title: item.title || item.name, poster_path: item.poster_path });
                    }
                } else {
                    if (!uniqueMovies.includes(item.id)) {
                        uniqueMovies.push(item.id);
                        // Store details for movie boxes
                        movieItemsWithDetails.push({ id: item.id, title: item.title || item.name, poster_path: item.poster_path });
                    }
                }
            });

            setMoviesWatchedCount(uniqueMovies.length);
            setUniqueWatchedMovies(movieItemsWithDetails); // Set unique watched movies with details
            setUniqueWatchedShows(showItemsWithDetails);
            setShowsWatchedCount(uniqueShows.length);
            setTotalWatchTimeMinutes(Math.round(totalTimeInSeconds / 60)); // Convert to minutes and round

            // Streak calculation
            const savedStreakData = JSON.parse(localStorage.getItem('watchStreakData')) || {
                current: 0,
                longest: 0,
                lastUpdateTimestamp: 0,
                lastWatchedDay: null
            };

            let currentStreak = savedStreakData.current;
            let longestStreak = savedStreakData.longest;
            const lastUpdateTimestamp = savedStreakData.lastUpdateTimestamp;
            const lastWatchedDay = savedStreakData.lastWatchedDay;

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(); // Normalize today to start of day
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime(); // Normalize yesterday

            const uniqueWatchedDates = [...new Set(historyItems.map(item =>
                new Date(new Date(item.lastWatched).setHours(0, 0, 0, 0)).getTime()
            ))].sort((a, b) => a - b); // Sorted ascending

            let newCurrentStreak = currentStreak;
            let newLongestStreak = longestStreak;
            let newLastWatchedDay = lastWatchedDay;
            let needsUpdate = false;

            if (historyItems.length > 0) {
                const latestWatchTimestamp = historyItems[0].lastWatched;
                const latestWatchDate = new Date(latestWatchTimestamp).setHours(0, 0, 0, 0); // Normalized

                // Check if the latest watch date is today
                if (latestWatchDate === today) {
                    if (lastWatchedDay !== today) { // If it's a new day for the streak
                        newCurrentStreak = (lastWatchedDay === yesterday) ? currentStreak + 1 : 1;
                        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
                        newLastWatchedDay = today;
                        needsUpdate = true;
                    }
                    // If lastWatchedDay is already today, no change to streak
                }
                // Check if the latest watch date was yesterday AND current streak was active yesterday
                else if (latestWatchDate === yesterday && lastWatchedDay === yesterday) {
                    // Streak continues, no need to increment until today's watch
                    newCurrentStreak = currentStreak; // Maintain the streak value from yesterday
                    // No update needed for longest streak or lastWatchedDay unless a new watch happens today
                }
                // If latest watch date is neither today nor yesterday, or if it was yesterday but the streak was broken before today
                else if (latestWatchDate < yesterday && newCurrentStreak > 0) { // Streak was active but has now definitely broken
                    newCurrentStreak = 0;
                    newLastWatchedDay = null;
                    needsUpdate = true;
                }
            } else {
                // If no history, reset streak
                if (currentStreak > 0) {
                    newCurrentStreak = 0;
                    newLastWatchedDay = null;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                setWatchStreak(newCurrentStreak);
                setLongestWatchStreak(newLongestStreak);
                setLastStreakUpdate(now.getTime());
                localStorage.setItem('watchStreakData', JSON.stringify({
                    current: newCurrentStreak,
                    longest: newLongestStreak,
                    lastUpdateTimestamp: now.getTime(),
                    lastWatchedDay: newLastWatchedDay
                }));
            } else {
                // If no update, just load existing data
                setWatchStreak(savedStreakData.current);
                setLongestWatchStreak(savedStreakData.longest);
                setLastStreakUpdate(savedStreakData.lastUpdateTimestamp);
            }

            // Set current day marker for visual
            const currentDayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday...
            setCurrentDayMarker(currentDayOfWeek);
        };

        // Initialize continue watching from localStorage
        setContinueWatching(JSON.parse(localStorage.getItem('ContinueWatching')) || []);

        updateWatchStatsAndBackground();

        const handleStorageChange = (e) => {
            if (e.key === 'playerDataList' || e.key === 'watchStreakData') {
                updateWatchStatsAndBackground();
            }
            if (e.key === 'ContinueWatching') {
                setContinueWatching(JSON.parse(e.newValue) || []);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Set up an interval to periodically check and update streak
        // This is important because storage events only fire between different tabs/windows, not within the same tab
        const streakInterval = setInterval(updateWatchStatsAndBackground, 60 * 60 * 1000); // Check every hour

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(streakInterval);
        };
    }, []);

    const handleSelectEmoji = (emoji) => {
        setSelectedEmoji(emoji);
        localStorage.setItem('userEmojiAvatar', emoji);
    };

    const handleRemoveEmoji = () => {
        setSelectedEmoji('');
        localStorage.removeItem('userEmojiAvatar');
    };


    // Helper to get day name for streak visualization
    const getDayName = (dayIndex) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[dayIndex];
    };

     const handleLogout = useCallback(async () => {
            try {
                await logOut();
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }, [logOut, navigate]);

    return (
        <>
            <div
                className="account-page-backdrop"
                style={{
                    backgroundImage: dynamicBackground ? `url(${dynamicBackground})` : 'var(--default-account-bg-image)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    filter: 'blur(75px)', // Corrected filter property
                    WebkitFilter: 'blur(75px)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -2,
                    transition: 'background-image 0.5s ease-in-out, filter 0.5s ease-in-out'
                }}
            ></div>
            <div className="account-page-overlay"></div>

            <div className="account-content">
                <div className="main-account-layout">
                    <div className="left-column">
                        <motion.div
                            className="user-profile-header"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="avatar-section">
                                <motion.div
                                    className="user-avatar-wrapper"
                                    onClick={() => setShowEmojiPicker(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {selectedEmoji ? (
                                        <span className="user-emoji-avatar">{selectedEmoji}</span>
                                    ) : (
                                        <Avatar
                                            name={user?.email}
                                            round
                                            size="100"
                                            color="#282828"
                                            fgColor="#ffffff"
                                        />
                                    )}
                                </motion.div>
                                <div className="user-info">
                                     <button className="user-sign-out" onClick={() => handleLogout()}> Sign Out</button>
                                     <p className="user-email">{user?.email}</p>
                              
                                    <h2 className="user-greeting">Hello - <span className="username-text">{capitalizedUsername}</span></h2>
                             </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="activity-summary-stats"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2>Activity Overview</h2>
                            <div className="stats-grid">
                                <motion.div className="stat-card" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                    <i className='bx bx-trending-up'></i>
                                    <h3>Watch Streak</h3>
                                    <p className="stat-value">{watchStreak} Days</p>
                                    <small>Longest: {longestWatchStreak} Days</small>
                                    <div className="streak-visualizer">
                                        {[...Array(7)].map((_, i) => {
                                            // Calculate the day index for the last 7 days, including today.
                                            // The first element in the array (i=0) represents the current day,
                                            // i=1 represents yesterday, and so on.
                                            const dayOffset = i; // 0 for today, 1 for yesterday, etc.
                                            const displayDate = new Date();
                                            displayDate.setDate(displayDate.getDate() - dayOffset);
                                            const displayDayIndex = displayDate.getDay();
                                            const dayName = getDayName(displayDayIndex);

                                            // Determine if this day should be marked as watched for streak visualization
                                            // A day is "watched" if it falls within the current watchStreak length
                                            // and its normalized date is one of the unique watched dates.
                                            const isWatchedDayInStreak = dayOffset < watchStreak;

                                            return (
                                                <div key={displayDayIndex} className={`day-marker ${dayOffset === 0 ? 'today' : ''} ${isWatchedDayInStreak ? 'watched-day' : ''}`}>
                                                    <span className="day-name">{dayName}</span>
                                                    {isWatchedDayInStreak && <span className="streak-dot"></span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                                <motion.div className="stat-card movies-watched-card" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                    <i className='bx bx-camera-movie'></i>
                                    <h3>Movies Watched</h3>
                                    <p className="stat-value">{moviesWatchedCount}</p>
                                    <div className="movie-boxes-container">
                                        {moviesWatchedCount > 0 ? (
                                            uniqueWatchedMovies.slice(0, 15).map((movie, index) => ( // Limit to 15 boxes for visual appeal
                                                <div key={index} className="movie-box-item" data-tooltip-id={`movie-tooltip-${movie.id}`}>
                                                    <span className="movie-box-tooltip" id={`movie-tooltip-${movie.id}`}>{movie.title}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-movies-message">No movies watched yet!</p>
                                        )}
                                        {moviesWatchedCount > 15 && (
                                            <div className="movie-box-item more-movies-box">
                                                +{moviesWatchedCount - 15}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div className="stat-card shows-watched-card" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                    <i className='bx bx-tv'></i>
                                    <h3>Shows Watched</h3>
                                    <p className="stat-value">{showsWatchedCount}</p>

                                    <div className="movie-boxes-container">
                                        {showsWatchedCount > 0 ? (
                                            uniqueWatchedShows.slice(0, 20).map((movie, index) => ( // Limit to 15 boxes for visual appeal
                                                <div key={index} className="movie-box-item" data-tooltip-id={`movie-tooltip-${movie.id}`}>
                                                    <span className="movie-box-tooltip" id={`movie-tooltip-${movie.id}`}>{movie.title}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-movies-message">No movies watched yet!</p>
                                        )}
                                        {showsWatchedCount > 20 && (
                                            <div className="movie-box-item more-movies-box">
                                                +{showsWatchedCount - 20}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                {/* New Total Watch Time Card */}
                                <motion.div className="stat-card total-watch-time-card" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                    <i className='bx bx-time'></i>
                                    <h3>Total Watch Time</h3>
                                    <p className="stat-value">{totalWatchTimeMinutes} Minutes</p>
                                    <small>{formatTime(totalWatchTimeMinutes * 60)}</small> {/* Also show in Hh Mm format */}
                                </motion.div>
                            </div>
                            {moviesWatchedCount === 0 && showsWatchedCount === 0 && (
                                <motion.p
                                    className="no-history-message"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No watch history yet! Start watching to see your stats here.
                                </motion.p>
                            )}
                        </motion.div>
                    </div>

                    <div className="right-column">
                        <motion.div
                            className="my-library-section"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <SavedMovies />
                        </motion.div>
                    </div>
                </div>


            </div>
            <ToastContainer
            toastClassName="blurred-toast"
            bodyClassName="toast-body"
            theme="dark"
            //fontSize="11px"
            position="bottom-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            //rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={true}
            icon={false}
            />

            <AnimatePresence>
                {showEmojiPicker && (
                    <EmojiPicker onSelectEmoji={handleSelectEmoji} onClose={() => setShowEmojiPicker(false)} />
                )}
            </AnimatePresence>
        </>
    );
}

export default Account;
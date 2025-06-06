import { useRef, useState, useEffect ,useCallback, use  } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import "./player.scss";
import "../detail/seasons.scss";
import apiConfig from "../../api/apiConfig";
import ErrorBoundary from "../../pages/Errorboundary";
import logo from "../../assets/LOGGO3.png";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";

import { UserAuth } from "../../context/AuthContext";
import { useFirestore } from "../../Firestore";
import tmdbApi from "../../api/tmdbApi";
import MovieCard from "../../components/movie-card/MovieCard";
import { motion , AnimatePresence } from "framer-motion";


export default function Player() {
  const { title, id, season_number, episode_number } = useParams();
  const { user } = UserAuth();
  const {
    addToWatchlist,
    checkIfInWatchlist,
    removeFromWatchlist,
    addToFavourites,
    checkIfInFavourites,
    removeFromFavourites,
  } = useFirestore();
  const navigate = useNavigate();
  const category = season_number ? "tv" : "movie";

  const [itemData, setItemData] = useState([]);
  const [episodes, setEpisodeData] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode_number);
  const [bgChanged, setbgChanged] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(season_number);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [totalseasons, settotalseasons] = useState(0);
  const [saved, setSaved] = useState(false);
  const [like, setLike] = useState(false);
  const [reco, setReco] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [triedSources, setTriedSources] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [collection, setCollection] = useState([]);

  const options = [
   { value: "https://moviesapi.club/", label: "GRANADILLA" },
   { value: "https://vidfast.pro/", label: " CANTALOUPE" },
   { value: "https://111movies.com/", label: "PEACH" },
   { value: "https://player.vidsrc.co/embed/", label: "MANGOSTEEN" },
   { value: "https://player.autoembed.cc/embed/", label: "STRAWBERRY"},
   { value: "https://vidora.su/", label: "DRAGONFRUIT" },
   { value: "https://vidzee.wtf/", label: "TANGERINE" },
   { value: "https://vidzee.wtf/2", label: "TANGERINE 4K" },
   { value: "https://vidsrc.rip/embed/", label: "PERSIMMON" },
   { value: "https://vidjoy.pro/embed/", label: "DURIAN" },
   { value: "https://vidlink.pro/", label: "PINEBERRY" },
   { value: "https://player.videasy.net/", label: "APPLE 4K"},
   { value: "https://vidsrc.me/embed/", label: "KIWI" },
   { value: "https://embed.su/embed/", label: "GRAPE" },
   { value: "https://autoembed.pro/embed/", label: "LEMON" },
   { value: "https://vidsrc.cc/v2/embed/", label: "CHERRY" },
   { value: "https://vidsrc.xyz/embed/", label: "BANANA" },
   { value: "https://player.autoembed.cc/", label: "WATERMELON" },
  
 ];
  
  // -------------------------------
  // LOCAL STORAGE & TIMING
  // -------------------------------
  const startTimeRef = useRef(Date.now());

  
  // -------------------------------
  // DISPLAY MODE TOGGLE (Normal / YouTube)
  // -------------------------------
  const EPISODE_LAYOUT_STORAGE_KEY = 'episodeLayoutMode';
  const DISPLAY_MODE_STORAGE_KEY = 'displayMode';
  
  const [episodeLayoutMode, setEpisodeLayoutMode] = useState(
    parseInt(localStorage.getItem(EPISODE_LAYOUT_STORAGE_KEY)) || 3
  );
  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem(DISPLAY_MODE_STORAGE_KEY) || 'normal'
  );
  
  useEffect(() => {
    localStorage.setItem(EPISODE_LAYOUT_STORAGE_KEY, episodeLayoutMode.toString());
  }, [episodeLayoutMode]);
  
  useEffect(() => {
    localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, displayMode);
  }, [displayMode]);
  
  const toggleEpisodeLayout = () => {
setEpisodeLayoutMode((prev) => (prev % 3) + 1);

  };
  
  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev === 'normal' ? 'youtube' : 'normal'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // -------------------------------
  // SEASONS OVERFLOW ARROWS
  // -------------------------------
  const seasonsContainerRef = useRef(null);
  const episodesContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  const [showLeftArrowEpisodes, setShowLeftArrowEpisodes] = useState(false);
  const [showRightArrowEpisodes, setShowRightArrowEpisodes] = useState(false);

  const updateArrowVisibility = () => {
    if (seasonsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = seasonsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }

    if (episodesContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = episodesContainerRef.current;
      setShowLeftArrowEpisodes(scrollLeft > 0);
      setShowRightArrowEpisodes(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    const container = seasonsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrowVisibility);
    }
    window.addEventListener("resize", updateArrowVisibility);
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateArrowVisibility);
      }
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [seasons , currentSeason , currentEpisode , season_number , episode_number ,displayMode]);

  useEffect(() => {
    updateArrowVisibility();
    const container = episodesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrowVisibility);
    }
    window.addEventListener("resize", updateArrowVisibility);
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateArrowVisibility);
      }
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [episodes , currentSeason , currentEpisode , season_number , episode_number ]);

  const scrollLeft = () => {
    if (seasonsContainerRef.current) {
      seasonsContainerRef.current.scrollBy({
        left: -500,
        behavior: "smooth",
      });
    }
  };
  const scrollLeftep = () => {
    if (episodesContainerRef.current) {
      episodesContainerRef.current.scrollBy({
        left: -500,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (seasonsContainerRef.current) {
      seasonsContainerRef.current.scrollBy({
        left: 500,
        behavior: "smooth",
      });
    }
  };
  const scrollRightep = () => {
    if (episodesContainerRef.current) {
      episodesContainerRef.current.scrollBy({
        left: 500,
        behavior: "smooth",
      });
    }
  };

  const getDetail = async () => {
    const response = await tmdbApi.detail(category, id, { params: {} });
    const similar = await tmdbApi.similar(category, id);
    setItemData(response);
     //console.log(response);
    setReco(similar.results);
    if (response.belongs_to_collection) {
      const collectionId = response.belongs_to_collection.id;
      fetch(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${apiConfig.apiKey}`)
        .then((res) => res.json())
        .then((collection) => {
          setCollection(collection);
          console.log('coll', collection);
        })
        .catch((err) => console.error('Failed to fetch collection:', err));
    }
    if (category === "movie") {
      setbgChanged(response.backdrop_path);
    }
  };
  
  useEffect(() => {
    getDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (title) {
      const decodedTitles = decodeURIComponent(title);
      const decodedTitle = decodedTitles
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      document.title = `Currently Streaming ${decodedTitle} on MoviePluto`;
      if (season_number && episode_number) {
        document.title = `Currently Streaming ${decodedTitle} • S${currentSeason} • E${currentEpisode} on MoviePluto`;
      }
    }
    if (id && currentSeason) {
      fetchEpisodes(id, currentSeason);
    }
  }, [title, id, currentSeason, currentEpisode]);

  useEffect(() => {
    if (id && season_number && episode_number) {
      const getseasons = async () => {
        const { data } = await axios.get(
          `${apiConfig.baseUrl}tv/${id}?api_key=${apiConfig.apiKey}`
        );
        const validSeasons = data.seasons.filter(
          ({ air_date }) => air_date && new Date(air_date) <= new Date()
        );
        setSeasons(validSeasons);
        settotalseasons(
          validSeasons.filter((season) => season.season_number !== 0).length
        );
        setbgChanged(
          apiConfig.w200Image(validSeasons[0].poster_path) ||
            apiConfig.w200Image(itemData.backdrop_path)
        );
      };
      getseasons();
    }
  }, [id]);

  const fetchEpisodes = async (id, selectedSeason) => {
    if (id && selectedSeason) {
      try {
        const response = await axios.get(
          `${apiConfig.baseUrl}tv/${id}/season/${selectedSeason}?api_key=${apiConfig.apiKey}&append_to_response=episodes`
        );
        if (response.status === 404) {
          throw new Error("Episodes not found. Please check the season number.");
        }
        setEpisodeData(response.data.episodes);
        const releasedEpisodes = response.data.episodes.filter(
          (episode) =>
            episode.air_date && new Date(episode.air_date) <= new Date()
        );
        setTotalEpisodes(releasedEpisodes.length);
      } catch (error) {
        // Handle error appropriately
      }
    }
  };

  //error handling

  function debounce(func, delay = 500) {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  
  

  const errorCountRef = useRef({});

  const isOnline = () => navigator.onLine;

  const handleIframeError = useCallback(
    debounce((reason = "unknown") => {
      //console.warn(`handleIframeError triggered by: ${reason}`);
  
      const currentOption = options.find(option => option.value === iframeUrl);
      if (currentOption?.value === "https://vidfast.pro/") {
        //console.info("Error detected, but current source is GRANADILLA. Not switching.");
        //toast.warn("Issue detected on GRANADILLA, but no failover is configured.");
        return;
      }
  
      if (!isOnline()) {
        toast.error("You're offline. Please check your connection.");
        return;
      }
  
       errorCountRef.current[iframeUrl] = (errorCountRef.current[iframeUrl] || 0) + 1;
  
      if (errorCountRef.current[iframeUrl] > 2) {
        toast.error("Multiple retries failed for this source. Stopping attempts.");
        return;
      }
  
      setTriedSources(prev => [...prev, iframeUrl]);
  
      const currentIndex = options.findIndex(option => option.value === iframeUrl);
      let nextOption = null;
  
      for (let i = 1; i <= options.length; i++) {
        const candidate = options[(currentIndex + i) % options.length];
        if (!triedSources.includes(candidate.value)) {
          nextOption = candidate;
          break;
        }
      }
  
      if (nextOption) {
        toast.info(`Error detected (${reason}). Switching server to ${nextOption.label}`);
        setSelectedOption(nextOption);
        setIframeUrl(nextOption.value);
      } else {
        toast.error("All sources failed. Please try again later.");
      }
    }, 500),
    [iframeUrl, options, triedSources]
  );
  

useEffect(() => {
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    
    // Shift + N → Next Episode
    if (e.shiftKey && key === "n") {
      e.preventDefault();

       document.body.focus();
   
      if (currentEpisode < totalEpisodes) {
        toast.info(`Playing Next Episode: ${currentEpisode + 1}`);
        handleQuickEpisodeClickNext(currentEpisode + 1);
      } else if (currentSeason < totalseasons) {
        toast.info(`Playing Next Season: ${currentSeason + 1} Episode 1`);
        handleQuickSeasonClickNext(currentSeason + 1);
      } else {
        toast.info("You’re at the final episode and season.");
      }
    }

    // Shift + P → Previous Episode
    if (e.shiftKey && key === "p") {
      e.preventDefault();
       const iframe = document.getElementById("my_iframe");
      if (document.activeElement === iframe) {
        iframe.blur(); // remove focus from iframe
      }
      if (currentEpisode > 1) {
        toast.info(`Playing Previous Episode: ${currentEpisode - 1}`);
        handleQuickEpisodeClickNext(currentEpisode - 1);
      } else if (currentSeason > 1) {
        toast.info(`Playing Previous Season: ${currentSeason - 1}`);
        handleQuickSeasonClickNext(currentSeason - 1);
      } else {
        toast.info("You’re at the first episode and season.");
      }
    }

    // Shift + S → Next Season
    if (e.shiftKey && key === "s") {
      e.preventDefault();
      if (currentSeason < totalseasons) {
        toast.info(`Jumped to Season ${currentSeason + 1}`);
        handleQuickSeasonClickNext(currentSeason + 1);
      } else {
        toast.info("You’re already at the final season.");
      }
    }

    // 0 → Jump to Episode 1 (e.g., TV remote)

  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentEpisode, totalEpisodes, currentSeason, totalseasons]);
 

  // Handle iframe load/error/timeout
  useEffect(() => {
    const iframe = document.getElementById("my_iframe");
    if (!iframe) return;

    const timeout = setTimeout(() => {
      //console.warn("Iframe load timeout");
      handleIframeError();
    }, 10000); // 10s timeout

    const onLoad = () => {
      //setLoading(false);
      clearTimeout(timeout);
      //console.log("Iframe loaded successfully");
    };

    const onError = () => {
      clearTimeout(timeout);
      //console.warn("Iframe encountered a load error");
      handleIframeError();
    };

    iframe.addEventListener("load", onLoad);
    iframe.addEventListener("error", onError);

    return () => {
      iframe.removeEventListener("load", onLoad);
      iframe.removeEventListener("error", onError);
      clearTimeout(timeout);
    };
  }, [iframeUrl]);

  // Listen to postMessage errors from iframe
  useEffect(() => {
    const onMessage = (event) => {
      try {
        const originMatch = iframeUrl.includes(event.origin);
        if (originMatch && event.data?.type === "error") {
          //console.error("Iframe reported error:", event.data.message);
          handleIframeError();
        }
      } catch (e) {
        //console.warn("Error parsing iframe message:", e);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeUrl]);



  // -------------------------------
  // WATCHLIST & FAVOURITES FUNCTIONS (unchanged)
  // -------------------------------
  const saveShow = async (
    recodataid,
    recodataname,
    recodataposter,
    recodatadate,
    recodatavote
  ) => {
    if (!user) {
      toast.error("Access denied. Please logIn to add this to your Watchlist");
      return;
    }
    toast.info("Adding to your Watchlist" + recodataname);
    const data = {
      id: itemData?.id || recodataid,
      title: itemData?.title || itemData?.name || recodataname,
      category: season_number ? "tv" : "movie",
      poster_path: itemData?.poster_path || recodataposter,
      release_date: itemData?.release_date || itemData?.first_air_date || recodatadate,
      vote_average: itemData?.vote_average || recodatavote,
    };

    const dataId = itemData?.id?.toString() || recodataid?.toString();
    await addToWatchlist(user?.uid, dataId, data);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
    setSaved(isSetToWatchlist);
    ////console.log(isSetToWatchlist, dataId, data);
  };

 

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    checkIfInWatchlist(user?.uid, itemData?.id).then((data) => {
      setSaved(data);
    });
  }, [itemData, user, checkIfInWatchlist]);

  const AddfavShow = async () => {
    if (!user) {
      toast.error("Access denied. Please logIn to add this to your favourites");
      return;
    }
    const data = {
      id: itemData?.id,
      title: itemData?.title || itemData?.name,
      category: season_number ? "tv" : "movie",
      poster_path: itemData?.poster_path,
      release_date: itemData?.release_date || itemData?.first_air_date,
      vote_average: itemData?.vote_average,
    };
    const dataId = itemData?.id?.toString();
    await addToFavourites(user?.uid, dataId, data);
    const isSetToFav = await checkIfInFavourites(user?.uid, dataId);
    setLike(isSetToFav);
  };

  useEffect(() => {
    if (!user) {
      setLike(false);
      return;
    }
    if (itemData) {
      checkIfInFavourites(user?.uid, itemData?.id).then((data) => {
        setLike(data);
      });
    }
  }, [user, checkIfInFavourites, itemData]);

  const handleRemoveFromWatchlist = async () => {
    await removeFromWatchlist(user?.uid, itemData.id);
    setSaved(false);
  };

  const handleRemoveFromFavourites = async () => {
    await removeFromFavourites(user?.uid, itemData.id);
    setLike(false);
  };

  // -------------------------------
  // EPISODE & SEASON HANDLERS
  // -------------------------------
  const [previewSeason, setPreviewSeason] = useState(currentSeason); // holds last clicked season

  const handleEpisodeClick = (episodeNumber, episodeUrl = null) => {
    const url = new URL(window.location.href);
    const pathnameParts = url.pathname.split("/");
    if (pathnameParts.length >= 5) {
      pathnameParts[pathnameParts.length - 2] = previewSeason;
      pathnameParts[pathnameParts.length - 1] = episodeNumber;
      url.pathname = pathnameParts.join("/");
      window.history.pushState({}, "", url.toString());
    }
  
    const watchHistory = localStorage.getItem("watchHistory");
    localStorage.setItem("lastClickedSeason", previewSeason);
    const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
    if (!watchHistoryObj[id]) watchHistoryObj[id] = {};
    if (!watchHistoryObj[id][previewSeason]) watchHistoryObj[id][previewSeason] = [];
    if (!watchHistoryObj[id][previewSeason].includes(episodeNumber)) {
      watchHistoryObj[id][previewSeason].push(episodeNumber);
    }
    localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
  
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentSeason(previewSeason); // now commit
    setCurrentEpisode(episodeNumber);
    setbgChanged(apiConfig.w200Image(episodeUrl) || apiConfig.w200Image(itemData.backdrop_path));
  };
  
  

  const watchHistory = localStorage.getItem("watchHistory");
  const watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
  const watchedEpisodes =
    currentSeason !== null &&
    watchHistoryObj[id] &&
    watchHistoryObj[id][currentSeason]
      ? watchHistoryObj[id][currentSeason]
      : [];

      const handleSeasonClick = (seasonNumber) => {
        setPreviewSeason(seasonNumber); // only previewed
        fetchEpisodes(id, seasonNumber);
        
        // Optional: preload watch history (for visual cues)
        const watchHistory = localStorage.getItem("watchHistory");
        let watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
        if (!watchHistoryObj[id]) {
          watchHistoryObj[id] = {};
        }
        if (!watchHistoryObj[id][seasonNumber]) {
          watchHistoryObj[id][seasonNumber] = [];
        }
      };

      //episode next 

      const handleQuickEpisodeClickNext = (episodeNumber, episodeUrl = null) => {
        setLoading(true); // show loading before anything changes

        const url = new URL(window.location.href);
        url.pathname = url.pathname.replace(/\/\d+$/, `/${episodeNumber}`);
        window.history.pushState({}, "", url.toString());
    
        const watchHistory = localStorage.getItem("watchHistory");
        localStorage.setItem("lastClickedSeason", currentSeason);
        if (watchHistory) {
          const watchHistoryObj = JSON.parse(watchHistory);
          if (!watchHistoryObj[id]) {
            watchHistoryObj[id] = {};
          }
          if (!watchHistoryObj[id][currentSeason]) {
            watchHistoryObj[id][currentSeason] = [];
          }
          watchHistoryObj[id][currentSeason].push(episodeNumber);
          localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
        } else {
          const watchHistoryObj = {
            [id]: {
              [currentSeason]: [episodeNumber],
            },
          };
          localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentEpisode(episodeNumber);
        setbgChanged(apiConfig.w200Image(episodeUrl) || apiConfig.w200Image(itemData.backdrop_path));
        setLoading(false);
      };
    
     
    
      const handleQuickSeasonClickNext = (seasonNumber) => {
        setLoading(true); // show loading before anything changes

        const url = new URL(window.location.href);
        const pathnameParts = url.pathname.split("/");
        pathnameParts[pathnameParts.length - 2] = seasonNumber;
        pathnameParts[pathnameParts.length - 1] = "1";
        url.pathname = pathnameParts.join("/");
        window.history.pushState({}, "", url.toString());
        localStorage.setItem(`lastClickedSeason_${id}`, seasonNumber);
        setCurrentSeason(seasonNumber);
        setCurrentEpisode(1);
        // Mark the first episode as watched when season is clicked
        const watchHistory = localStorage.getItem("watchHistory");
        let watchHistoryObj = watchHistory ? JSON.parse(watchHistory) : {};
        if (!watchHistoryObj[id]) {
          watchHistoryObj[id] = {};
        }
        if (!watchHistoryObj[id][seasonNumber]) {
          watchHistoryObj[id][seasonNumber] = [];
        }
        if (!watchHistoryObj[id][seasonNumber].includes(1)) {
          watchHistoryObj[id][seasonNumber].push(1);
        }
        localStorage.setItem("watchHistory", JSON.stringify(watchHistoryObj));
        setLoading(false);
      };
    
      
      

  // -------------------------------
  // REACT-SELECT & SOURCE HANDLERS
  // -------------------------------
 

  const handleSelect = (selectedOption) => {
     setLoading(true); // show loading before anything changes
      if (itemData?.id) {
      localStorage.setItem(
        `lastSelectedOption_${itemData.id}`,
        selectedOption.value
      );
      localStorage.setItem(
        `lastClickedSource_${itemData.id}`,
        selectedOption.label
      );
      localStorage.setItem("lastSelectedOption", selectedOption.value);
      localStorage.setItem("lastClickedSource", selectedOption.label);
   
    } else {
      // Fallback to global keys if needed
      localStorage.setItem("lastSelectedOption", selectedOption.value);
      localStorage.setItem("lastClickedSource", selectedOption.label);
    }
    setSelectedOption(selectedOption);
    setIframeUrl(selectedOption.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(false);
  };
  

  useEffect(() => {
    if (!itemData?.id) return;
    
    // Retrieve per-item stored values
    const lastSelectedSourceValue = localStorage.getItem(
      `lastSelectedOption_${itemData.id}`
    );
   
    
    let prioritizedValue;
    if (lastSelectedSourceValue && options.find((option) => option.value === lastSelectedSourceValue)) {
      prioritizedValue = lastSelectedSourceValue;
    } else {
      // Fallback to global value
      prioritizedValue = localStorage.getItem("lastSelectedOption");
    }
    
    if (!prioritizedValue || !options.find((option) => option.value === prioritizedValue)) {
      //toast.info("Defaulting to Granadilla");
      prioritizedValue = options[0].value;
    }
    
    const selectedOpt = options.find((option) => option.value === prioritizedValue);
    setSelectedOption(selectedOpt);
    setIframeUrl(selectedOpt.value);
  }, [itemData]);
  

  // -------------------------------
  // IFRAME HANDLERS & SOURCES
  // -------------------------------
  

 

  const handleIframeSrc = () => {
    let src = "";
    if (iframeUrl === "https://moviesapi.club/") {
      src = `${iframeUrl}tv/${id}-${currentSeason}-${currentEpisode}`;
    } else if (iframeUrl === "https://111movies.com/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://vidfast.pro/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?theme=9B59B6&autoPlay=true&title=false&poster=true&nextButton=true&autoNext=true`;
    } else if (iframeUrl === "https://vidjoy.pro/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?adFree=true`;
    }
    else if (iframeUrl === "https://vidzee.wtf/") {
      src = `${iframeUrl}tv/multi.php?id=${id}&season=${currentSeason}&episode=${currentEpisode}`;
    }
    else if (iframeUrl === "https://vidzee.wtf/2") {
      src = `https://vidzee.wtf/tv/${id}/${currentSeason}/${currentEpisode}`;
    }
    else if (iframeUrl === "https://vidlink.pro/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?poster=true&autoplay=true&icons=vid`;
    } else if (iframeUrl === "https://autoembed.pro/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://player.videasy.net/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://player.autoembed.cc/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    }  else if (iframeUrl === "https://vidsrc.cc/v2/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://embed.su/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://vidsrc.me/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://vidsrc.xyz/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://vidora.su/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}?colour=ff0059&autoplay=true&autonextepisode=false`;
    } else if (iframeUrl === "https://player.vidsrc.co/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else if (iframeUrl === "https://player.autoembed.cc/") {
      src = `${iframeUrl}embed/tv/${id}/${currentSeason}/${currentEpisode}?server=6`;
    }
    else if (iframeUrl === "https://vidsrc.rip/embed/") {
      src = `${iframeUrl}tv/${id}/${currentSeason}/${currentEpisode}`;
    } else {
      src = iframeUrl;
    }
   
    return src;
  };

  const handlemovieIframeSrc = () => {
    let src = "";
    if (iframeUrl === "https://moviesapi.club/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://111movies.com/") {
      src = `${iframeUrl}movie/${id}`;
    }else if (iframeUrl === "https://vidjoy.pro/embed/") {
      src = `${iframeUrl}movie/${id}?adFree=true`;
    }else if (iframeUrl === "https://vidzee.wtf/") {
      src = `${iframeUrl}movie/multi.php?id=${id}`;
    }else if (iframeUrl === "https://vidzee.wtf/2") {
      src = `https://vidzee.wtf/movie/4k/${id}`;
    }
    else if (iframeUrl === "https://vidfast.pro/") {
      src = `${iframeUrl}movie/${id}?theme=9B59B6&autoPlay=true`;
    } else if (iframeUrl === "https://vidlink.pro/") {
      src = `${iframeUrl}movie/${id}?poster=true&autoplay=false&nextbutton=true&icons=vid`;
    } else if (iframeUrl === "https://player.autoembed.cc/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://autoembed.pro/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://player.videasy.net/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://player.autoembed.cc/") {
      src = `${iframeUrl}embed/movie/${id}?server=6`;
    } else if (iframeUrl === "https://vidsrc.cc/v2/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://embed.su/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://vidora.su/") {
      src = `${iframeUrl}movie/${id}?colour=ff0059`;
    } else if (iframeUrl === "https://vidsrc.me/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://vidsrc.xyz/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://player.vidsrc.co/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else if (iframeUrl === "https://vidsrc.rip/embed/") {
      src = `${iframeUrl}movie/${id}`;
    } else {
      src = iframeUrl;
    }
    return src;
  };

  const handleBack = () => {
    if (id && season_number && episode_number) {
      navigate(`/tv/${id}`);
    } else {
      navigate(`/movie/${id}`);
    }
  };

  const handleHome = () => {
    navigate("/");
  };


  const getCustomUrl = () => {
    // Generate an encoded title (lowercase, hyphenated)
    const rawTitle = itemData?.title || itemData?.name || "";
    const encodedTitle = encodeURIComponent(rawTitle.replace(/ /g, "-")).toLowerCase();
  
    if (category === "movie") {
      return `/watch/${encodedTitle}/${itemData?.id}`;
    } else {
      return `/watch/${encodedTitle}/${itemData?.id}/${currentSeason}/${currentEpisode}`;
    }
  };
  

  // Reset the timer when ID, title, season, or episode changes
  // Reset timer when these values change:
useEffect(() => {
  startTimeRef.current = Date.now();
}, [id, currentSeason, currentEpisode]);

// Helper: update localStorage with the current player's data
const updatePlayerData = () => {
  const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
  
  // Convert runtime from minutes to seconds
  const totalRuntime = ((itemData?.runtime || episodes[0]?.runtime) * 60) || 0;
  
  const lastSelectedSourceValue = localStorage.getItem( `lastSelectedOption_${itemData.id}`) || localStorage.getItem("lastSelectedOption")
  const lastSelectedSourceLabel = localStorage.getItem(`lastClickedSource_${itemData.id}`) || localStorage.getItem("lastClickedSource")
  
  let timeRemaining = 0;
  if (totalRuntime && timeSpent < totalRuntime) {
    timeRemaining = totalRuntime - timeSpent - 300; // subtract 5 minutes (300 seconds)
    if (timeRemaining < 0) timeRemaining = 0;
  }
  const dataToStore = {
    title: itemData?.title || itemData?.name,
    id: itemData?.id,
    poster_path: itemData?.poster_path,
    runtime: totalRuntime, // now in seconds
    lastEpisode: currentEpisode,
    seasonNumber: currentSeason,
    currentUrl: getCustomUrl(), // only the path
    timeSpent,
    timeRemaining,
    extra: "Additional data example",
    lastWatched: Date.now(), // for sorting recency
    lastSrc : lastSelectedSourceLabel,
    lastValue : lastSelectedSourceValue ,
  };

  // Retrieve any existing stored data (a dictionary keyed by item id)
  const stored = localStorage.getItem("playerDataList");
  const playerDataList = stored ? JSON.parse(stored) : {};
  if (itemData?.id) {
    // Update the entry for this id
    playerDataList[itemData.id] = dataToStore;
    localStorage.setItem("playerDataList", JSON.stringify(playerDataList));
    ////console.log("Updated playerDataList:", playerDataList);
  }
};

// Run updatePlayerData whenever any dependency changes:
useEffect(() => {
  const intervalId = setInterval(() => {
    updatePlayerData();
  }, 3000); // 3000ms = 3 seconds

  return () => clearInterval(intervalId);
}, [itemData?.id, itemData?.title, currentSeason, currentEpisode, episodes ,getCustomUrl()]);

  

useEffect(() => {
  if (!id) return;

  const url = new URL(window.location.href);
  const pathParts = url.pathname.split("/");

  const idFromUrl = pathParts.includes(id) ? id : null;
  const seasonFromUrl = parseInt(pathParts[pathParts.length - 2]);
  const episodeFromUrl = parseInt(pathParts[pathParts.length - 1]);

  // Defensive checks
  if (idFromUrl !== id) {
    //console.warn("URL id does not match state id");
    return;
  }

  if (!isNaN(seasonFromUrl)) {
    setCurrentSeason(seasonFromUrl);
    setPreviewSeason(seasonFromUrl); // If you're using preview-based logic
  }

  if (!isNaN(episodeFromUrl)) {
    setCurrentEpisode(episodeFromUrl);
  }

  // optional: log or flag mismatches
}, [id]);

  // -------------------------------
  // RENDERING EPISODES (including layout toggle)
  // -------------------------------


// Assuming apiConfig is defined elsewhere
// import apiConfig from '../api/apiConfig'; // Example import


const renderEpisodes = () => {
        // Define common variants for items (like list items)
        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }, // For items exiting
        };

        // Define variants for elements that appear/disappear (like play/watched badges)
        const badgeVariants = {
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.5 },
        };

        // Define variants for layout transitions (e.g., when switching episodeLayoutMode)
        const layoutVariants = {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -50 },
        };

        if (episodeLayoutMode === 1) {
            // Image layout: render episodes as images only
            return (
                <motion.div // Animate the container when layout mode changes
                    className="episode-selector image-layout"
                    style={{
                        backgroundImage: `url(${bgChanged})`,
                        backgroundSize: "cover",
                    }}
                    variants={layoutVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit" // Animate out when mode changes
                >
                    <AnimatePresence> {/* For the arrows */}
                        {displayMode === 'normal' && showLeftArrowEpisodes && (
                            <motion.div // Animate the left arrow
                                className="arrow left-arrow"
                                onClick={scrollLeftep}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <i className="bx bx-left-arrow-alt" style={{ fontSize: "2rem" }}></i>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence> {/* For the arrows */}
                        {displayMode === 'normal' && showRightArrowEpisodes && (
                            <motion.div // Animate the right arrow
                                className="arrow right-arrow"
                                onClick={scrollRightep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <i className="bx bx-right-arrow-alt" style={{ fontSize: "2rem" }}></i>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.ul
                        className="episode_listimg"
                        ref={episodesContainerRef}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {episodes
                            .filter((episode) => new Date(episode.air_date) <= new Date())
                            .map((episode, index) => (
                                <motion.li // Animate each list item
                                    key={index}
                                    className={`episodes_itemzimg ${
                                        // ONLY ACTIVE IF IT'S THE CURRENT PLAYING EPISODE IN THE CURRENT PLAYING SEASON
                                        (currentEpisode === episode.episode_number && currentSeason === episode.season_number) ? "active" : ""
                                    } ${
                                        // ONLY WATCHED IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON
                                        (watchedEpisodes.includes(episode.episode_number))? " watchedd" : ""
                                    }`}
                                    onClick={() =>
                                        handleEpisodeClick(episode.episode_number, episode.still_path)
                                    }
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    layout
                                >
                                    <div className="hose">
                                        <AnimatePresence> {/* For play button overlay */}
                                            {/* ONLY SHOW PLAY OVERLAY IF IT'S THE CURRENT PLAYING EPISODE AND SEASON */}
                                            {(currentEpisode === episode.episode_number && currentSeason === episode.season_number) && (
                                                <motion.div
                                                    className="watchnowblur"
                                                    variants={badgeVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    <i className="bx bx-play" style={{ fontSize: "3rem" }}></i>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence> {/* For watched badge */}
                                            {/* ONLY SHOW WATCHED BADGE IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON */}
                                            {watchedEpisodes.includes(episode.episode_number) && currentSeason  === episode.season_number && (
                                                <motion.div
                                                    className="watchede-badgeimg"
                                                    variants={badgeVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    <i className="bx bx-check-double" style={{ fontSize: "3rem" }}></i>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <img
                                            className="episode_posterimg"
                                            src={apiConfig.w500Image(episode.still_path)}
                                            alt={`Episode ${episode.episode_number} poster`}
                                            style={{ borderRadius: "10px", position: "relative" }}
                                        />
                                        <p className="episode_nameabo">{episode.name}</p>
                                        <p className="episode_numberabo">Episode {episode.episode_number}</p>
                                    </div>
                                </motion.li>
                            ))}
                    </motion.ul>
                </motion.div>
            );
        } else if (episodeLayoutMode === 2) {
            // Descriptive layout: show episode number, name, etc.
            return (
                <motion.div
                    className="episode-selector descriptive-layout"
                    variants={layoutVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <motion.ul
                        className="episode_list"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {episodes
                            .filter((episode) => new Date(episode.air_date) <= new Date())
                            .map((episode, index) => (
                                <motion.li
                                    key={index}
                                    className={`episodes_itemz ${
                                        // ONLY ACTIVE IF IT'S THE CURRENT PLAYING EPISODE IN THE CURRENT PLAYING SEASON
                                        (currentEpisode === episode.episode_number && currentSeason === episode.season_number) ? "active" : ""
                                    } ${
                                        // ONLY WATCHED IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON
                                        (watchedEpisodes.includes(episode.episode_number) && currentSeason === episode.season_number) ? " watchedd" : ""
                                    }`}
                                    onClick={() =>
                                        handleEpisodeClick(episode.episode_number, episode.still_path)
                                    }
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    layout
                                >
                                    <div className="holderlay2" style={{ position: "relative" }}>
                                        <img className="episode_posterblur" src={apiConfig.w200Image(episode.still_path)} alt="" />
                                        <img
                                            className="episode_posterabos"
                                            src={apiConfig.w500Image(episode.still_path)}
                                            alt=""
                                            style={{ borderRadius: "10px 0 0 10px", position: "relative" }}
                                        />
                                        <div className="episode_info">
                                            <strong className="episode_numberabo">Episode {episode.episode_number}</strong>
                                            <p className="episode_nameaboz">{episode.name}</p>
                                            <p className="episode_overviewabo">{episode.overview}</p>
                                        </div>
                                        <AnimatePresence> {/* For play button overlay */}
                                            {/* ONLY SHOW PLAY OVERLAY IF IT'S THE CURRENT PLAYING EPISODE AND SEASON */}
                                            {(currentEpisode === episode.episode_number && currentSeason === episode.season_number) && (
                                                <motion.div
                                                    className="watchnow left"
                                                    variants={badgeVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    <i className="bx bx-play" style={{ fontSize: "3rem" }}></i>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <AnimatePresence> {/* For watched badge */}
                                            {/* ONLY SHOW WATCHED BADGE IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON */}
                                            {watchedEpisodes.includes(episode.episode_number) && currentSeason === episode.season_number && (
                                                <motion.div
                                                    className="watchede-badgek"
                                                    variants={badgeVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    <i className="bx bx-check-double" style={{ fontSize: "3rem", color: "white" }}></i>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.li>
                            ))}
                    </motion.ul>
                </motion.div>
            );
        } else {
            // Default layout: original layout with backdrop episode image
            return (
                <motion.div
                    className="episode-selector current-layout"
                    style={{
                        backgroundImage: `url(${bgChanged})`,
                        backgroundSize: "cover",
                    }}
                    variants={layoutVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <motion.ul
                        className="episode_list"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {episodes
                            .filter((episode) => new Date(episode.air_date) <= new Date())
                            .map((episode, index) => (
                                <motion.li
                                    key={index}
                                    className={`episodez_itemz ${ // Assuming this is correct from your original code. If it was 'episodez_itemz', revert.
                                        // ONLY ACTIVE IF IT'S THE CURRENT PLAYING EPISODE IN THE CURRENT PLAYING SEASON
                                        (currentEpisode === episode.episode_number && currentSeason === episode.season_number) ? "active" : ""
                                    } ${
                                        // ONLY WATCHED IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON
                                        (watchedEpisodes.includes(episode.episode_number) && previewSeason === episode.season_number) ? " watchedd" : ""
                                    }`}
                                    onClick={() =>
                                        handleEpisodeClick(episode.episode_number, episode.still_path)
                                    }
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    layout
                                >
                                    {/* ONLY SHOW WATCHED IMAGE OVERLAY IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON */}
                                    {watchedEpisodes.includes(episode.episode_number) && currentSeason === episode.season_number && (
                                        <AnimatePresence>
                                            <motion.div
                                                className="imdsdi"
                                                variants={badgeVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <img
                                                    style={{
                                                        borderRadius: "0px 10px 10px 0px",
                                                        width: "100%",
                                                        height: "90%",
                                                        objectFit: "cover",
                                                    }}
                                                    className="episode-posterue"
                                                    src={apiConfig.w200Image(episode.still_path)}
                                                    alt={`Episode ${episode.episode_number} poster`}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                    E{episode.episode_number} <div className="s"></div>
                                    {episode.name}
                                    <AnimatePresence> {/* For play button */}
                                        {/* ONLY SHOW PLAY OVERLAY IF IT'S THE CURRENT PLAYING EPISODE AND SEASON */}
                                        {(currentEpisode === episode.episode_number && currentSeason === episode.season_number) && (
                                            <motion.div
                                                className="watchnow"
                                                variants={badgeVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <i className="bx bx-play"></i>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <AnimatePresence> {/* For watched badge */}
                                        {/* ONLY SHOW WATCHED BADGE IF IT'S IN THE WATCHED LIST AND BELONGS TO THE PREVIEWED SEASON */}
                                        {watchedEpisodes.includes(episode.episode_number) && currentSeason === episode.season_number && (
                                            <motion.div
                                                className="watchede-badge2"
                                                variants={badgeVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <i className="bx bx-check-double"></i>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            ))}
                    </motion.ul>
                </motion.div>
            );
        }
    };

   const handleIframeLoad = () => {
    setLoading(false);
  };

  // -------------------------------
  // RENDERING THE COMPONENTS
  // -------------------------------
  return (
    <ErrorBoundary>
      <>
        <ToastContainer
          toastClassName="blurred-toast"
          bodyClassName="toast-body"
          theme="dark"
          //fontSize="11px"
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          
          closeOnClick={true}
          //rtl={false}
         
          draggable={false}
          pauseOnHover={true}
          icon={false}
        />
      <div className="abocont">
        {/* Persistent iframe container (always rendered) */}
        <div className={`persistent-iframe-container ${displayMode}`}>
          {Loading ? (
         <div className="loading">
    <img src={logo} alt="MOVIEPLUTO" className="loading-pulse" />
  </div>
 ) : season_number && episode_number ? (
            <iframe
              //key={iframeUrl} // constant key to avoid remounts
              className="episodes__iframe"
              id="my_iframe"
              src={handleIframeSrc()}
              //style={{ borderRadius : "10px" }}
              width={displayMode === "youtube" ? "100%" : "100%"}
              height={displayMode === "youtube" ? "100%" : "100%"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          ) : (
            <iframe
              //key={iframesrc}
              src={handlemovieIframeSrc()}
             // style={{ borderRadius : "15px" }}
             id="my_iframe"
              className="episodes__iframe"
              width={displayMode === "youtube" ? "100%" : "100%"}
              height={displayMode === "youtube" ? "100%" : "100%"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              allowFullScreen
              referrerPolicy="origin"
              onLoad={() => handleIframeLoad()}
              onError={handleIframeError}
            />
          )}
        </div>
  
        {displayMode === "youtube" ? (
          // YouTube Mode UI overlays – these elements wrap around (or appear in addition to) the persistent iframe.
          <div
            className="youtube-mode-layout"
            style={{
             // backgroundImage: `url(${bgChanged})`,
              backgroundSize: "cover",
            }}
          >
            <div
              className="blurimgback"
              style={{
                backgroundImage: `url(${apiConfig.w200Image(
                  itemData.backdrop_path
                )})`,
              }}
            />
  
            <div className="youtube-player">
              
              <div className="zsa">
              <div className="hevdo">
  {currentEpisode < totalEpisodes ? (
    // NEXT EPISODE in current committed season
    (() => {
      const nextEpisode = episodes.find(
        (ep) => ep.episode_number === currentEpisode + 1
      );

      return nextEpisode ? (
        <div
          className="rearo"
          onClick={() => handleQuickEpisodeClickNext(currentEpisode + 1)}
        >
          <img
            className="rearoimg"
            src={apiConfig.w200Image(nextEpisode.still_path)}
            alt=""
          />
          NEXT UP : EP {currentEpisode + 1}
          <i className="bx bx-right-arrow"></i>
        </div>
      ) : null;
    })()
  ) : totalseasons > 1 && currentSeason < totalseasons ? (
    // NEXT SEASON START — still based on current committed season
    (() => {
      const nextSeason = seasons.find(
        (s) => s.season_number === currentSeason + 1
      );

      return nextSeason ? (
        <div
          className="rearo"
          onClick={() => {
            // Do not commit season yet — just preview/fetch episodes
            handleQuickSeasonClickNext(currentSeason + 1);
          }}
        >
          <img
            className="rearoimg"
            src={apiConfig.w200Image(nextSeason.poster_path)}
            alt=""
          />
          NEXT UP : SN {currentSeason + 1} EP 1
          <i className="bx bx-right-arrow"></i>
        </div>
      ) : null;
    })()
  ) : null}
</div>

                <div className="haxnoititle">
                     Currently Watching:
                </div>
                 <div className="haxnoiholder">
                 
                <div className="hanoxi">{itemData.title || itemData.name}</div>
                {
                  category === "tv" && (
                    <div className="haxnoiep">
                      SN {currentSeason} EP {currentEpisode}
                    </div>
                  )
                }
                {
                  category === "movie" && (
                    <div className="haxnoiep">
                     {itemData.release_date ? new Date(itemData.release_date).getFullYear() : null}
                    </div>
                  )
                }
               
              </div>
              <div className="sertop">
                <div className="layout-toggles">
                  {category === "tv" && (
                    <button onClick={toggleEpisodeLayout}>
                      {episodeLayoutMode === 1 ? (
                        <i className="bx bx-image"></i>
                      ) : episodeLayoutMode === 2 ? (
                        <i className="bx bxs-grid"></i>
                      ) : (
                        <i className="bx bx-list-ul"></i>
                      )}
                    </button>
                  )}
                  <button onClick={toggleDisplayMode}>
                    {displayMode === "youtube" ? (
                      <i className="bx bx-grid-vertical"></i>
                    ) : (
                      <i className="bx bx-grid-horizontal"></i>
                    )}{" "}
                    {displayMode === "youtube" ? "YT Layout" : "CINEMA Layout"}
                  </button>
                </div>
  
                <div className="logozz" onClick={() => navigate("/")}>
                  <img src={logo} alt="ZillaXR" />
                  
                </div>
                <div className="menu">
                  <div className="navih" onClick={handleHome}>
                    <i className="bx bx-home-alt-2"></i>
                  </div>
                  <div className="navi" onClick={handleBack}>
                    <i className="bx bx-arrow-back"></i>
                  </div>
                </div>
  
                <div className="watchlyst">
                  {saved ? (
                    <div
                      className="languagezz"
                      onClick={handleRemoveFromWatchlist}
                    >
                      <i
                        className="bx bxs-add-to-queue"
                        style={{ fontSize: "17px" }}
                      ></i>
                    </div>
                  ) : (
                    <div className="languagez" onClick={saveShow}>
                      <i
                        className="bx bx-add-to-queue"
                        style={{ fontSize: "17px" }}
                      ></i>
                    </div>
                  )}
                  <div className="languagez">|</div>
                  {like ? (
                    <div
                      className="languagezz"
                      onClick={handleRemoveFromFavourites}
                    >
                      <i
                        className="bx bxs-heart"
                        style={{ fontSize: "17px" }}
                      ></i>
                    </div>
                  ) : (
                    <div className="languagez" onClick={AddfavShow}>
                      <i className="bx bx-heart" style={{ fontSize: "17px" }}></i>
                    </div>
                  )}
                </div>
              </div>
  
              {category === "tv" && (
                <div className="recommendations">
                  <h3 className="recoheadtube">
                    More like {itemData.title || itemData.name}
                  </h3>
                  <div className="recoholder">
                  {Array.isArray(reco) &&
                    reco.map((recoc) => (
                      <div
                        className="dd"
                        key={recoc.id}
                        
                      >
                        <MovieCard category={category} item={recoc} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
               {category === "movie" && (
                <div className="recommendations">
                  <h3 className="recoheadtube">
                    More like {itemData.title || itemData.name}
                  </h3>
                  <div className="recoholder">
                  {Array.isArray(reco) &&
                    reco.map((recoc) => (
                      <div
                        className="dd"
                        key={recoc.id}
                        
                      >
                        <MovieCard category={category} item={recoc} />
                      
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
             
            </div>
  
            <div className="youtube-sidebar">
              
              <div className="servers">
                <Select
                  className="selectco"
                  value={selectedOption}
                  options={options}
                  onChange={handleSelect}
                  classNames={{
                    menu: () => 'custom-select-menu',
                    option: () => 'custom-select-option',
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: "#ffffff2a",
                      primary: "#ffffff1a",
                      neutral0: "#00000e2",
                      neutral5: "grey",
                      neutral10: "#38383879",
                      neutral20: "#ffffff5a",
                      neutral30: "red",
                      neutral40: "red",
                      neutral50: "#a9a9a9",
                      neutral60: "red",
                      neutral70: "#696969",
                      neutral80: "#ffffff5a",
                      neutral90: "#303030",
                    },
                  })}
                />
              </div>
              {category === "tv" && (
                <>
                  <div className="seasons-container" style={{position:"relative"}}>
                    <div className="seasons__content" ref={seasonsContainerRef}>
                      {seasons &&
                        seasons
                          .filter((item) => item.season_number !== 0)
                          .map((item, i) => (
                            <div
                              className="seasons__list"
                              key={i}
                              onClick={() => handleSeasonClick(item.season_number)}
                            >
                              <div
                                className={`seas ${
                                  item.season_number === currentSeason || item.season_number === previewSeason ? "actively" : ""
                                }`}
                              >
                                <h4 className="seasons__name">
                                  SN {item.season_number}
                                </h4>
                              </div>
                            </div>
                          ))}
                    </div>
                    <div className="butaboss">
                      {showLeftArrow && (
                        <button className="leftpal" onClick={scrollLeft}>
                          <i className="bx bx-chevron-left"></i>
                        </button>
                      )}
                      {showRightArrow && (
                        <button className="rightpal" onClick={scrollRight}>
                          <i className="bx bx-chevron-right"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  {renderEpisodes()}
                </>
              )}
              {category === "movie" && (
      
                collection && (
                 <div className="recommendationsfull">
                  <div className="collectionholder"> 
                    <h3 className="recoheadq">Collections </h3>
                 
                    {
                      collection.parts && collection.parts.map((collection) => (
                        <div className="collimg">
                          <img src={apiConfig.w1280Image(collection.backdrop_path)} alt={collection.name} />
                          <div className="collname">{collection.title} | {collection.release_date.split('-')[0]}</div>
                        </div>    
                     ))}
                  </div>
                </div>
              )
            
              )}
             
            </div>
          </div>
        ) : (
          // Normal Mode Layout – again, the persistent iframe remains above
          <>
            <div
              className="blurimgback"
              style={{
                backgroundImage: `url(${apiConfig.w200Image(
                  itemData.backdrop_path
                )})`,
              }}
            ></div>
            <div className="player-container">{/* iframe is persistent above */}</div>
            <div className="sertop">
              <div className="logozz" onClick={() => navigate("/")}>
                <img src={logo} alt="MOVIEPLUTO"/>
                
              </div>
              <div className="menu">
                <div className="navih" onClick={handleHome}>
                  <i className="bx bx-home-alt-2"></i>
                </div>
                <div className="navi" onClick={handleBack}>
                  <i className="bx bx-arrow-back"></i>
                </div>
              </div>
              {currentEpisode < totalEpisodes ? (
                <div
                  className="rea"
                  onClick={() => handleQuickEpisodeClickNext(parseInt(currentEpisode) + 1)}
                >
                  <img
                    className="reaimg"
                    src={apiConfig.w200Image(
                      episodes.find(
                        (episode) =>
                          episode.episode_number ===
                          parseInt(currentEpisode) + 1
                      ).still_path
                    )}
                    alt=""
                  />
                  NEXT UP : EP {parseInt(currentEpisode) + 1}{" "}
                  <i className="bx bx-right-arrow"></i>
                </div>
              ) : totalseasons > 1 && currentSeason < totalseasons ? (
                <div
                  className="rea"
                  onClick={() => handleQuickSeasonClickNext(parseInt(currentSeason) + 1)}
                >
                  <img
                    className="reaimg"
                    src={apiConfig.w200Image(
                      seasons[parseInt(currentSeason)].poster_path
                    )}
                    alt=""
                  />
                  NEXT UP : SN {parseInt(currentSeason) + 1} EP 1{" "}
                  <i className="bx bx-right-arrow"></i>
                </div>
              ) : null}
              <div className="watchlyst">
                {saved ? (
                  <div
                    className="languagezz"
                    onClick={handleRemoveFromWatchlist}
                  >
                    <i
                      className="bx bxs-add-to-queue"
                      style={{ fontSize: "17px" }}
                    ></i>
                  </div>
                ) : (
                  <div className="languagez" onClick={saveShow}>
                    <i
                      className="bx bx-add-to-queue"
                      style={{ fontSize: "17px" }}
                    ></i>
                  </div>
                )}
                <div className="languagez">|</div>
                {like ? (
                  <div
                    className="languagezz"
                    onClick={handleRemoveFromFavourites}
                  >
                    <i
                      className="bx bxs-heart"
                      style={{ fontSize: "17px" }}
                    ></i>
                  </div>
                ) : (
                  <div className="languagez" onClick={AddfavShow}>
                    <i className="bx bx-heart" style={{ fontSize: "17px" }}></i>
                  </div>
                )}
              </div>
            </div>
            <div className="servers">
              <div className="layout-toggles">
                {category === "tv" && (
                  <button onClick={toggleEpisodeLayout}>
                    {episodeLayoutMode === 1 ? (
                      <i className="bx bx-image"></i>
                    ) : episodeLayoutMode === 2 ? (
                      <i className="bx bxs-grid"></i>
                    ) : (
                      <i className="bx bx-list-ul"></i>
                    )}
                  </button>
                )}
                <button className="layout-toggle" onClick={toggleDisplayMode}>
                  {displayMode === "youtube" ? (
                    <i className="bx bx-grid-vertical"></i>
                  ) : (
                    <i className="bx bx-grid-horizontal"></i>
                  )}{" "}
                  {displayMode === "youtube" ? "YT Layout" : "CINEMA Layout"}
                </button>
              </div>
              <Select
                className="selectco"
                value={selectedOption}
                options={options}
                classNames={{
                  menu: () => 'custom-select-menu',
                  option: () => 'custom-select-option',
                }}
                onChange={handleSelect}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 10,
                  colors: {
                    ...theme.colors,
                    primary25: "#ffffff2a",
                    primary: "#ffffff1a",
                    neutral0: "#00000a2",
                    neutral5: "grey",
                    neutral10: "#38383879",
                    neutral20: "#ffffff5a",
                    neutral30: "red",
                    neutral40: "red",
                    neutral50: "#a9a9a9",
                    neutral60: "red",
                    neutral70: "#696969",
                    neutral80: "#ffffff5a",
                    neutral90: "#303030",
                  },
                })}
              />
            </div>
            {category === "tv" && (
              <>
                <div className="seasons-container">
                  <div className="seasons__content" ref={seasonsContainerRef}>
                    {seasons &&
                      seasons
                        .filter((item) => item.season_number !== 0)
                        .map((item, i) => (
                          <div
                            className="seasons__list"
                            key={i}
                            onClick={() => handleSeasonClick(item.season_number)}
                          >
                            <div
                              className={`seas ${
                                item.season_number == currentSeason || item.season_number == previewSeason ? "actively" : ""
                              }`}
                            >
                              <h4 className="seasons__name">
                                SN-{item.season_number}
                              </h4>
                            </div>
                          </div>
                        ))}
                  </div>
                  <div className="butaboss">
                    {showLeftArrow && (
                      <button
                        className="scroll-arrow left"
                        onClick={scrollLeft}
                      >
                        {"<"}
                      </button>
                    )}
                    {showRightArrow && (
                      <button
                        className="scroll-arrow right"
                        onClick={scrollRight}
                      >
                        {">"}
                      </button>
                    )}
                  </div>
                </div>
                {renderEpisodes()}
              </>
            )}
            {
              collection && collection.parts && (
                <div className="recommendationsfull">
                  <h3 className="recohead">Collections </h3>
                  <div className="recoholderfull">
                    {
                      collection.parts && collection.parts.map((collection) => (
                          <MovieCard category={category} item={collection} />
                        
                     ))}
                  </div>
                </div>
              )
            }
            {reco && (
              <div className="recommendationsfull">
                <h3 className="recohead">
                  More like {itemData.title || itemData.name}
                </h3>
                <div className="recoholderfull">
                   {Array.isArray(reco) &&
                    reco.map((recoc) => (
                        <MovieCard category={category} item={recoc} />
                     
                       ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
        
      </>
    </ErrorBoundary>
  );
  
}

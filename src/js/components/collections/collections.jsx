import React, { useEffect, useState } from "react";
import "./collection.scss";
import apiConfig from "../../api/apiConfig";
import MovieCard from "../movie-card/MovieCard";
import TrueFocus from "../reactbits/TrueFocus";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const API_KEY = apiConfig.apiKey;
const API_URL = "https://api.themoviedb.org/3/collection/";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const COLLECTIONS_FILE_PATH = "/collectionIds/collection_ids_05_29_2025.json";
const PAGE_SIZE = 30;

const Collection = () => {

  document.title = "Collections | Movie Collection";
  const [collectionMeta, setCollectionMeta] = useState([]);
  const [filteredMeta, setFilteredMeta] = useState([]);
  const [randomPreviewList, setRandomPreviewList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState(null);
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

  const navigate = useNavigate();

  const isNsfw = (text) => {
    const nsfwWords = ["erotic", "sex", "porn", "xxx", "nude", "hentai", "bdsm"];
    return nsfwWords.some((word) => text?.toLowerCase().includes(word));
  };

  const loadCollectionIds = async () => {
    try {
      const text = await fetch(COLLECTIONS_FILE_PATH).then((res) => res.text());
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setCollectionMeta(parsed);
        const shuffled = [...parsed].sort(() => 0.5 - Math.random());
        setFilteredMeta(shuffled);
        setRandomPreviewList(shuffled.slice(0, 30));
      } else {
        console.error("Expected array in collection file");
      }
    } catch (err) {
      console.error("Failed to parse collection IDs:", err);
    }
  };

  useEffect(() => {
    loadCollectionIds();
    window.scrollTo({
            top: 0,
            behavior: 'smooth'
  });
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      if (filteredMeta.length === 0) return;
      setLoading(true);
      const subset = filteredMeta.slice(0, visibleCount);

      try {
        const data = await Promise.all(
          subset.map((entry) =>
            fetch(`${API_URL}${entry.id}?api_key=${API_KEY}`).then((res) => res.json())
          )
        );

        const cleaned = data.filter(
          (col) =>
            col.parts?.length > 0 &&
            col.parts.every((movie) => movie && movie.adult === false && !isNsfw(movie.title)) &&
            !isNsfw(col.name) &&
            (col.backdrop_path || col.poster_path)
        );

        setCollections(cleaned);
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [filteredMeta, visibleCount]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredMeta(collectionMeta);
    } else {
      const filtered = collectionMeta.filter((c) =>
        c.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMeta(filtered);
    }
    setVisibleCount(PAGE_SIZE);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 100);
  };

 if (loading && collections.length === 0) {
  return (
    <motion.div
      className="collectionloading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <TrueFocus
        sentence="Collections MoviePluto"
        manualMode={false}
        blurAmount={4}
        borderColor="aqua"
        animationDuration={0.7}
        pauseBetweenAnimations={1}
      />
    </motion.div>
  );
}

return (
  <motion.div
    className="collection-container"
    variants={staggerContainer}
    //initial="hidden"
   animate="visible"
    initial={{ opacity: 0 }}
  //animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  >
    <motion.div className="stickytop" variants={fadeInUp}>
      <TrueFocus
        sentence="Explore Collections"
        manualMode={true}
        blurAmount={4}
        borderColor="white"
        animationDuration={0.7}
        pauseBetweenAnimations={1}
      />
    </motion.div>

    <motion.div className="collection-toolbar" variants={fadeInUp}>
      <input
        type="text"
        className="collection-search"
        placeholder="Search collections..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="collection-total">
        {collectionMeta.length} collections
      </div>
    </motion.div>

    <motion.div className="collection-name-bar" variants={fadeInUp}>
      {randomPreviewList.map((col, i) => (
        <motion.button
          key={col.id}
          className={`collection-name-btn ${activePreviewId === col.id ? "activecollection" : ""}`}
          onClick={() => {
            setFilteredMeta([col]);
            setVisibleCount(1);
            setSearchTerm(col.name);
            setActivePreviewId(col.id);
          }}
          variants={fadeInUp}
          custom={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {col.name}
        </motion.button>
      ))}
    </motion.div>

    {collections.map((collection, i) => (
      <motion.div className="collection" key={collection.id} variants={fadeInUp} custom={i}>
        <motion.div
          className="collectionbackblur"
          style={{
            backgroundImage: `url(${IMAGE_BASE}${collection.backdrop_path || collection.poster_path})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h2 className="collection-title" variants={fadeInUp}>
          {collection.name}
        </motion.h2>

        <motion.div className="colebar" variants={fadeInUp}>
          <div className="collection-count">{collection.parts?.length} Movies</div>
          <div>-</div>
          {collection.parts?.[0] && (
            <motion.button
              className="collection-name"
              onClick={() =>
                navigate(
                  `/watch/${encodeURIComponent(
                    collection.parts[0].title.toLowerCase().replace(/\s+/g, "-")
                  )}/${collection.parts[0].id}`
                )
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶ Watch
            </motion.button>
          )}
        </motion.div>

        <motion.div className="movies-grid" variants={fadeInUp}>
          {collection.parts?.map((movie, j) => (
            <motion.div key={movie.id} variants={fadeInUp} custom={j}>
              <MovieCard category="movie" item={movie} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="overviewcoll" variants={fadeInUp}>
          {collection.overview}
        </motion.div>
      </motion.div>
    ))}

    {visibleCount < filteredMeta.length && (
      <motion.button
        className="load-more-btn"
        onClick={loadMore}
        disabled={loadingMore}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={fadeInUp}
      >
        {loadingMore ? "Loading..." : "Load More"}
      </motion.button>
    )}
  </motion.div>
);
};

export default Collection;

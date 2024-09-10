import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";
import "./movie-list.scss";
import tmdbApi, { category } from "../../api/tmdbApi";

const MovieCard = React.lazy(() => import("../movie-card/MovieCard"));

const MovieList = (props) => {
  const [items, setItems] = useState([]);
  const [listWidth, setListWidth] = useState(0);
  const listRef = useRef(null);

  const getList = async () => {
    let response = null;
    const params = {};
    switch (props.category) {
      case category.movie:
        response = await tmdbApi.getMoviesList(props.type, { params });
        break;
      default:
        response = await tmdbApi.getTvList(props.type, { params });
    }
    setItems(response.results);
  };

  useEffect(() => {
    getList();
  }, [props.category, props.type]);

  const renderRow = ({ index, style }) => {
    return (
      <div style={style}>
        <MovieCard item={items[index]} category={props.category} />
      </div>
    );
  };

  useEffect(() => {
    const vpWidth = window.innerWidth;
    const newListWidth = vpWidth - 20; // Subtract 20px for padding
    setListWidth(newListWidth);
  }, []);

  const smoothScroll = (targetOffset) => {
    const startOffset = listRef.current.state.scrollOffset;
    const distance = targetOffset - startOffset;
    const duration = 500; // Duration in milliseconds
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Progress: 0 to 1

      const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease function
      const scrollOffset = startOffset + distance * easeInOutQuad(progress);

      listRef.current.scrollTo(scrollOffset);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleScrollLeft = () => {
    const currentOffset = listRef.current.state.scrollOffset;
    smoothScroll(currentOffset - 200); // Adjust the scroll distance as needed
  };

  const handleScrollRight = () => {
    const currentOffset = listRef.current.state.scrollOffset;
    smoothScroll(currentOffset + 200); // Adjust the scroll distance as needed
  };

  return (
    <div className="movie-list">
        <div className="alignerbutts">
       <button  className="left" onClick={handleScrollLeft}><i className='bx bxs-left-arrow'></i></button>
      <button className="right" onClick={handleScrollRight}><i className='bx bxs-right-arrow'></i></button>
        </div>
     
      <FixedSizeList
        ref={listRef}
        className="list"
        height={450}
        width={listWidth}
        itemSize={270}
        layout="horizontal"
        itemCount={items.length}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
};

MovieList.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MovieList;

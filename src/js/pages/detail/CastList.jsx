import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import './detail.scss';

const MAX_CASTS = 15;

const CastList = ({ id }) => {
  const { category } = useParams();
  const [casts, setCast] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await tmdbApi.credits(category, id);
        setCast(res.cast.slice(0, MAX_CASTS));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCredits();
  }, [category, id]);

  return (
    <div className="casts">
      {casts &&
        casts.map((item, i) =>
          item.profile_path ? (
            <div key={i} className="casts__item">
              <img
                className="casts__item__img"
                loading="lazy"
                src={apiConfig.w200Image(item.profile_path)}
                alt={item.name}
              />
              <div className="aligners">
                <h6 className="casts__item__name">{item.name}</h6>
                <h6 className="casts__item__char">as {item.character}</h6>
              </div>
            </div>
          ) : null
        )}
    </div>
  );
};

export default CastList;

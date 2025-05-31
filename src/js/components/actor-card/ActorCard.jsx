// src/components/actor-card/ActorCard.jsx

import { motion } from 'framer-motion';
import apiConfig from '../../api/apiConfig';
import './actorcard.scss'; // Create this SCSS file

const ActorCard = ({ actor, onClick }) => {
    const profilePath = actor.profile_path ? apiConfig.w500Image(actor.profile_path) : 'https://via.placeholder.com/185x278?text=No+Image'; // Placeholder for missing image

    return (
        <motion.div
            className="actor-card"
            onClick={() => onClick(actor.id, actor.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        > 
        <h1>hello</h1>
            <div className="actor-card__image" style={{ backgroundImage: `url(${profilePath})` }}></div>
            <div className="actor-card__info">
                <h3>{actor.name}</h3>
                {actor.known_for_department && <p>{actor.known_for_department}</p>}
                {/* You can add known for titles if desired */}
                {/* {actor.known_for && actor.known_for.length > 0 && (
                    <p>Known for: {actor.known_for.map(item => item.title || item.name).join(', ')}</p>
                )} */}
            </div>
        </motion.div>
    );
};

export default ActorCard;

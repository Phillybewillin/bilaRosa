import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPage = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: "100vw" // Starts off-screen to the right
    },
    animate: {
      opacity: 1,
      x: 0 // Slides into view
    },
    exit: {
      opacity: 0,
      x: "-100vw" // Slides off-screen to the left
    }
  };

  const pageTransition = {
    type: "tween", // Smooth transition
    ease: "easeOut",
    duration: 0.4
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      // Essential for preventing layout shifts during exit animation
      // Make sure the parent container has position: relative and overflow: hidden
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;

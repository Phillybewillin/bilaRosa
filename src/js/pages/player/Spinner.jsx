import React from 'react';
import './spinner.css';

const Spinner = () => {
  return (
    <div className="spinner">
      {Array(5).fill().map((_, index) => (
        <div
          key={index}
          className="circle"
          style={{
            backgroundColor: [
              
              '#3700ff',
              '#ffe6cc',
              '#8bc34a',
              '#03a9f4',
              '#ff0080',
            ][index],
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Spinner;

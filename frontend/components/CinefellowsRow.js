// CinefellowsRow.js
import React from 'react';
import styles from '../styles/cinefellowsRow.module.css'; // Assume you have a CSS module for this component

const CinefellowsRow = ({ cinefellows }) => {
  return (
    <div className="flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-3 md:p-2">
      {cinefellows.map((cinefellow) => (
        <img
          key={cinefellow.id}
          src={cinefellow.image_url} // The URL to the cinefellow's profile photo
          alt={`Profile of ${cinefellow.full_name}`}
          className={styles.profilePhoto}
        />
      ))}
    </div>
  );
};

export default CinefellowsRow;

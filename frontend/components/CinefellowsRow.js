// CinefellowsRow.js
import React from 'react';
import styles from '../styles/cinefellowsRow.module.css'; // Assume you have a CSS module for this component
import Link from 'next/link'; // Import Link from Next.js

const CinefellowsRow = ({ cinefellows }) => {
  return (
    <div className={styles.cinefellowsContainer}>
      {cinefellows.map((cinefellow) => (
        <div key={cinefellow.id} className={styles.cinefellowItem}>
          <Link href={`/profile/${cinefellow.username}`} className={styles.cinefellowLink}>
              <img
                src={cinefellow.image_url} // The URL to the cinefellow's profile photo
                alt={`Profile of ${cinefellow.full_name}`}
                className={styles.profilePhoto}
              />
              <div className={styles.cinefellowName}>{cinefellow.full_name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CinefellowsRow;

/*
import React from 'react';
import styles from '../styles/cinefellowsRow.module.css'; // Assume you have a CSS module for this component
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const CinefellowsRow = ({ cinefellows }) => {
  return (
    <div className={styles.cinefellowsContainer}>
      {cinefellows.map((cinefellow) => (
        <div key={cinefellow.id} className={styles.cinefellowItem}>
          <Link to={`/profile/${cinefellow.username}`} className={styles.cinefellowLink}>
            <img
              src={cinefellow.image_url} // The URL to the cinefellow's profile photo
              alt={`Profile of ${cinefellow.full_name}`}
              className={styles.profilePhoto}
            />
            <div className={styles.cinefellowName}>{cinefellow.full_name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CinefellowsRow;

*/
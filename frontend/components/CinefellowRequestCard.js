// CinefellowRequestCard.js
import React from 'react';
import styles from '../styles/cinefellowRequestCard.module.css';

// Import buttons from cinefellowRequestButtons.js
import { AcceptCinefellowRequestButton, DeclineCinefellowRequestButton } from '@components/cinefellowRequestButtons'; 

const CinefellowRequestCard = ({ requestorPhoto, requestorUsername, commonForumsCount, onAccept, onReject }) => {
  return (
    <div className={styles.card}>
      <div className={styles.requestorInfo}>
        <img src={requestorPhoto} alt={`${requestorUsername}'s profile`} className={styles.profilePhoto} />
        <div className={styles.userInfo}>
          <div className={styles.username}>{requestorUsername}</div>
          <div className={styles.commonForums}>Common Forums: {commonForumsCount}</div>
        </div>
      </div>
      <div className={styles.actions}>
        <AcceptCinefellowRequestButton onClick={onAccept} />
        <DeclineCinefellowRequestButton onClick={onReject} />
      </div>
    </div>
  );
};

export default CinefellowRequestCard;

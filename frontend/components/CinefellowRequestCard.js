// CinefellowRequestCard.js
import React from 'react';
import styles from '../styles/cinefellowRequestCard.module.css';

// Import buttons from cinefellowRequestButtons.js
import { AcceptCinefellowRequestButton, DeclineCinefellowRequestButton } from '@components/cinefellowRequestButtons'; 

const CinefellowRequestCard = ({ requestorPhoto, requestedAt, requestorUsername, onAccept, onReject, status }) => {
  let commonForumsCount = 19; // To be dynamically fetched - commonForumsCount 
  return (
    <div className={styles.card}>
      <div className={styles.requestorInfo}>
        <img src={requestorPhoto} alt={`${requestorUsername}'s profile`} className={styles.profilePhoto} />
        <div className={styles.userInfo}>
          <div className={styles.username}>{requestorUsername}</div>
          <div className={styles.commonForums}>Common Forums: {commonForumsCount}</div>
          <div className={styles.requestedAt}>{requestedAt}</div>
        </div>
      </div>
      <div className={styles.actions}>
        {status === 'pending' ? (
          <>
            <AcceptCinefellowRequestButton onClick={onAccept} />
            <DeclineCinefellowRequestButton onClick={onReject} />
          </>
        ) : status === 'accepted' ? (
          <div className={styles.acceptedMessage}>Request accepted!</div>
        ) : (
          <div className={styles.rejectedMessage}>Request rejected!</div>
        )}
      </div>
    </div>
  );
};

export default CinefellowRequestCard;

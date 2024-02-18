// profileButtons.js
import React from 'react';
import { useState } from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiEdit, BiX, BiUserPlus, BiUserMinus, BiCheck, BiUserX, BiMailSend, BiUndo, BiUserCheck } from "react-icons/bi"; // Import icons used in buttons

// EditButton component
export const EditButton = ({ onClick }) => {
    return (
      <button className={styles.editButton} onClick={onClick}>
        <BiEdit className={styles.editButtonIcon} /> {/* Example icon */}
        Edit profile
      </button>
    );
  };

// SendCinefellowRequestButton component
export const SendCinefellowRequestButton = ({ onClick }) => {
    return (
      <button className={styles.cinefellowRequestButton} onClick={onClick}>
        <BiUserPlus className={styles.cinefellowRequestIcon} size="24px" color="#FFFFFF" />
        CineFellow Request
      </button>
    );
  };


// WithdrawCinefellowRequestButton component
export const WithdrawCinefellowRequestButton = ({ onClick }) => {
    return (
      <button className={styles.withdrawCinefellowRequestButton} onClick={onClick}>
        <BiUndo className={styles.withdrawCinefellowRequestIcon} size="24px" color="#FFFFFF" />
        Withdraw Request
      </button>
    );
  };

// AcceptCinefellowRequestButton component
export const AcceptCinefellowRequestButton = ({ onClick }) => {
    return (
      <button className={styles.acceptCinefellowRequestButton} onClick={onClick}>
        <BiCheck className={styles.acceptCinefellowRequestIcon} size="24px" color="#FFFFFF" />
        Accept
      </button>
    );
  };

// DeclineCinefellowRequestButton component
export const DeclineCinefellowRequestButton = ({ onClick }) => {
    return (
      <button className={styles.declineCinefellowRequestButton} onClick={onClick}>
        <BiX className={styles.declineCinefellowRequestIcon} size="24px" color="#FFFFFF" />
        Decline
      </button>
    );
  };

// RemoveCinefellowButton component
export const RemoveCinefellowButton = ({ onClick }) => {
    const [hoverState, setHover] = useState(false);
  
    return hoverState ? (
      <button 
        className={styles.removeCinefellowButton} 
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <BiUserX className={styles.removeCinefellowIcon} size="24px" color="#FFFFFF" />
        Remove Cinefellow
      </button>
    ) : (
      <button
        className={styles.isCinefellowButton}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <BiUserCheck className={styles.isCinefellowIcon} size="24px" color="#FFFFFF" />
        Cinefellows
      </button>
    );
  };


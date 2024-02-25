// DeclineCinefellowRequestButton.js
import React from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiX } from "react-icons/bi"; // An example icon for decline

const DeclineCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.declineCinefellowRequestButton} onClick={onClick}>
      <BiX className={styles.declineCinefellowRequestIcon} size="24px" color="#FFFFFF" />
      Decline
    </button>
  );
};

export default DeclineCinefellowRequestButton;

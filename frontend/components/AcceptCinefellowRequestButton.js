// AcceptCinefellowRequestButton.js
import React from 'react';
import styles from '../styles/acceptCinefellowRequestButton.module.css'; // Adjust the path as needed
import { BiCheck } from "react-icons/bi"; // An example icon for accept

const AcceptCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.acceptCinefellowRequestButton} onClick={onClick}>
      <BiCheck className={styles.acceptCinefellowRequestIcon} size="24px" color="#FFFFFF" />
      Accept
    </button>
  );
};

export default AcceptCinefellowRequestButton;

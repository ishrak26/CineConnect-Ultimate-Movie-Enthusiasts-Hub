// SendCinefellowRequestButton.js
import React from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiMailSend } from "react-icons/bi"; // Example icon from react-icons

const SendCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.cinefellowRequestButton} onClick={onClick}>
      <BiMailSend className={styles.cinefellowRequestIcon} size="24px" color="#FFFFFF" />
      CineFellow Request
    </button>
  );
};

export default SendCinefellowRequestButton;

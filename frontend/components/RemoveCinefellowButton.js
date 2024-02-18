// RemoveCinefellowButton.js
import React from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiUserX } from "react-icons/bi"; // An example icon that might represent removing a friend/connection

const RemoveCinefellowButton = ({ onClick }) => {
  return (
    <button className={styles.removeCinefellowButton} onClick={onClick}>
      <BiUserX className={styles.removeCinefellowIcon} size="24px" color="#FFFFFF" />
      Remove CineFellow
    </button>
  );
};

export default RemoveCinefellowButton;

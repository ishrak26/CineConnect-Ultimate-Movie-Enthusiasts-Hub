// WithdrawCinefellowRequestButton.js
import React from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiUndo } from "react-icons/bi"; // An example icon that might represent withdrawing a request

const WithdrawCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.withdrawCinefellowRequestButton} onClick={onClick}>
      <BiUndo className={styles.withdrawCinefellowRequestIcon} size="24px" color="#FFFFFF" />
      Withdraw Request
    </button>
  );
};

export default WithdrawCinefellowRequestButton;

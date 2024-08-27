// cinefellowRequestButtons.js
import React from 'react'
// import { useState } from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css' // Adjust the path as needed
import { BiX, BiCheck } from 'react-icons/bi' // Import icons used in buttons

// AcceptCinefellowRequestButton component
export const AcceptCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.acceptCinefellowRequestButton} onClick={onClick}>
      <BiCheck
        className={styles.acceptCinefellowRequestIcon}
        size="24px"
        color="#FFFFFF"
      />
      Accept
    </button>
  )
}

// DeclineCinefellowRequestButton component
export const DeclineCinefellowRequestButton = ({ onClick }) => {
  return (
    <button className={styles.declineCinefellowRequestButton} onClick={onClick}>
      <BiX
        className={styles.declineCinefellowRequestIcon}
        size="24px"
        color="#FFFFFF"
      />
      Decline
    </button>
  )
}

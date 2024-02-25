// EditButton.js
import React from 'react';
import styles from '../styles/cinefellowProfileButtons.module.css'; // Adjust the path as needed
import { BiEdit } from "react-icons/bi"; // Example using react-icons library

const EditButton = ({ onClick }) => {
  return (
    <button className={styles.editButton} onClick={onClick}>
      <BiEdit className={styles.editButtonIcon} /> {/* Example icon */}
      Edit profile
    </button>
  );
};

export default EditButton;

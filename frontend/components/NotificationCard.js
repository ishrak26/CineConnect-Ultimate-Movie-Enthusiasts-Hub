// The Notification Card component
import React from 'react';
import styles from '../NotificationCard.module.css'; // Make sure the path matches your file structure

const NotificationCard = ({ userImage, message, createdAt }) => {
  return (
    <div className={styles.notificationCard}>
      <div className={styles.userImageContainer}>
        <img src={userImage} alt="User" className={styles.userImage} />
      </div>
      <div className={styles.notificationDetails}>
        <p className={styles.message}>{message}</p>
        <p className={styles.createdAt}>{new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationCard;

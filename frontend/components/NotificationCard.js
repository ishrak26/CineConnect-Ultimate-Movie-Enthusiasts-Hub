import React from 'react';
import styles from '../styles/NotificationCard.module.css'; // Adjust the path as necessary

const NotificationCard = ({ notification }) => {
  return (
    <div className={styles.card}>
      <img src={notification.imageUrl} alt="User" className={styles.userImage} />
      <div className={styles.content}>
        <p className={styles.message}>{notification.message}</p>
        <p className={styles.time}>{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationCard;

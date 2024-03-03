import React from 'react';
import styles from '../styles/NotificationCard.module.css'; // Adjust the path as necessary
import Link from 'next/link'; // Adjust the path as necessary

const NotificationCard = ({ notification }) => {
  return (
    <div className={styles.card}>
      <img src={notification.interactor.imageUrl} alt="User" className={styles.userImage} />
      <div className={styles.content}>
        {notification.type === 'incoming_req' && (
          <Link href={`/profile/${notification.interactor.username}`}>
            <p className={styles.message}>{notification.interactor.fullname} sent you a cinefellow request</p>
          </Link>
        )}
        {notification.type === 'outgoing_req' && (
          <Link href={`/profile/${notification.interactor.username}`}>
            <p className={styles.message}>{notification.interactor.fullname} accepted your cinefellow request</p>
          </Link>
        )}
        {notification.type === 'post_comment' && (
          <Link href={`/forum/${notification.movieId}/post/${notification.postId}/comments`}>
            <p className={styles.message}>{notification.interactor.fullname} commented on your post</p>
          </Link>
        )}
        {notification.type === 'post_reaction' && (
          <Link href={`/forum/${notification.movieId}/post/${notification.postId}/comments`}>
            <p className={styles.message}>{notification.interactor.fullname} reacted on your post</p>
          </Link>
        )}
        <p className={styles.time}>{new Date(notification.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationCard;

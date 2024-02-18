// ReviewCard.js
import React from 'react';
import styles from '../styles/reviewCard.module.css'; // Your CSS module with styles for the card

const ReviewCard = ({ review }) => {
  const { movieImage, movieName, rating, timestamp, content } = review;
  const [isFullReviewVisible, setFullReviewVisible] = React.useState(false);

  const toggleFullReview = () => {
    setFullReviewVisible(!isFullReviewVisible);
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.movieInfo}>
        <img src={movieImage} alt={movieName} className={styles.movieImage} />
        <div className={styles.movieDetails}>
          <h3 className={styles.movieName}>{movieName}</h3>
          <div className={styles.rating}>{rating} stars</div>
        </div>
      </div>
      <div className={styles.reviewContent}>
        <p className={styles.timestamp}>{timestamp}</p>
        <p className={isFullReviewVisible ? styles.fullReview : styles.snippetReview}>
          {content}
        </p>
        {content.length > 300 && ( // Assuming 300 is the cutoff for review length visibility
          <button onClick={toggleFullReview} className={styles.seeMoreButton}>
            {isFullReviewVisible ? 'See Less' : 'See More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;

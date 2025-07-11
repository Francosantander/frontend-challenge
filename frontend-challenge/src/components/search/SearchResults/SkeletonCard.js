import styles from './SkeletonCard.module.scss';

const SkeletonCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}>
        <div className={styles.shimmer}></div>
      </div>
      
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonTitle}>
          <div className={styles.shimmer}></div>
        </div>
        
        <div className={styles.skeletonPrice}>
          <div className={styles.shimmer}></div>
        </div>
        
        <div className={styles.skeletonInstallments}>
          <div className={styles.shimmer}></div>
        </div>
        
        <div className={styles.skeletonDetails}>
          <div className={`${styles.skeletonTag} ${styles.shimmer}`}></div>
          <div className={`${styles.skeletonTag} ${styles.shimmer}`}></div>
          <div className={`${styles.skeletonRating} ${styles.shimmer}`}></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className={styles.skeletonList}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonCard; 
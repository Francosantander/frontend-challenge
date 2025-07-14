import styles from './BackButton.module.scss';

const BackButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={styles.backButton}
      aria-label="Volver a los resultados de búsqueda"
    >
      <span className={styles.arrow}>←</span>
      <span className={styles.text}>Volver</span>
    </button>
  );
};

export default BackButton; 
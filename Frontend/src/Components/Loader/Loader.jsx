
import styles from './Loader.module.css'; 

const Loader = () => {
  return (
    <div className={styles.bubbleLoader}>
      <div className={styles.bubble}></div>
      <div className={styles.bubble}></div>
      <div className={styles.bubble}></div>
    </div>
  );
};

export default Loader;

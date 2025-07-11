"use client";

import Link from 'next/link';
import SearchBox from '@/components/search/SearchBox/SearchBox';
import styles from './Topbar.module.scss';

const Topbar = ({ onSearch }) => {

  return (
    <header className={styles.topbar} role="banner">
      <div className={styles.container}>
        <div className={styles.topbarContent}>
          <Link href="/" className={styles.logo} aria-label="Ir a página principal">
            <span className={styles.logoText}>Mercado Libre</span>
          </Link>
          <div className={styles.searchWrapper}>
            <SearchBox onSearch={onSearch} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar; 
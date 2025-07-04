"use client";

import Link from 'next/link';
import SearchBox from '@/components/search/SearchBox/SearchBox';
import styles from './Topbar.module.scss';

const Topbar = ({ onSearch }) => {
  const handleSearch = async (query) => {
    // Redirigir a página de resultados con la query
    if (onSearch) {
      await onSearch(query);
    } else {
      // Fallback: redirigir usando router
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header className={styles.topbar} role="banner">
      <div className={styles.container}>
        <div className={styles.topbarContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Ir a página principal">
            <span className={styles.logoText}>Mercado Libre</span>
          </Link>

          {/* Barra de búsqueda */}
          <div className={styles.searchWrapper}>
            <SearchBox onSearch={handleSearch} />
          </div>

          {/* Navegación secundaria (opcional para futuro) */}
          <nav className={styles.secondaryNav} aria-label="Navegación secundaria">
            <div className={styles.navPlaceholder}>
              {/* Aquí irían elementos como login, carrito, etc. */}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Topbar; 
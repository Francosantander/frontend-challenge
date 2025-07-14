"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBox.module.scss';

const SearchBox = ({ placeholder = "Buscar productos, marcas y más..." }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }

    const sanitizedQuery = query.trim().slice(0, 100);
    
    setIsLoading(true);
    
    try {
      // Navegar a la página de búsqueda con el query como parámetro
      router.push(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
    } catch (error) {
      console.error('Error en navegación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[<>]/g, '');
    setQuery(sanitizedValue);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form 
      className={styles.searchForm} 
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar productos"
    >
      <div className={styles.searchContainer}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Buscar productos, marcas y más"
          disabled={isLoading}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Limpiar búsqueda"
            disabled={isLoading}
          >
            ✕
          </button>
        )}
        
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Buscar"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <span className={styles.spinner} aria-hidden="true">⟳</span>
          ) : (
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBox; 
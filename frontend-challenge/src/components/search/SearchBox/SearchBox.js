"use client";

import { useState, useRef } from 'react';
import styles from './SearchBox.module.scss';

const SearchBox = ({ onSearch, placeholder = "Buscar productos, marcas y más..." }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }

    // Sanitización básica del input
    const sanitizedQuery = query.trim().slice(0, 100); // Limitar a 100 caracteres
    
    setIsLoading(true);
    
    try {
      await onSearch(sanitizedQuery);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Filtrar caracteres peligrosos básicos
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
          aria-label="Términos de búsqueda"
          aria-describedby="search-help"
          maxLength={100}
          autoComplete="off"
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
      
      <div id="search-help" className="sr-only">
        Ingresa términos de búsqueda y presiona Enter o haz clic en el botón buscar
      </div>
    </form>
  );
};

export default SearchBox; 
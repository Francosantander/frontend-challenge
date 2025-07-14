'use client';

import { useState } from 'react';
import styles from './ProductGallery.module.scss';

const ProductGallery = ({ images = [], title = '' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageContainer}>
          <div className={styles.placeholderImage}>
            <span>Sin imagen disponible</span>
          </div>
        </div>
      </div>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const selectedImage = images[selectedImageIndex];

  return (
    <div className={styles.galleryContainer}>
      {/* Thumbnails - Solo mostrar si hay más de una imagen */}
      {images.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {images.map((image, index) => (
            <button
              key={image.id || index}
              className={`${styles.thumbnail} ${
                index === selectedImageIndex ? styles.thumbnailActive : ''
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            >
              <img 
                src={image.url} 
                alt={`${title} - imagen ${index + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className={styles.mainImageContainer}>
        <img 
          src={selectedImage.url} 
          alt={title}
          className={styles.mainImage}
          loading="eager"
        />
        
        {/* Indicador de imagen actual */}
        {images.length > 1 && (
          <div className={styles.imageCounter}>
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery; 
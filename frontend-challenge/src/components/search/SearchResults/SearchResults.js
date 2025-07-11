import styles from './SearchResults.module.scss';
import { SkeletonList } from './SkeletonCard';

const SearchResults = ({ 
  results = [],
  isLoading = false,
  error = null,
  query = '',
  hasSearched = false
}) => {
  
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingHeader}>
          <h2>Buscando productos...</h2>
          <p>Estamos buscando los mejores productos para: <strong>{query}</strong></p>
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          <h2>Oops! Algo salió mal</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noResults}>
          <h2>No encontramos lo que buscas</h2>
          <p>No hay productos que coincidan con <strong>"{query}"</strong></p>
          <div className={styles.suggestions}>
            <h3>Te sugerimos:</h3>
            <ul>
              <li>Verificá que todas las palabras estén escritas correctamente</li>
              <li>Probá con palabras más generales o menos específicas</li>
              <li>Intentá con sinónimos o marcas relacionadas</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR').format(Math.floor(price));
  };

  return (
    <div className={styles.container}>
      <div className={styles.productList}>
        {results.map((product) => {
          return (
            <article key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  loading="lazy"
                />
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                
                <div className={styles.priceAndRating}>
                  <div className={styles.priceSection}>
                    <div className={styles.mainPrice}>
                      <span className={styles.price}>
                        $ {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    {product.installments && (
                      <div className={styles.installments}>
                        Mismo precio en {product.installments.quantity} cuotas de $ {formatPrice(product.installments.amount)}
                      </div>
                    )}
                  </div>

                  {product.reviews && product.reviews.total > 0 && (
                    <div className={styles.reviews}>
                      <div className={styles.rating}>
                        <span className={styles.ratingNumber}>
                          {product.reviews.rating_average}
                        </span>
                        <span className={styles.stars}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span 
                              key={i} 
                              className={i < Math.floor(product.reviews.rating_average) ? styles.starFilled : styles.starEmpty}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                        <span className={styles.reviewCount}>
                          ({product.reviews.total})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.productFeatures}>
                  {product.shipping?.free_shipping && (
                    <div className={styles.freeShipping}>
                      Envío gratis
                    </div>
                  )}
                  
                  {product.condition && (
                    <div className={styles.condition}>
                      {product.condition === 'new' ? 'Nuevo' : 'Usado'}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults; 
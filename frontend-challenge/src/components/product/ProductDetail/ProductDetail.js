'use client';

import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.scss';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import BackButton from './BackButton';
import useIsMobile from '../../../hooks/useIsMobile';

const ProductDetail = ({ 
  product, 
  isLoading, 
  error, 
  hasLoaded, 
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleGoBack = () => {
    router.back();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const splitPrice = (price) => {
    const [integer, decimal] = formatPrice(price).split(',');
    return { integer, decimal };
  };

  const formatCondition = (condition) => {
    return condition === 'new' ? 'Nuevo' : 'Usado';
  };

  const calculateDiscount = () => {
    if (product?.original_price && product.original_price > product.price) {
      return Math.round((1 - product.price / product.original_price) * 100);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <BackButton onClick={handleGoBack} />
        <div className={styles.loadingState}>
          <div className={styles.skeletonGallery}></div>
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonPrice}></div>
            <div className={styles.skeletonFeatures}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <BackButton onClick={handleGoBack} />
        <div className={styles.errorState} role="alert">
          <h2>Error al cargar el producto</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={handleGoBack}
          >
            Volver a la página principal
          </button>
        </div>
      </div>
    );
  }

  if (!product && hasLoaded) {
    return (
      <div className={styles.container}>
        <BackButton onClick={handleGoBack} />
        <div className={styles.notFoundState}>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = calculateDiscount();

  if (isMobile) {
    return (
      <div className={styles.container}>
        <BackButton onClick={handleGoBack} />
        
        <div className={styles.mobileLayout}>
          <div className={styles.mobileTopInfo}>
            <div className={styles.statusInfo}>
              <div className={styles.leftInfo}>
                {product.condition && (
                  <span className={styles.condition}>
                    {formatCondition(product.condition)}
                  </span>
                )}
                {product.sold_quantity && (
                  <span className={styles.soldQuantity}>
                    | +{product.sold_quantity} vendidos
                  </span>
                )}
              </div>

              {product.reviews && product.reviews.total > 0 && (
                <div className={styles.rightInfo}>
                  <span className={styles.rating}>{product.reviews.rating_average.toFixed(1)}</span>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span 
                        key={i} 
                        className={i < Math.floor(product.reviews.rating_average) ? styles.starFilled : styles.starEmpty}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.reviewCount}>
                    ({product.reviews.total})
                  </span>
                </div>
              )}
            </div>
          </div>

          <h1 className={styles.productTitle}>{product.title}</h1>

          <div className={styles.mobileGalleryWrapper}>
            <ProductGallery images={product.pictures || []} title={product.title} />
            <button className={styles.mobileFavoriteButton} aria-label="Agregar a favoritos">
              ♡
            </button>
          </div>

          {product.original_price && product.original_price > product.price && (
            <div className={styles.originalPrice}>
              $ {splitPrice(product.original_price).integer}
              <span className={styles.originalPriceDecimals}>{splitPrice(product.original_price).decimal}</span>
            </div>
          )}

          <div className={styles.priceSection}>
            {(() => {
              const { integer, decimal } = splitPrice(product.price);
              return (
                <span className={styles.currentPrice}>
                  $ {integer}
                  <span className={styles.priceDecimals}>{decimal}</span>
                </span>
              );
            })()}
            {discount && (
              <span className={styles.discountBadge}>
                {discount}% OFF
              </span>
            )}
          </div>

          {product.installments && (
            <div className={styles.installmentsInfo}>
              Mismo precio en {product.installments.quantity} cuotas de $ {splitPrice(product.installments.amount).integer}
              <span className={styles.installmentsDecimals}>{splitPrice(product.installments.amount).decimal}</span>
            </div>
          )}

          <div className={styles.mobileRestContent}>
            <ProductInfo product={product} isMobile={true} />
          </div>

          {product.description?.plain_text && (
            <div className={styles.mobileDescriptionSection}>
              <h2>Descripción</h2>
              <p>{product.description.plain_text}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BackButton onClick={handleGoBack} />
      
      <div className={styles.productDetailLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.gallerySection}>
            <ProductGallery images={product.pictures || []} title={product.title} />
          </div>
          
          <div className={styles.divider}></div>
          
          {product.description?.plain_text && (
            <div className={styles.descriptionSection}>
              <h2>Descripción</h2>
              <p>{product.description.plain_text}</p>
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.productInfoContainer}>
            <ProductInfo product={product} isMobile={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
import styles from './ProductInfo.module.scss';

const ProductInfo = ({ product, isMobile = false }) => {
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
    if (product.original_price && product.original_price > product.price) {
      return Math.round((1 - product.price / product.original_price) * 100);
    }
    return null;
  };

  const discount = calculateDiscount();

  const TopInfoSection = () => (
    <div className={styles.topSection}>
      <div className={styles.statusInfo}>
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
        {isMobile && product.reviews && product.reviews.total > 0 && (
          <>
            <span className={styles.rating}> {product.reviews.rating_average.toFixed(1)}</span>
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
          </>
        )}
      </div>
      {!isMobile && (
        <button className={styles.favoriteButton} aria-label="Agregar a favoritos">
          ♡
        </button>
      )}
    </div>
  );

  const ProductTitle = () => (
    <h1 className={styles.productTitle}>{product.title}</h1>
  );

  const ReviewsSection = () => (
    product.reviews && product.reviews.total > 0 && !isMobile && (
      <div className={styles.reviewsSection}>
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
    )
  );

  const PriceSection = () => (
    <>
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
    </>
  );

  const RestOfContent = () => (
    <>
      {!isMobile && product.installments && (
        <div className={styles.installmentsInfo}>
          Mismo precio en {product.installments.quantity} cuotas de $ {splitPrice(product.installments.amount).integer}
          <span className={styles.installmentsDecimals}>{splitPrice(product.installments.amount).decimal}</span>
        </div>
      )}

      <button className={styles.paymentMethods}>
        Ver los medios de pago
      </button>

      {product.shipping && (
        <div className={styles.shippingSection}>
          {product.shipping.free_shipping && (
            <>
              <div className={styles.freeShipping}>
                Llega gratis hoy
              </div>
              <div className={styles.shippingDetails}>
                Solo en CABA y zonas de GBA
              </div>
              <div className={styles.shippingTime}>
                Comprando dentro de las próximas <strong>5 h 27 min</strong>
              </div>
            </>
          )}
          <button className={styles.moreShippingOptions}>
            Más formas de entrega
          </button>
        </div>
      )}

      <br />

      <div className={styles.pickupSection}>
        <div className={styles.pickupInfo2}>
          <span className={styles.pickupInfo1}>Retirá gratis</span> a partir del jueves en correos y otros puntos
        </div>
        <button className={styles.viewMap}>
          Ver en el mapa
        </button>
      </div>

      {product.available_quantity !== undefined && (
        <div className={styles.stockSection}>
          <div className={styles.stockStatus}>
            Stock disponible
          </div>
          <div className={styles.quantitySelector}>
            <span>Cantidad: </span>
            <select className={styles.quantitySelect}>
              {Array.from({ length: Math.min(product.available_quantity, 10) }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'unidad' : 'unidades'}
                </option>
              ))}
            </select>
            <span className={styles.availableText}>
              ({product.available_quantity} disponibles)
            </span>
          </div>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button className={styles.buyNowButton}>
          Comprar ahora
        </button>
        <button className={styles.addToCartButton}>
          Agregar al carrito
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className={styles.productInfo}>
        <RestOfContent />
      </div>
    );
  }

  return (
    <div className={styles.productInfo}>
      <TopInfoSection />
      <ProductTitle />
      <ReviewsSection />
      <PriceSection />
      <RestOfContent />
    </div>
  );
};

export default ProductInfo; 
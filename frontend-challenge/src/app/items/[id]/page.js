'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useProductDetail from '../../../hooks/useProductDetail';
import ProductDetail from '../../../components/product/ProductDetail/ProductDetail';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, isLoading, error, hasLoaded, fetchProductDetail } = useProductDetail();

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
    }
  }, [id, fetchProductDetail]);

  return (
    <ProductDetail 
      product={product}
      isLoading={isLoading}
      error={error}
      hasLoaded={hasLoaded}
      productId={id}
    />
  );
} 
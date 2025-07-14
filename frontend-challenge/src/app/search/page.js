'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useProductSearch from '@/hooks/useProductSearch';
import SearchResults from '@/components/search/SearchResults/SearchResults';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { 
    query: currentQuery,
    results, 
    isLoading, 
    error, 
    hasSearched, 
    searchProducts 
  } = useProductSearch();

  useEffect(() => {
    if (query && query.trim()) {
      searchProducts(query);
    }
  }, [query, searchProducts]);

  return (
    <SearchResults
      results={results}
      isLoading={isLoading}
      error={error}
      query={currentQuery || query}
      hasSearched={hasSearched}
    />
  );
}

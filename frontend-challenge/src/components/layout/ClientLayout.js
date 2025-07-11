"use client";

import Topbar from './Topbar/Topbar';
import useProductSearch from '@/hooks/useProductSearch';
import SearchResults from '@/components/search/SearchResults/SearchResults';

const ClientLayout = ({ children }) => {
  const { 
    query, 
    results, 
    isLoading, 
    error, 
    hasSearched, 
    searchProducts 
  } = useProductSearch();

  return (
    <>
      <Topbar onSearch={searchProducts} />
      <main id="main-content">
        {!hasSearched ? (
          children
        ) : (
          <SearchResults
            results={results}
            isLoading={isLoading}
            error={error}
            query={query}
            hasSearched={hasSearched}
          />
        )}
      </main>
    </>
  );
};

export default ClientLayout; 
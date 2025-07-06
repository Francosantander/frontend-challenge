import { http, HttpResponse } from 'msw';
import { mockSearchResponses, mockProductDetails, simulateNetworkDelay } from './data.js';

export const handlers = [
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const limit = url.searchParams.get('limit') || '10';
    const offset = url.searchParams.get('offset') || '0';
    
    await simulateNetworkDelay();
    
    if (Math.random() < 0.05) {
      return HttpResponse.json(
        { error: 'Network error', message: 'Failed to fetch products' },
        { status: 500 }
      );
    }
    
    if (!query || query.trim() === '') {
      return HttpResponse.json(
        { error: 'Bad request', message: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    let response = mockSearchResponses[normalizedQuery];
    
    if (!response) {
      const matchingKey = Object.keys(mockSearchResponses).find(key => 
        key.includes(normalizedQuery) || normalizedQuery.includes(key)
      );
      response = matchingKey ? mockSearchResponses[matchingKey] : null;
    }
    
    if (!response) {
      return HttpResponse.json(
        { error: 'Not found', message: 'No results for this query' },
        { status: 404 }
      );
    }
    
    const responseWithQuery = {
      ...response,
      query: query,
      paging: {
        ...response.paging,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    };
    
    return HttpResponse.json(responseWithQuery);
  }),
  
  http.get('/api/items/:id', async ({ params }) => {
    const { id } = params;
    await simulateNetworkDelay(500);
    
    const productDetail = mockProductDetails[id];
  
    if (!productDetail) {
      return HttpResponse.json(
        { error: 'Not found', message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(productDetail);
  }),
];
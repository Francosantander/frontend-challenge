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
    const response = mockSearchResponses[normalizedQuery];
    
    // Si no hay respuesta específica, devolver 404
    if (!response) {
      return HttpResponse.json(
        { error: 'Not found', message: 'No results for this query' },
        { status: 404 }
      );
    }
    
    response.paging.offset = parseInt(offset);
    response.paging.limit = parseInt(limit);
    
    return HttpResponse.json(response);
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
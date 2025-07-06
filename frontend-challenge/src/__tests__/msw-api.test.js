import { server } from '../mocks/server';

describe('MSW API Mocking', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('/api/search endpoint', () => {
    it('should return search results for "iphone"', async () => {
      const response = await fetch('http://localhost:3000/api/search?q=iphone');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('iphone');
      expect(data.results).toHaveLength(3);
      expect(data.results[0].title).toContain('iPhone');
    });

    it('should handle partial searches', async () => {
      const response = await fetch('http://localhost:3000/api/search?q=ipho');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('ipho');
      expect(data.results).toHaveLength(3);
    });

    it('should return 404 for unknown searches', async () => {
      const response = await fetch('http://localhost:3000/api/search?q=samsung');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Not found');
    });

    it('should return 400 for empty query', async () => {
      const response = await fetch('http://localhost:3000/api/search?q=');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Bad request');
    });
  });

  describe('/api/items/:id endpoint', () => {
    it('should return product detail for valid ID', async () => {
      const response = await fetch('http://localhost:3000/api/items/MLA998877665');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('MLA998877665');
      expect(data.title).toContain('iPhone 16 Pro');
      expect(data.price).toBeDefined();
    });

    it('should return 404 for unknown product ID', async () => {
      const response = await fetch('http://localhost:3000/api/items/INVALID_ID');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Not found');
    });
  });
}); 
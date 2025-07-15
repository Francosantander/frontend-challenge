import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/search/SearchBox/SearchBox';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SearchBox Component', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    mockPush.mockClear();
  });

  describe('Rendering', () => {
    test('should render with default props', () => {
      render(<SearchBox />);
      
      expect(screen.getByRole('search')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar productos, marcas y más...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
    });

    test('should render with custom placeholder', () => {
      render(<SearchBox placeholder="Buscar móviles..." />);
      
      expect(screen.getByPlaceholderText('Buscar móviles...')).toBeInTheDocument();
    });

    test('should have correct accessibility attributes', () => {
      render(<SearchBox />);
      
      const form = screen.getByRole('search');
      expect(form).toHaveAttribute('aria-label', 'Buscar productos');
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Buscar productos, marcas y más');
      
      const submitButton = screen.getByRole('button', { name: 'Buscar' });
      expect(submitButton).toHaveAttribute('aria-label', 'Buscar');
    });
  });

  describe('User Interactions', () => {
    test('should update input value when user types', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      
      expect(input).toHaveValue('iPhone');
    });

    test('should show clear button when there is text', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      
      expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument();
    });

    test('should clear input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      expect(input).toHaveValue('iPhone');
      
      const clearButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
      await user.click(clearButton);
      
      expect(input).toHaveValue('');
      expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('should navigate to search page on form submit', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=iPhone');
    });

    test('should navigate on Enter key press', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'Samsung');
      await user.keyboard('{Enter}');
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=Samsung');
    });

    test('should encode special characters in URL', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone & Samsung');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=iPhone%20%26%20Samsung');
    });

    test('should trim whitespace from query', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, '  iPhone  ');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=iPhone');
    });
  });

  describe('Validation', () => {
    test('should not submit empty query', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const submitButton = screen.getByRole('button', { name: 'Buscar' });
      
      await user.click(submitButton);
      
      expect(mockPush).not.toHaveBeenCalled();
    });

    test('should not submit whitespace-only query', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, '   ');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).not.toHaveBeenCalled();
    });

    test('should disable submit button when query is empty', () => {
      render(<SearchBox />);
      
      const submitButton = screen.getByRole('button', { name: 'Buscar' });
      
      expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when query has content', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      const submitButton = screen.getByRole('button', { name: 'Buscar' });
      
      expect(submitButton).toBeDisabled();
      
      await user.type(input, 'iPhone');
      
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Security', () => {
    test('should sanitize XSS attempts in search query', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      const maliciousQuery = '<script>alert("xss")</script>';
      
      await user.type(input, maliciousQuery);
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=scriptalert(%22xss%22)%2Fscript');
    });

    test('should handle various XSS injection attempts', async () => {
      const user = userEvent.setup();
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      const xssTestCases = [
        {
          input: 'javascript:alert(1)',
          expected: '/search?q=javascript%3Aalert(1)'
        },
        {
          input: 'onload="alert(1)"',
          expected: '/search?q=onload%3D%22alert(1)%22'
        },
        {
          input: '<img src=x onerror=alert(1)>',
          expected: '/search?q=img%20src%3Dx%20onerror%3Dalert(1)'
        }
      ];
      
      for (const testCase of xssTestCases) {
        await user.clear(input);
        await user.type(input, testCase.input);
        await user.click(screen.getByRole('button', { name: 'Buscar' }));
        
        expect(mockPush).toHaveBeenCalledWith(testCase.expected);
      }
    });
  });

  describe('Loading States', () => {
    test('should show loading state during navigation', async () => {
      const user = userEvent.setup();
      
      mockPush.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), 100);
        });
      });
      
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      
      fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=iPhone');
    });
  });

  describe('Error Handling', () => {
    test('should handle navigation errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockPush.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });
      
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error en navegación:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });

    test('should reset loading state after navigation error', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockPush.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });
      
      render(<SearchBox />);
      
      const input = screen.getByRole('searchbox');
      
      await user.type(input, 'iPhone');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));
      
      expect(input).not.toBeDisabled();
      
      consoleErrorSpy.mockRestore();
    });
  });
}); 
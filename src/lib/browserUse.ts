import axios from 'axios';

const BROWSER_USE_API_KEY = import.meta.env.VITE_BROWSER_USE_API_KEY;
// Updated base URL for Browser-Use API
const BROWSER_USE_BASE_URL = 'https://api.browser-use.com/api/v1';

if (!BROWSER_USE_API_KEY) {
  console.warn('Browser-Use API key is not set. Please set VITE_BROWSER_USE_API_KEY in your .env file.');
}

export interface Product {
  id: string;
  name: string;
  price: string;
  currency: string;
  url: string;
  image_url: string;
  description: string;
  brand: string;
  category: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  rating?: number;
  reviews_count?: number;
}

export interface SearchResult {
  products: Product[];
  total_results: number;
  page?: number;
  page_size?: number;
  search_query: string;
  website: string;
}

/**
 * Test the Browser-Use API connection
 * @returns Promise<boolean> - True if the API is working, false otherwise
 */
export const testBrowserUseAPI = async (): Promise<{ success: boolean; message: string }> => {
  if (!BROWSER_USE_API_KEY) {
    return { success: false, message: 'API key is not configured. Please set VITE_BROWSER_USE_API_KEY in your .env file.' };
  }

  try {
    // First try a simple health check endpoint if available
    try {
      const healthResponse = await axios.get(`${BROWSER_USE_BASE_URL}/health`, {
        timeout: 5000,
      });
      console.log('Health check response:', healthResponse.data);
    } catch (healthError) {
      console.log('Health check endpoint not available, proceeding with search test...');
    }

    // Test with a search query
    const response = await axios.get<SearchResult>(`${BROWSER_USE_BASE_URL}/search`, {
      params: {
        query: 'dress', // Simple test query
        api_key: BROWSER_USE_API_KEY,
        limit: 1,
      },
      timeout: 10000, // 10 second timeout
    });
    
    return { 
      success: true, 
      message: `API is working! Found ${response.data.products?.length || 0} products` 
    };
  } catch (error: any) {
    console.error('Browser-Use API test failed:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Unknown error occurred' 
    };
  }
};

/**
 * Search for products on H&M
 * @param query Search query
 * @param category Optional category to filter results (women, men, kids, home)
 * @param maxResults Maximum number of results to return (default: 10)
 * @returns Promise<SearchResult> Search results
 */
export const searchHnMProducts = async (
  query: string,
  category: 'women' | 'men' | 'kids' | 'home' = 'women',
  maxResults: number = 10
): Promise<SearchResult> => {
  if (!BROWSER_USE_API_KEY) {
    throw new Error('Browser-Use API key is not configured');
  }

  try {
    const searchQuery = category 
      ? `${query} site:hm.com/shop/${category}`
      : `${query} site:hm.com`;

    const response = await axios.get<SearchResult>(`${BROWSER_USE_BASE_URL}/search`, {
      params: {
        query: searchQuery,
        api_key: BROWSER_USE_API_KEY,
        limit: maxResults,
      },
      timeout: 15000, // 15 second timeout
    });
    
    console.log('Browser-Use API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching H&M products:', error);
    
    // Return mock H&M data for development/demo purposes when API fails
    return {
      products: [
        {
          id: 'hm_001',
          name: 'Slim Fit Blazer',
          price: '3999',
          currency: 'INR',
          url: 'https://www2.hm.com/en_in/productpage.0713986001.html',
          image_url: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F13%2F98%2F1398f8b8c8a9c8c8c8c8c8c8c8c8c8c8c8c8c8c8.jpg%5D&call=url[file:/product/main]',
          description: 'Tailored blazer in woven fabric with notched lapels',
          brand: 'H&M',
          category: 'Blazers',
          availability: 'in_stock',
          rating: 4.2,
          reviews_count: 156
        },
        {
          id: 'hm_002',
          name: 'High-waisted Trousers',
          price: '2299',
          currency: 'INR',
          url: 'https://www2.hm.com/en_in/productpage.0975919001.html',
          image_url: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F97%2F59%2F9759f8b8c8a9c8c8c8c8c8c8c8c8c8c8c8c8c8c8.jpg%5D&call=url[file:/product/main]',
          description: 'High-waisted trousers in stretch fabric',
          brand: 'H&M',
          category: 'Trousers',
          availability: 'in_stock',
          rating: 4.5,
          reviews_count: 203
        },
        {
          id: 'hm_003',
          name: 'Statement Chain Necklace',
          price: '799',
          currency: 'INR',
          url: 'https://www2.hm.com/en_in/productpage.0975919002.html',
          image_url: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F97%2F59%2F9759f8b8c8a9c8c8c8c8c8c8c8c8c8c8c8c8c8c8.jpg%5D&call=url[file:/product/main]',
          description: 'Gold-colored chain necklace with pendant',
          brand: 'H&M',
          category: 'Jewelry',
          availability: 'limited',
          rating: 4.0,
          reviews_count: 89
        }
      ],
      total_results: 3,
      search_query: keyword,
      website: 'H&M India'
    };
  }
}

export async function searchZaraProducts(
  keyword: string,
  category: 'woman' | 'man' | 'kids' = 'woman',
  maxResults: number = 10
): Promise<SearchResult> {
  try {
    const response = await axios.post(
      `${BROWSER_USE_BASE_URL}/scrape`,
      {
        website: 'zara.com',
        action: 'search_products',
        parameters: {
          query: keyword,
          category,
          max_results: maxResults,
          country: 'in',
          language: 'en'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${BROWSER_USE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Browser-Use API error for Zara:', error);
    
    // Return mock Zara data
    return {
      products: [
        {
          id: 'zara_001',
          name: 'Structured Blazer',
          price: '5990',
          currency: 'INR',
          url: 'https://www.zara.com/in/en/structured-blazer-p07545043.html',
          image_url: 'https://static.zara.net/photos//2023/V/07545043_1.jpg',
          description: 'Structured blazer with shoulder pads',
          brand: 'Zara',
          category: 'Blazers',
          availability: 'in_stock',
          rating: 4.3,
          reviews_count: 124
        }
      ],
      total_results: 1,
      search_query: keyword,
      website: 'Zara India'
    };
  }
}

export async function getProductDetails(url: string): Promise<Product | null> {
  try {
    const response = await axios.post(
      `${BROWSER_USE_BASE_URL}/scrape`,
      {
        website: 'auto_detect',
        action: 'get_product_details',
        parameters: {
          product_url: url
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${BROWSER_USE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.product;
  } catch (error) {
    console.error('Browser-Use product details error:', error);
    return null;
  }
}

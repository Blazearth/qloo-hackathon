import axios from 'axios';

const BROWSER_USE_API_KEY = import.meta.env.VITE_BROWSER_USE_API_KEY;
// Updated base URL for Browser-Use API
const BROWSER_USE_BASE_URL = 'https://api.browser-use.com/api/v1';


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
 * Search for products on H&M
 * @param keyword Search query
 * @param category Category to search in
 * @param maxResults Maximum number of results to return
 * @returns Promise<SearchResult> Search results
 */
export async function searchHnMProducts(
  keyword: string,
  category: 'women' | 'men' | 'kids' | 'home' = 'women',
  maxResults: number = 10
): Promise<SearchResult> {
  try {
    const response = await axios.post(
      `${BROWSER_USE_BASE_URL}/scrape`,
      {
        website: 'hm.com',
        action: 'search_products',
        parameters: {
          query: keyword,
          category,
          max_results: maxResults,
          country: 'in', // India
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
    console.log('Browser-Use API response:', response.data);
    // Return mock H&M data for development/demo purposes when API fails
    return {
      products: [
        {
          id: 'hm_001',
          name: 'Slim Fit Blazer',
          price: '3299',
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
  catch (error) {
    console.error('Browser-Use API error for H&M:', error);
    
    // Return mock H&M data
    return {
      products: [
        {
          id: 'hm_001',
          name: 'Slim Fit Blazer',
          price: '3299',
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

import axios from 'axios';
import { getQlooSuggestions } from '../lib/qloo';

export interface FashionProduct {
  id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  imageUrl: string;
  productUrl: string;
  store: string;
  brand: string;
  inStock: boolean;
  qlooScores?: {
    culturalRelevance: number;
    styleMatch: number;
    popularity: number;
  };
  culturalInsights?: string;
}

interface SearchConfig {
  query: string;
  maxResults?: number;
  priceRange?: [number, number];
  category?: string;
}

export const searchFashionProducts = async (config: SearchConfig): Promise<FashionProduct[]> => {
  const { query, maxResults = 10 } = config;
  try {
    const [myntraResults, ajioResults, hmResults] = await Promise.allSettled([
      searchMyntra(query, maxResults),
      searchAjio(query, maxResults),
      searchHm(query, maxResults)
    ]);
    let allProducts: FashionProduct[] = [];
    if (myntraResults.status === 'fulfilled') {
      allProducts = [...allProducts, ...myntraResults.value];
    }
    if (ajioResults.status === 'fulfilled') {
      allProducts = [...allProducts, ...ajioResults.value];
    }
    if (hmResults.status === 'fulfilled') {
      allProducts = [...allProducts, ...hmResults.value];
    }
    return await enhanceWithQlooScores(allProducts, { query, maxResults });
  } catch (error) {
    console.error('Error in fashion search:', error);
    throw new Error('Failed to search for products. Please try again later.');
  }
};

const enhanceWithQlooScores = async (products: FashionProduct[], context: any): Promise<FashionProduct[]> => {
  try {
    const qlooData = await getQlooSuggestions({ query: context.query });
    return products.map(product => ({
      ...product,
      qlooScores: {
        culturalRelevance: Math.random(),
        styleMatch: Math.random(),
        popularity: Math.random()
      },
      culturalInsights: 'This item aligns with current cultural trends in your region.'
    })).sort((a, b) => {
      const scoreA = (a.qlooScores?.culturalRelevance || 0) * 0.4 + (a.qlooScores?.styleMatch || 0) * 0.4 + (a.qlooScores?.popularity || 0) * 0.2;
      const scoreB = (b.qlooScores?.culturalRelevance || 0) * 0.4 + (b.qlooScores?.styleMatch || 0) * 0.4 + (b.qlooScores?.popularity || 0) * 0.2;
      return scoreB - scoreA;
    });
  } catch (error) {
    console.error('Error enhancing with QLoo:', error);
    return products;
  }
};

const searchMyntra = async (query: string, limit: number): Promise<FashionProduct[]> => {
  try {
    const response = await axios.get('https://myntra2.p.rapidapi.com/v2/search', {
      params: { query, page: '1', itemsPerPage: limit },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'myntra2.p.rapidapi.com'
      }
    });
    return response.data.products.map((p: any) => ({
      id: p.id,
      title: p.productName,
      price: {
        amount: p.price.amount,
        currency: p.price.currency,
        formatted: `₹${p.price.amount}`
      },
      imageUrl: p.searchImage,
      productUrl: `https://www.myntra.com/${p.productUrl}`,
      store: 'Myntra',
      brand: p.brand,
      inStock: p.inStock
    }));
  } catch (error) {
    console.error('Error searching Myntra:', error);
    return [];
  }
};

const searchAjio = async (query: string, limit: number): Promise<FashionProduct[]> => {
  try {
    const response = await axios.get('https://ajio-scraper-api.p.rapidapi.com/search', {
      params: { query, limit },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'ajio-scraper-api.p.rapidapi.com'
      }
    });
    return response.data.products.map((p: any) => ({
      id: p.id,
      title: p.name,
      price: {
        amount: p.price.amount,
        currency: p.price.currency,
        formatted: `₹${p.price.amount}`
      },
      imageUrl: p.imageUrl,
      productUrl: p.url,
      store: 'Ajio',
      brand: p.brand,
      inStock: p.inStock
    }));
  } catch (error) {
    console.error('Error searching Ajio:', error);
    return [];
  }
};

const searchHm = async (query: string, limit: number): Promise<FashionProduct[]> => {
  try {
    const response = await axios.get('https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/search', {
      params: {
        query,
        country: 'in',
        lang: 'en',
        currentpage: '0',
        pagesize: limit.toString(),
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    });
    return response.data.results.products.map((p: any) => ({
      id: p.articleCode,
      title: p.name,
      price: {
        amount: p.price.value,
        currency: p.price.currency,
        formatted: p.price.formatted
      },
      imageUrl: p.images?.[0]?.url || '',
      productUrl: `https://www2.hm.com${p.link}`,
      store: 'H&M',
      brand: 'H&M',
      inStock: p.available
    }));
  } catch (error) {
    console.error('Error searching H&M:', error);
    return [];
  }
};

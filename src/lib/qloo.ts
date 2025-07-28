import axios from 'axios';

const QLOO_API_KEY = import.meta.env.VITE_QLOO_API_KEY;
const QLOO_BASE_URL = 'https://hackathon.api.qloo.com';

export interface QlooRecommendation {
  id: string;
  name: string;
  category: string;
  cultural_relevance: number;
  style_tags: string[];
  description: string;
}

export interface QlooResponse {
  recommendations: QlooRecommendation[];
  cultural_context: string;
  trending_styles: string[];
}

export async function getQlooFashionRecommendations(
  keyword: string,
  occasion?: string,
  culturalContext?: string
): Promise<QlooResponse> {
  try {
    const response = await axios.post(
      `${QLOO_BASE_URL}/recommendations`,
      {
        input: {
          type: 'fashion',
          keyword,
          occasion,
          cultural_context: culturalContext
        },
        options: {
          limit: 10,
          include_cultural_data: true,
          include_trending: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${QLOO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Qloo API error:', error);
    
    // Return mock data for development/demo purposes
    return {
      recommendations: [
        {
          id: '1',
          name: 'Contemporary Minimalist Look',
          category: 'professional',
          cultural_relevance: 0.85,
          style_tags: ['minimalist', 'professional', 'contemporary'],
          description: 'Clean lines and neutral colors perfect for modern professional settings'
        },
        {
          id: '2',
          name: 'Streetwear Fusion',
          category: 'casual',
          cultural_relevance: 0.92,
          style_tags: ['streetwear', 'urban', 'trendy'],
          description: 'Mix of comfort and style popular in urban youth culture'
        }
      ],
      cultural_context: 'These styles are trending in metropolitan areas and reflect current fashion movements',
      trending_styles: ['oversized silhouettes', 'neutral palettes', 'sustainable fashion']
    };
  }
}

export async function getQlooTrendingStyles(category?: string): Promise<string[]> {
  try {
    const response = await axios.get(
      `${QLOO_BASE_URL}/trending/fashion`,
      {
        headers: {
          'Authorization': `Bearer ${QLOO_API_KEY}`
        },
        params: {
          category,
          limit: 20
        }
      }
    );

    return response.data.trending_styles || [];
  } catch (error) {
    console.error('Qloo trending API error:', error);
    
    // Return mock trending data
    return [
      'Sustainable fashion',
      'Oversized blazers',
      'Cargo pants revival',
      'Minimalist jewelry',
      'Neutral color palettes',
      'Vintage denim',
      'Statement sleeves',
      'Chunky sneakers'
    ];
  }
}

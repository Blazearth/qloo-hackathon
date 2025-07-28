import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FashionTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
  };
}

const fashionTools: FashionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getQlooSuggestion',
      description: 'Get culturally relevant fashion recommendations using Qloo API',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Fashion keyword or style to search for (e.g., "summer dress", "streetwear", "formal wear")'
          },
          occasion: {
            type: 'string',
            description: 'The occasion or event type (e.g., "party", "work", "casual", "date")'
          }
        },
        required: ['keyword']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'searchHnM',
      description: 'Search for real fashion products on H&M using Browser-Use API',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Product keyword to search for on H&M (e.g., "black dress", "leather jacket", "jeans")'
          },
          category: {
            type: 'string',
            description: 'Product category (e.g., "women", "men", "kids")'
          }
        },
        required: ['keyword']
      }
    }
  }
];

export async function getChatCompletion(messages: Message[]): Promise<string> {
  try {
    const systemMessage: Message = {
      role: 'system',
      content: `You are a professional fashion stylist AI assistant. You help users find trendy, culturally-aware outfit suggestions. 

Key guidelines:
- Always be enthusiastic and helpful about fashion
- Consider the user's occasion, weather, and style preferences
- Use the available tools to get real product recommendations
- Provide specific, actionable fashion advice
- Include price ranges and styling tips
- Be culturally sensitive and inclusive

Available tools:
- getQlooSuggestion: For culturally-informed fashion recommendations
- searchHnM: For finding real products with prices from H&M

Always try to use both tools when relevant to provide comprehensive suggestions.`
    };

    const allMessages = [systemMessage, ...messages];

    const completion = await groq.chat.completions.create({
      messages: allMessages,
      model: 'llama3-8b-8192',
      tools: fashionTools,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message;
    
    if (response?.tool_calls && response.tool_calls.length > 0) {
      // Handle tool calls
      const toolResults = await Promise.all(
        response.tool_calls.map(async (toolCall) => {
          const { name, arguments: args } = toolCall.function;
          const parsedArgs = JSON.parse(args);
          
          let result = '';
          if (name === 'getQlooSuggestion') {
            result = await handleQlooSuggestion(parsedArgs);
          } else if (name === 'searchHnM') {
            result = await handleHnMSearch(parsedArgs);
          }
          
          return {
            tool_call_id: toolCall.id,
            role: 'tool' as const,
            content: result
          };
        })
      );

      // Get final response with tool results
      const finalCompletion = await groq.chat.completions.create({
        messages: [
          ...allMessages,
          response,
          ...toolResults
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1000,
      });

      return finalCompletion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
    }

    return response?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Groq API error:', error);
    return 'Sorry, I\'m having trouble connecting to my fashion knowledge right now. Please try again!';
  }
}

async function handleQlooSuggestion(args: { keyword: string; occasion?: string }): Promise<string> {
  try {
    // This would integrate with your Qloo API
    // For now, returning mock data that simulates Qloo's cultural recommendations
    console.log('Qloo suggestion for:', args.keyword, args.occasion);
    const mockQlooData = {
      suggestions: [
        {
          style: "Contemporary Minimalist",
          items: ["Tailored blazer", "High-waisted trousers", "Statement accessories"],
          cultural_context: "Popular in urban professional settings",
          color_palette: ["Navy", "Cream", "Gold accents"]
        },
        {
          style: "Streetwear Fusion",
          items: ["Oversized hoodie", "Cargo pants", "Chunky sneakers"],
          cultural_context: "Trending in youth culture and social media",
          color_palette: ["Black", "Olive green", "White"]
        }
      ]
    };

    return JSON.stringify(mockQlooData);
  } catch (error) {
    console.error('Qloo API error:', error);
    return 'Unable to fetch cultural fashion recommendations at the moment.';
  }
}

async function handleHnMSearch(args: { keyword: string; category?: string }): Promise<string> {
  try {
    // This would integrate with Browser-Use API to scrape H&M
    // For now, returning mock product data
    console.log('H&M search for:', args.keyword, args.category);
    const mockHnMData = {
      products: [
        {
          name: "Slim Fit Blazer",
          price: "₹3,999",
          url: "https://www2.hm.com/en_in/productpage.0713986001.html",
          image: "https://lp2.hm.com/hmgoepprod",
          description: "Tailored blazer in woven fabric"
        },
        {
          name: "High-waisted Trousers",
          price: "₹2,299",
          url: "https://www2.hm.com/en_in/productpage.0975919001.html",
          image: "https://lp2.hm.com/hmgoepprod",
          description: "High-waisted trousers in stretch fabric"
        },
        {
          name: "Statement Necklace",
          price: "₹799",
          url: "https://www2.hm.com/en_in/productpage.0975919001.html",
          image: "https://lp2.hm.com/hmgoepprod",
          description: "Gold-colored chain necklace"
        }
      ]
    };

    return JSON.stringify(mockHnMData);
  } catch (error) {
    console.error('H&M search error:', error);
    return 'Unable to fetch H&M products at the moment.';
  }
}

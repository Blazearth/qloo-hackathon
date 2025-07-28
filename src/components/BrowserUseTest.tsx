import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { testBrowserUseAPI } from '@/lib/browserUse';

const BROWSER_USE_BASE_URL = 'https://api.browser-use.com/api/v1';
const BROWSER_USE_API_KEY = import.meta.env.VITE_BROWSER_USE_API_KEY;

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export function BrowserUseTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(!!BROWSER_USE_API_KEY);
  
  // Check if API key is configured on component mount
  useEffect(() => {
    setApiKeyConfigured(!!BROWSER_USE_API_KEY);
  }, []);

  const handleTestAPI = async () => {
    if (!BROWSER_USE_API_KEY) {
      setTestResult({
        success: false,
        message: 'API key is not configured. Please set VITE_BROWSER_USE_API_KEY in your .env file.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testBrowserUseAPI();
      setTestResult({
        ...result,
        details: {
          apiKey: BROWSER_USE_API_KEY ? '✅ Configured' : '❌ Missing',
          apiKeyPreview: BROWSER_USE_API_KEY 
            ? `${BROWSER_USE_API_KEY.substring(0, 8)}...${BROWSER_USE_API_KEY.substring(BROWSER_USE_API_KEY.length - 4)}`
            : 'Not set',
          baseUrl: BROWSER_USE_BASE_URL,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('API test failed:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: {
          error: error instanceof Error ? error.toString() : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold mb-4">Browser-Use API Test</h2>
      <div className="space-y-4">
        <Button 
          onClick={handleTestAPI} 
          disabled={isTesting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : 'Test Browser-Use API'}
        </Button>

        {testResult && (
          <div className={`p-4 rounded-md ${
            testResult.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <h3 className="font-medium">
              {testResult.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <p className="mt-1">{testResult.message}</p>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          <p>This will test the connection to the Browser-Use API and verify your API key.</p>
          <p className="mt-1">
            <strong>Note:</strong> Make sure you have set the <code>VITE_BROWSER_USE_API_KEY</code> in your <code>.env</code> file.
          </p>
        </div>
      </div>
    </div>
  );
}

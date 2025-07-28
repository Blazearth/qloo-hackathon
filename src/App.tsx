import { useState } from 'react';
import Chat from './components/Chat';
import { BrowserUseTest } from './components/BrowserUseTest';
import './App.css';

function App() {
  const [showTest, setShowTest] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowTest(!showTest)}
            className="text-sm bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-full border border-gray-200 shadow-sm"
          >
            {showTest ? 'Hide API Test' : 'Test Browser-Use API'}
          </button>
        </div>
        
        {showTest ? (
          <BrowserUseTest />
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

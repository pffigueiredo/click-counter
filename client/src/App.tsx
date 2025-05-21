
import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import ClickTracker from '@/components/ClickTracker';
import './App.css';

function App() {
  const [clickCount, setClickCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClickCount = async () => {
      try {
        const data = await trpc.getClickCount.query();
        setClickCount(data.count);
      } catch (err) {
        console.error("Failed to fetch click count:", err);
        setError("Failed to load click count. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClickCount();
  }, []);

  const handleClick = async () => {
    try {
      await trpc.recordClick.mutate({});
      // Update click count after recording a new click
      const updatedCount = await trpc.getClickCount.query();
      setClickCount(updatedCount.count);
    } catch (err) {
      console.error("Failed to record click:", err);
      setError("Failed to record your click. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Click Tracker</h1>
      <p className="app-description">
        Click the button below to track your clicks. All clicks are stored and counted.
      </p>
      
      <ClickTracker 
        clickCount={clickCount} 
        isLoading={isLoading} 
        error={error} 
        onClickTrack={handleClick} 
      />
    </div>
  );
}

export default App;


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ClickTrackerProps {
  clickCount: number | null;
  isLoading: boolean;
  error: string | null;
  onClickTrack: () => Promise<void>;
}

const ClickTracker = ({ clickCount, isLoading, error, onClickTrack }: ClickTrackerProps) => {
  return (
    <Card className="click-tracker-card">
      <CardHeader>
        <CardTitle>Click Counter</CardTitle>
        <CardDescription>Track how many clicks have been recorded</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="loading-state">
            <Progress value={80} className="loading-progress" />
            <p className="loading-text">Loading click data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="click-display">
            <div className="click-number">{clickCount}</div>
            <p className="click-label">Total Clicks</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onClickTrack} 
          disabled={isLoading} 
          className="click-button"
          size="lg"
        >
          Click Me!
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClickTracker;

import { useState, useEffect } from 'react';
import { Plus, Minus, RefreshCw, Copy, Clock } from 'lucide-react';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent 
} from './components/ui/card';

const TimeManipulator = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputValue, setInputValue] = useState(String(timestamp));
  const [isValidInput, setIsValidInput] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMilliseconds, setIsMilliseconds] = useState(false);

  const timeIntervals = [
    { label: '1 Minute', seconds: 60 },
    { label: '30 Minutes', seconds: 1800 },
    { label: '1 Hour', seconds: 3600 },
    { label: '1 Day', seconds: 86400 },
    { label: '1 Week', seconds: 604800 }
  ];

  const convertToSeconds = (value) => {
    const num = Number(value);
    // If the timestamp is in milliseconds (over 30 years in seconds), convert to seconds
    if (num > 1000000000000) {
      return Math.floor(num / 1000);
    }
    return num;
  };

  const convertToMilliseconds = (seconds) => {
    return seconds * 1000;
  };

  useEffect(() => {
    // Update input value when switching between seconds and milliseconds
    setInputValue(String(isMilliseconds ? convertToMilliseconds(timestamp) : timestamp));
  }, [isMilliseconds, timestamp]);

  const updateTimestamp = () => {
    const current = Math.floor(Date.now() / 1000);
    setTimestamp(current);
    setInputValue(String(isMilliseconds ? convertToMilliseconds(current) : current));
  };

  const formatDate = (unixTimestamp, timezone = 'America/Chicago') => {
    try {
      const date = new Date(unixTimestamp * 1000);
      
      return new Intl.DateTimeFormat('default', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: timezone
      }).format(date);
    } catch {
      return 'Invalid timestamp';
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    const num = Number(value);
    const isValid = !isNaN(num) && String(num) === value && num >= 0;
    setIsValidInput(isValid);
    
    if (isValid) {
      const secondsValue = convertToSeconds(num);
      setTimestamp(secondsValue);
    }
  };

  const handleBlur = () => {
    if (!isValidInput) {
      setInputValue(String(isMilliseconds ? convertToMilliseconds(timestamp) : timestamp));
      setIsValidInput(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleTimeFormat = () => {
    setIsMilliseconds(!isMilliseconds);
  };

  return (
    <Card className="max-w-lg mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          Unix Timestamp Manipulator
          <button
            onClick={toggleTimeFormat}
            className={`px-3 py-1 rounded-full text-sm ${
              isMilliseconds 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } transition-colors`}
            title="Toggle between seconds and milliseconds"
          >
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {isMilliseconds ? 'ms' : 's'}
            </span>
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`text-3xl font-mono text-center w-full p-3 border rounded-lg ${
              isValidInput ? 'border-gray-300 focus:border-blue-500' : 'border-red-500'
            } transition-colors duration-200`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Copy timestamp"
            >
              <Copy className="w-5 h-5" />
              {copied && (
                <span className="absolute -top-8 right-0 text-sm bg-black text-white px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={updateTimestamp}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              title="Get current timestamp"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <span className="font-semibold">CST:</span>
            <span className="text-gray-700">{isValidInput ? formatDate(timestamp) : 'Invalid timestamp'}</span>
            <span className="font-semibold">EST:</span>
            <span className="text-gray-700">{isValidInput ? formatDate(timestamp, 'America/New_York') : 'Invalid timestamp'}</span>
            <span className="font-semibold">UTC:</span>
            <span className="text-gray-700">{isValidInput ? formatDate(timestamp, 'UTC') : 'Invalid timestamp'}</span>
          </div>
        </div>

        <div className="space-y-3">
          {timeIntervals.map(({ label, seconds }) => (
            <div key={label} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700 font-medium">{label}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newTimestamp = timestamp - seconds;
                    setTimestamp(newTimestamp);
                  }}
                  className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Subtract
                </button>
                <button
                  onClick={() => {
                    const newTimestamp = timestamp + seconds;
                    setTimestamp(newTimestamp);
                  }}
                  className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeManipulator;
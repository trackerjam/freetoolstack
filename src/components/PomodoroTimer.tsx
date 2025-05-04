import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import ToolHeader from './ToolHeader';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    const notification = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    notification.play();

    if (!isBreak) {
      setTimeLeft(5 * 60); // 5 minute break
      setIsBreak(true);
    } else {
      setTimeLeft(25 * 60); // 25 minute work session
      setIsBreak(false);
      setCycles(c => c + 1);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
    setCycles(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Pomodoro Timer" 
          description="Stay focused and boost productivity"
        />
        
        <div className="text-center space-y-6">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg font-medium text-gray-600">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                isRunning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-800 font-medium">Statistics</div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-blue-600">Completed Cycles</div>
                <div className="text-2xl font-bold text-blue-800">{cycles}</div>
              </div>
              <div>
                <div className="text-sm text-blue-600">Total Focus Time</div>
                <div className="text-2xl font-bold text-blue-800">
                  {Math.floor(cycles * 25)} min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
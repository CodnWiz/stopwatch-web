import React, { useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const lastTime = useRef(0);

  const start = () => {
    if (!running) {
      setRunning(true);
      lastTime.current = Date.now();
      timer.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTime.current;
        lastTime.current = now;
        setTime(prev => prev + elapsed);
      }, 10);
    }
  };

  const stop = () => {
    if (running) {
      setRunning(false);
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  };

  const reset = () => {
    setRunning(false);
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setTime(0);
  };

  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${
      milliseconds < 10 ? "0" : ""
    }${milliseconds}`;
  }, []);

  return (
    <div className="container">
      <div className="time">{formatTime(time)}</div>
      <div className="buttons">
        <button 
          className={`button startButton ${running ? 'disabled' : ''}`}
          onClick={start}
          disabled={running}
        >
          Start
        </button>
        
        <button 
          className={`button stopButton ${running ? 'stopButtonActive' : ''} ${!running ? 'disabled' : ''}`}
          onClick={stop}
          disabled={!running}
        >
          Stop
        </button>
        
        <button 
          className="button resetButton"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;

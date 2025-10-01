import React, { useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const lastTime = useRef(0);
  const lastSecond = useRef(0);
  const tickAudio = useRef(null);

  // Preload a realistic watch tick sound
  const playTick = () => {
    if (!tickAudio.current) {
      // Create a more realistic analog watch tick using Web Audio API
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Analog watch characteristics:
      oscillator.frequency.value = 1200; // Higher frequency for metallic tick
      gainNode.gain.value = 0.08; // Very low volume for subtle tick
      oscillator.type = 'sine';
      
      // Quick attack and decay for sharp "tick" sound
      gainNode.gain.setValueAtTime(0.08, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08); // Very short, sharp tick
    }
  };

  const start = () => {
    if (!running) {
      setRunning(true);
      lastTime.current = Date.now();
      lastSecond.current = Math.floor(time / 1000);
      
      timer.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTime.current;
        lastTime.current = now;
        
        setTime(prev => {
          const newTime = prev + elapsed;
          const currentSecond = Math.floor(newTime / 1000);
          
          // Play realistic tick sound every new second
          if (currentSecond !== lastSecond.current) {
            lastSecond.current = currentSecond;
            playTick();
          }
          
          return newTime;
        });
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
    lastSecond.current = 0;
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

import React, { useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const lastTime = useRef(0);
  const audioContext = useRef(null);

  // Initialize audio context on user interaction
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext.current;
  };

  const playTick = () => {
    const context = initAudio();
    
    // Create a more realistic mechanical watch tick
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Analog watch characteristics - lower frequency, noise-like
    oscillator.frequency.value = 80; // Much lower for mechanical sound
    gainNode.gain.value = 0.15;
    
    // Use pulse wave for mechanical sound
    oscillator.type = 'square';
    
    // Very short, sharp attack and decay
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.001); // Quick attack
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.03); // Quick decay
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.03); // Very short duration
  };

  const start = () => {
    if (!running) {
      // Initialize audio on first user interaction
      initAudio();
      
      setRunning(true);
      lastTime.current = Date.now();
      
      timer.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTime.current;
        lastTime.current = now;
        
        setTime(prev => {
          const newTime = prev + elapsed;
          
          // Play tick sound EVERY second consistently
          const currentSecond = Math.floor(newTime / 1000);
          const previousSecond = Math.floor(prev / 1000);
          
          if (currentSecond !== previousSecond) {
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

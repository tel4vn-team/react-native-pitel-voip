import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export const Clock = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <Text>
      {time > 3600
        ? `${('0' + Math.floor((time / 60000) % 60)).slice(-2)}:`
        : ''}
      {('0' + Math.floor((time / 100) % 60)).slice(-2)}:
      {('0' + (time % 60)).slice(-2)}
    </Text>
  );
};

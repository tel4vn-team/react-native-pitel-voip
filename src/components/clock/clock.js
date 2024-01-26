import React, { useEffect, useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { PitelSDKContext } from '../../context/pitel_sdk_context';

export const Clock = ({ textClock }) => {
  const [time, setTime] = useState(0);
  const { startClock, setStartClock } = useContext(PitelSDKContext);

  useEffect(() => {
    let interval;
    if (startClock) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!startClock) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startClock]);

  return (
    <>
      {startClock ? (
        <Text>
          {time > 3600
            ? `${('0' + Math.floor((time / 60000) % 60)).slice(-2)}:`
            : ''}
          {('0' + Math.floor((time / 100) % 60)).slice(-2)}:
          {('0' + (time % 60)).slice(-2)}
        </Text>
      ) : (
        <Text>{textClock ?? 'Connecting...'}</Text>
      )}
    </>
  );
};

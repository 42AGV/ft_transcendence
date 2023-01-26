import { useEffect, useState } from 'react';
import { Text, TextVariant } from '../index';
import './Timer.css';

type TimerProps = {
  textVariant?: TextVariant;
  timeString?: string;
  isBackwardsCount?: boolean;
  onTimeOut?: () => void;
};

type clockType = {
  timeInSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const secondsToClockType = (seconds: number): clockType => {
  return {
    timeInSeconds: seconds,
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor(seconds / 60),
    seconds: Math.floor(seconds % 60),
  };
};

function parseTime(input: string): clockType {
  let a = input.split(':'); // split it at the colons
  if (a[0] && a[1] && a[2]) {
    return {
      timeInSeconds:
        parseInt(a[0]) * 60 * 60 + parseInt(a[1]) * 60 + parseInt(a[2]),
      hours: parseInt(a[0]),
      minutes: parseInt(a[1]),
      seconds: parseInt(a[2]),
    };
  }
  throw new Error('Bad time format');
}

export default function Timer({
  textVariant = TextVariant.TITLE,
  timeString = '00:01:00',
  isBackwardsCount = true,
  onTimeOut,
}: TimerProps) {
  const [startDate, _] = useState<clockType>(parseTime(timeString));
  void _;
  const [{ timeInSeconds, hours, minutes, seconds }, setTime] =
    useState<clockType>(
      isBackwardsCount
        ? startDate
        : {
            timeInSeconds: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
    );
  useEffect(() => {
    setTimeout(() => {
      if (isBackwardsCount) {
        if (timeInSeconds === 0) {
          onTimeOut && onTimeOut();
          return;
        }
        setTime(secondsToClockType(timeInSeconds - 1));
      } else {
        if (timeInSeconds === startDate.timeInSeconds) {
          onTimeOut && onTimeOut();
          return;
        }
        setTime(secondsToClockType(timeInSeconds + 1));
      }
    }, 1000);
  }, [timeInSeconds, isBackwardsCount, onTimeOut, startDate.timeInSeconds]);
  return (
    <div className="timer">
      {(hours && (
        <Text variant={textVariant}>{`${hours
          .toString()
          .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`}</Text>
      )) || (
        <Text variant={textVariant}>{`${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</Text>
      )}
    </div>
  );
}

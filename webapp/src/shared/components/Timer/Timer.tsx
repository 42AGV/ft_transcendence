import { useEffect, useState } from 'react';
import { Text, TextVariant } from '../index';
import './Timer.css';

type TimerProps = {
  shouldRun?: boolean;
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
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - hours * 60;
  const lseconds = Math.floor(seconds % 60);
  return {
    timeInSeconds: seconds,
    hours,
    minutes,
    seconds: lseconds,
  };
};

const parseTime = (input: string): clockType => {
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
};

export default function Timer({
  shouldRun = true,
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
    if (shouldRun) {
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
    }
  }, [
    timeInSeconds,
    isBackwardsCount,
    onTimeOut,
    startDate.timeInSeconds,
    shouldRun,
  ]);
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

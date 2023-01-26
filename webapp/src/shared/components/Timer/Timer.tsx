import { useEffect, useState } from 'react';
import { Text, TextVariant } from '../index';
import './Timer.css';

type TimerProps = {
  deadlineInSeconds?: number;
  isForwardCount?: boolean;
  onTimeOut?: () => void;
};

export default function Timer({
  deadlineInSeconds = 60,
  isForwardCount,
  onTimeOut,
}: TimerProps) {
  const [time, setTime] = useState<number>(
    isForwardCount ? 0 : deadlineInSeconds,
  );
  useEffect(() => {}, []);
  void setTime;
  void onTimeOut;
  return (
    <div className={`timer`}>
      <Text variant={TextVariant.SUBHEADING}>{`${time}`}</Text>
    </div>
  );
}

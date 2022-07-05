import './Status.css';

type NoStatusProps = {
  offline?: never;
  online?: never;
  playing?: never;
};

type OfflineStatusProps = {
  offline: boolean;
  online?: never;
  playing?: never;
};

type OnlineStatusProps = {
  offline?: never;
  online: boolean;
  playing?: never;
};

type PlayingStatusProps = {
  offline?: never;
  online?: never;
  playing: boolean;
};

type StatusProps =
  | NoStatusProps
  | OfflineStatusProps
  | OnlineStatusProps
  | PlayingStatusProps;

const createVariant = (variant: { [key: string]: boolean }): string => {
  for (const [key, value] of Object.entries(variant)) {
    if (value) {
      return key;
    }
  }
  return 'offline';
};

export default function Status({
  online = false,
  playing = false,
  offline = false,
}: StatusProps) {
  const variant = createVariant({ offline, online, playing });

  return (
    <div className="status">
      <div className={`status-icon status-icon-${variant}`} />
      <div className={`status-text-${variant} caption-regular`}>{variant}</div>
    </div>
  );
}

import './Status.css';

export type StatusVariant = 'online' | 'offline' | 'playing';

type StatusProps = {
  variant: StatusVariant;
};

export default function Status({ variant }: StatusProps) {
  return (
    <div className="status">
      <div className={`status-icon status-icon-${variant}`} />
      <div className={`text-color-${variant} caption-regular`}>{variant}</div>
    </div>
  );
}

import './GameSpinner.css';

type GameSpinnerProps = {
  scaleInPercent?: number;
};

export default function GameSpinner({
  scaleInPercent = 200,
}: GameSpinnerProps) {
  return (
    <span
      className="game-spinner"
      style={{ transform: `scale(${scaleInPercent}%)` }}
    ></span>
  );
}

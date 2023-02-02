import { useContext } from 'react';
import { GamePairingContext } from '../context/GamePairingContext';

export function useGamePairing() {
  return useContext(GamePairingContext);
}

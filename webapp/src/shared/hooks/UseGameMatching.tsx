import { useContext } from 'react';
import { GamePairingContext } from '../context/GamePairingContext';

export function useGameMatching() {
  return useContext(GamePairingContext);
}

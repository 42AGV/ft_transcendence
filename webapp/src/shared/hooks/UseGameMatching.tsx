import { useContext } from 'react';
import { GameMatchingContext } from '../context/GameMatchingContext';

export function useGameMatching() {
  return useContext(GameMatchingContext);
}

import { useContext } from 'react';
import { UserBlocklistContext } from '../context/UserBlocklistContext';

export function useBlocklist() {
  return useContext(UserBlocklistContext);
}

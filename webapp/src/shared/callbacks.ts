import { NavigateFunction } from 'react-router-dom';

export const goBack = (navigate: NavigateFunction) => {
  return () => {
    navigate(-1);
  };
};

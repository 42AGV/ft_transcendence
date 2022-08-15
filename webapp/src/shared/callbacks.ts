import { HOST_URL, LOGOUT_EP_URL } from './urls';
import { NavigateFunction } from 'react-router-dom';

export const logout = (navigate: NavigateFunction) => {
  return () => {
    fetch(LOGOUT_EP_URL, {
      method: 'DELETE',
    })
      .catch((e) => console.error(e))
      .finally(() => {
        navigate(HOST_URL);
      });
  };
};

export const goBack = (navigate: NavigateFunction) => {
  return () => {
    navigate(-1);
  };
};

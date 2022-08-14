import { HOST_URL, LOGOUT_EP_URL } from './urls';

export const logout = () => {
  fetch(LOGOUT_EP_URL, {
    method: 'DELETE',
  })
    .catch((e) => console.error(e))
    .finally(() => {
      window.location.href = HOST_URL;
    });
};

export const goBack = () => {
  window.history.back();
};

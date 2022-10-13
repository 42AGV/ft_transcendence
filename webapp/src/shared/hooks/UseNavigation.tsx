import { NavigateFunction, useNavigate } from 'react-router-dom';

type Callback = () => void;

type UseNavigationReturn = {
  navigate: NavigateFunction;
  goBack: () => Callback;
  goBackTo: (route: string) => Callback;
};

export const useNavigation = (): UseNavigationReturn => {
  const navigate = useNavigate();

  const goBack = () => {
    return () => {
      navigate(-1);
    };
  };

  const goBackTo = (route: string) => {
    return () => {
      navigate(-1);
      navigate(route);
    };
  };

  return { navigate, goBack, goBackTo };
};

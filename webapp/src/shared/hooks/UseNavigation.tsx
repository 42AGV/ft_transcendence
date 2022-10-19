import { NavigateFunction, useNavigate } from 'react-router-dom';

type Callback = () => void;

type UseNavigationReturn = {
  navigate: NavigateFunction;
  goBack: () => Callback;
};

export const useNavigation = (): UseNavigationReturn => {
  const navigate = useNavigate();

  const goBack = () => {
    return () => {
      navigate(-1);
    };
  };

  return { navigate, goBack };
};

import { NavigateFunction, useNavigate } from 'react-router-dom';

type UseNavigationReturn = {
  navigate: NavigateFunction;
  goBack: VoidFunction;
};

export const useNavigation = (): UseNavigationReturn => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return { navigate, goBack };
};

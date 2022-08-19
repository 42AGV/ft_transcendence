import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    // TODO: Improve style or create Loading component
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    // TODO: Test if we can use the 'from' value after the 42 sign-in redirects the user back
    //       Try to redirect from the backend to '/' then, if there is a 'from' value, redirect the user there
    //       And if there is none, redirect to the default page, '/users' or '/play'
    //       In Landing.tsx:
    //         const { state } = useLocation();
    //         const from = state?.from || '/users';
    //
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
}

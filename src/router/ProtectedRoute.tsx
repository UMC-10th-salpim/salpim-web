import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserStore from '@/store/userStore';
import { isAccessTokenValid } from '@/utils/jwt';

const ProtectedRoute = () => {
  const location = useLocation();
  const accessToken = useUserStore((state) => state.accessToken);
  const logout = useUserStore((state) => state.logout);
  const isAuthenticated = isAccessTokenValid(accessToken);

  useEffect(() => {
    if (accessToken && !isAuthenticated) logout();
  }, [accessToken, isAuthenticated, logout]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

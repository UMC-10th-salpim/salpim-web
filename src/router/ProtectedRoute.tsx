import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserStore from '@/store/userStore';
import { getAccessTokenExpiresAt, isAccessTokenValid } from '@/utils/jwt';

const MAX_TIMEOUT_MS = 2_147_483_647;

const ProtectedRoute = () => {
  const location = useLocation();
  const accessToken = useUserStore((state) => state.accessToken);
  const logout = useUserStore((state) => state.logout);
  const isAuthenticated = isAccessTokenValid(accessToken);

  useEffect(() => {
    if (!accessToken) return;

    if (!isAuthenticated) {
      logout();
      return;
    }

    const expiresAt = getAccessTokenExpiresAt(accessToken);
    if (expiresAt === null) {
      logout();
      return;
    }

    let timeoutId: number;

    const logoutWhenExpired = () => {
      const remainingTime = expiresAt - Date.now();

      if (remainingTime <= 0) {
        logout();
        return;
      }

      timeoutId = window.setTimeout(logoutWhenExpired, Math.min(remainingTime, MAX_TIMEOUT_MS));
    };

    logoutWhenExpired();

    return () => window.clearTimeout(timeoutId);
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

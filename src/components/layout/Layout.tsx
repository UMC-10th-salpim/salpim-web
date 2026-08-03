import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-[100svh] bg-gray-100">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-screen-sm flex-col bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

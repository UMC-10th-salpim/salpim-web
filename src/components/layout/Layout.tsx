import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

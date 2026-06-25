import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      {/* TODO: Layout - HeaderBar, BottomNavigation 조합 */}
      <Outlet />
    </div>
  );
};

export default Layout;

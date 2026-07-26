import { Outlet } from 'react-router-dom';
import useSettingsStore from '@/store/settingsStore';

const Layout = () => {
  const fontSize = useSettingsStore((state) => state.fontSize);

  return (
    <div className={`min-h-[100svh] bg-gray-100 ${fontSize === 'large' ? 'text-[110%]' : ''}`}>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-screen-sm flex-col bg-brand-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

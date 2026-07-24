import { Outlet } from 'react-router-dom';
import useSettingsStore from '@/store/settingsStore';

const Layout = () => {
  const fontSize = useSettingsStore((state) => state.fontSize);

  return (
    <div className={`min-h-screen bg-gray-100 ${fontSize === 'large' ? 'text-[110%]' : ''}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

import { NavLink, useLocation } from 'react-router-dom';

export interface BottomNavigationItem {
  label: string;
  path: string;
  activePaths?: string[];
}

interface BottomNavigationProps {
  items?: BottomNavigationItem[];
  className?: string;
}

const defaultItems: BottomNavigationItem[] = [
  { label: '홈', path: '/recommendation', activePaths: ['/', '/recommendation'] },
  { label: '혜택', path: '/benefits', activePaths: ['/benefits'] },
  { label: '지도', path: '/map', activePaths: ['/map', '/facility'] },
  { label: '마이', path: '/mypage', activePaths: ['/mypage'] },
];

const BottomNavigation = ({ items = defaultItems, className = '' }: BottomNavigationProps) => {
  const { pathname } = useLocation();

  const isActivePath = (item: BottomNavigationItem) => {
    const activePaths = item.activePaths ?? [item.path];

    return activePaths.some((activePath) => {
      if (activePath === '/') return pathname === '/';
      return pathname === activePath || pathname.startsWith(`${activePath}/`);
    });
  };

  return (
    <nav
      aria-label="하단 내비게이션"
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 ${className}`}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 rounded-full bg-white py-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
        {items.map((item) => {
          const active = isActivePath(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center font-bold transition-all ${
                active ? 'text-3xl text-brand-500' : 'text-2xl text-gray-800 hover:text-brand-500'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

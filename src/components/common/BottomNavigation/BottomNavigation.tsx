import { NavLink, useLocation } from 'react-router-dom';

type NavigationIconName = 'Home' | 'Speaker' | 'Map' | 'User';

export interface BottomNavigationItem {
  label: string;
  path: string;
  icon: NavigationIconName;
  activePaths?: string[];
}

interface BottomNavigationProps {
  items?: BottomNavigationItem[];
  className?: string;
}

const defaultItems: BottomNavigationItem[] = [
  { label: '홈', path: '/recommendation', icon: 'Home', activePaths: ['/', '/recommendation'] },
  {
    label: '혜택',
    path: '/survey',
    icon: 'Speaker',
    activePaths: ['/benefits', '/survey', '/helper'],
  },
  { label: '지도', path: '/map', icon: 'Map', activePaths: ['/map', '/facility'] },
  { label: '마이', path: '/mypage', icon: 'User', activePaths: ['/mypage'] },
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
      className={`fixed bottom-0 left-1/2 z-40 w-[calc(100%_-_32px)] max-w-sm -translate-x-1/2 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 ${className}`}
    >
      <div className="grid h-[62px] w-full grid-cols-4 items-center rounded-full border border-[#F3EBE2] bg-white px-3 shadow-[0_4px_18px_rgba(71,45,25,0.14)]">
        {items.map((item) => {
          const active = isActivePath(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className="flex min-h-12 min-w-0 items-center justify-center rounded-full transition-transform active:scale-95"
              aria-current={active ? 'page' : undefined}
            >
              <img
                src={`/assets/Icon/Navigation/${item.icon}/${active ? 'Select' : 'Default'}.png`}
                alt=""
                aria-hidden
                className="h-[38px] w-auto max-w-full object-contain"
              />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

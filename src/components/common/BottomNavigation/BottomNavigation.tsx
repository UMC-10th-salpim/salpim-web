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
      className={`fixed inset-x-0 bottom-0 z-40 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 ${className}`}
    >
      <div className="mx-auto grid h-14 w-full max-w-sm grid-cols-4 items-center rounded-full border border-[#F3EBE2] bg-white px-2 shadow-[0_4px_18px_rgba(71,45,25,0.14)]">
        {items.map((item) => {
          const active = isActivePath(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex min-h-11 items-center justify-center rounded-full text-[20px] font-extrabold transition-colors ${
                active ? 'text-[#FF7A32]' : 'text-[#806B56] hover:text-[#FF7A32]'
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

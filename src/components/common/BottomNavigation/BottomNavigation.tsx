import { NavLink, useLocation } from 'react-router-dom';

type IconName = 'home' | 'benefit' | 'map' | 'user';

export interface BottomNavigationItem {
  label: string;
  path: string;
  icon: IconName;
  activePaths?: string[];
}

interface BottomNavigationProps {
  items?: BottomNavigationItem[];
  className?: string;
}

const defaultItems: BottomNavigationItem[] = [
  { label: '홈', path: '/recommendation', icon: 'home', activePaths: ['/', '/recommendation'] },
  { label: '혜택', path: '/benefits', icon: 'benefit', activePaths: ['/benefits'] },
  { label: '지도', path: '/map', icon: 'map', activePaths: ['/map', '/facility'] },
  { label: '마이', path: '/mypage', icon: 'user', activePaths: ['/mypage'] },
];

const NavigationIcon = ({ name, active }: { name: IconName; active: boolean }) => {
  const stroke = active ? 'currentColor' : 'currentColor';
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'benefit') {
    return (
      <svg {...commonProps}>
        <path d="M4 11v4a2 2 0 0 0 2 2h2l5 3V6L8 9H6a2 2 0 0 0-2 2z" />
        <path d="M16 9a4 4 0 0 1 0 6" />
        <path d="M19 6a8 8 0 0 1 0 12" />
      </svg>
    );
  }

  if (name === 'map') {
    return (
      <svg {...commonProps}>
        <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg {...commonProps}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M3 11.5 12 3l9 8.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
};

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
      className={`fixed inset-x-0 bottom-0 z-40 mx-auto max-w-screen-sm border-t border-gray-900 bg-white pb-[env(safe-area-inset-bottom)] ${className}`}
    >
      <div className="grid h-16 grid-cols-4">
        {items.map((item) => {
          const active = isActivePath(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex min-w-0 flex-col items-center justify-center gap-0.5 text-[13px] font-medium leading-none transition-colors ${
                active ? 'text-[#FF8A3D]' : 'text-gray-900 hover:text-[#FF8A3D]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <NavigationIcon name={item.icon} active={active} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

import { NavLink, useLocation } from 'react-router-dom';

const HOME_NAVIGATION_ITEMS = [
  { label: '홈', path: '/recommendation', activePaths: ['/', '/recommendation'] },
  { label: '혜택', path: '/survey', activePaths: ['/benefits', '/survey'] },
  { label: '지도', path: '/map', activePaths: ['/map', '/facility'] },
  { label: '마이', path: '/mypage', activePaths: ['/mypage'] },
];

const HomeBottomNavigation = () => {
  const { pathname } = useLocation();

  const isActivePath = (activePaths: string[]) => {
    return activePaths.some((activePath) => {
      if (activePath === '/') return pathname === '/';
      return pathname === activePath || pathname.startsWith(`${activePath}/`);
    });
  };

  return (
    <nav
      aria-label="하단 내비게이션"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(35px,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto grid h-[60px] w-[310px] grid-cols-4 items-center rounded-[30px] border border-[#F3EBE2] bg-white px-2 shadow-[0_4px_18px_rgba(71,45,25,0.14)]">
        {HOME_NAVIGATION_ITEMS.map((item) => {
          const active = isActivePath(item.activePaths);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`salpim-home-nav flex items-center justify-center font-bold transition-all ${
                active ? 'text-[#FF8A3D]' : 'text-[#8B7355] hover:text-brand-500'
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

export default HomeBottomNavigation;

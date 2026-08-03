import Router from '@/router/Router';
import useSettingsStore from '@/store/settingsStore';

const App = () => {
  const fontSize = useSettingsStore((state) => state.fontSize);

  return (
    <div data-font-size={fontSize} className="min-h-[100svh]">
      <Router />
    </div>
  );
};

export default App;

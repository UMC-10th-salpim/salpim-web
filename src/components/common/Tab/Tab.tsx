export interface TabItem {
  key: string;
  label: string;
}

interface TabProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

const Tab = ({ tabs, activeKey, onChange, className = '' }: TabProps) => {
  return (
    <div role="tablist" className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;

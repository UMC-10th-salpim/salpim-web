import { useState } from "react";
import Chip from "../Chip/Chip";

interface FilterDropdownProps {
  label: string;           // "건강·의료", "생활지원"
  options: string[];       // 세부 항목 목록
  selected: string[];      // 선택된 항목들
  onSelect: (value: string) => void;  // 선택/해제 함수
}

export default function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  console.log(`${label} 열려있나요?`, isOpen);
  console.log(`${label} 선택된 항목:`, selected);

  return (
    <div className="relative">
      {/* 건강·의료 ▼ 버튼 */}
      <button
        className="cursor-pointer flex items-center gap-1 rounded-full border border-[#FF8A3D] px-4 py-1.5 text-sm text-[#FF8A3D]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* 열리면 Chip 목록 나옴 */}
      {isOpen && (
        <div className="absolute z-10 mt-1 rounded-xl border border-[#FF8A3D] bg-white shadow-md p-2 flex flex-wrap gap-2">
          {options.map((option) => (
        <Chip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => onSelect(option)}
        />
          ))}
        </div>
      )}
    </div>
  );
}
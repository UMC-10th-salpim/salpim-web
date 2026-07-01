interface InputProps {
  value: string;
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void; //값이 바뀔 때
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "password" | "number" | "tel";
  label?: string;
}
const Input = ({value, onChange, placeholder, disabled, type="text", label}: InputProps) => {
  console.log("현재 입력된 값:", value);
  console.log("disabled 상태: ", disabled);

  return (
    <div className="w-full flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-grap-700">{label}</span>
      )}
      <input 
        className="
          w-full px-4 py-3
          rounded-4xl border border-[#FF8A3D]
          text-sm text-gray-700
          placeholder:text-gray-300
          outline-none
          disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
        "
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}/>
    </div>
  );
};

export default Input;

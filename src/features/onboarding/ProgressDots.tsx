interface ProgressDotsProps {
  total: number;
  current: number;
}

const ProgressDots = ({ total, current }: ProgressDotsProps) => (
  <div className="mb-2 flex shrink-0 items-center justify-center gap-5 pt-4">
    {Array.from({ length: total }).map((_, index) => (
      <span
        key={index}
        className={`size-5 rounded-full transition-colors ${
          index === current ? 'bg-[#FFB700]' : 'bg-[#DDDDDD]'
        }`}
      />
    ))}
  </div>
);

export default ProgressDots;

interface ProgressDotsProps {
  total: number;
  current: number;
}

const ProgressDots = ({ total, current }: ProgressDotsProps) => (
  <div className="mb-6 flex shrink-0 items-center justify-center gap-2 pt-2">
    {Array.from({ length: total }).map((_, index) => (
      <span
        key={index}
        className={`h-2 rounded-full transition-all ${
          index === current ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
        }`}
      />
    ))}
  </div>
);

export default ProgressDots;

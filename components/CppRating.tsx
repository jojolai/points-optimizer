import { getCppRating, formatCpp } from '@/lib/calculations';

interface CppRatingProps {
  cpp: number;
  size?: 'sm' | 'md' | 'lg';
}

const ratingColors: Record<string, string> = {
  Excellent: '#16a34a', // green-600
  Good: '#2563eb',      // blue-600
  Average: '#ca8a04',   // yellow-600
  Poor: '#dc2626',      // red-600
};

export default function CppRating({ cpp, size = 'md' }: CppRatingProps) {
  const rating = getCppRating(cpp);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const badgeSizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div className="text-center">
      <div
        className={`font-bold ${sizeClasses[size]}`}
        style={{ color: ratingColors[rating.label] }}
      >
        {formatCpp(cpp)}
      </div>
      <div
        className={`inline-block mt-2 rounded-full font-medium ${badgeSizeClasses[size]} ${
          rating.label === 'Excellent'
            ? 'bg-green-100 text-green-700'
            : rating.label === 'Good'
            ? 'bg-blue-100 text-blue-700'
            : rating.label === 'Average'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {rating.label}
      </div>
      <p className="text-sm text-gray-500 mt-2">{rating.description}</p>
    </div>
  );
}

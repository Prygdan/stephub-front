import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating, className }: { rating: number, className?: string }) => {
  // округлення до найближчої половини
  const roundedRating = Math.round(rating * 2) / 2;

  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {/* Повні зірки */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="#facc15" stroke="#facc15" className="w-5 h-5" />
      ))}

      {/* Половинна зірка */}
      {halfStar && (
        <Star
          key="half"
          className="w-5 h-5"
          fill="url(#half-gradient)"
          stroke="#facc15"
        />
      )}

      {/* Порожні зірки */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} fill="none" stroke="#facc15" className="w-5 h-5" />
      ))}

      {/* Градієнт для половинної зірки */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half-gradient">
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

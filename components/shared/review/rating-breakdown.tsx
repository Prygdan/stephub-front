import { RatingStat } from "@/services/product-reviews/product-review";

interface Props {
  stats: RatingStat[];
};

export const RatingBreakdown = ({ stats }: Props) => {
  return (
    <div className="space-y-2">
      {stats.map((item) => (
        <div key={item.rating} className="flex items-center gap-2">
          <span className="block w-18 text-sm font-medium">{item.rating} зірка</span>
          <div className="relative flex-1 h-3 bg-gray-200">
            <div
              className="absolute top-0 left-0 h-3 bg-yellow-400"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <span className="w-12 text-sm text-right">{item.percentage}%</span>
        </div>
      ))}
    </div>
  );
};
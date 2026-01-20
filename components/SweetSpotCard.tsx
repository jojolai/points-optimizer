import { SweetSpot, TransferPartner } from '@/lib/types';
import { formatCpp, getCppRating } from '@/lib/calculations';

interface SweetSpotCardProps {
  sweetSpot: SweetSpot & {
    sourcePointsRequired: number;
    viaPartner: TransferPartner;
  };
  currencyName: string;
}

const ratingColors: Record<string, string> = {
  Excellent: '#16a34a', // green-600
  Good: '#2563eb',      // blue-600
  Average: '#ca8a04',   // yellow-600
  Poor: '#dc2626',      // red-600
};

export default function SweetSpotCard({ sweetSpot, currencyName }: SweetSpotCardProps) {
  const rating = getCppRating(sweetSpot.cpp);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                sweetSpot.category === 'flight'
                  ? 'bg-sky-100 text-sky-700'
                  : sweetSpot.category === 'hotel'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {sweetSpot.category === 'flight'
                ? '✈️ Flight'
                : sweetSpot.category === 'hotel'
                ? '🏨 Hotel'
                : '⬆️ Upgrade'}
            </span>
            {sweetSpot.cabin && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {sweetSpot.cabin}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{sweetSpot.name}</h3>
          {sweetSpot.route && (
            <p className="text-sm text-gray-500 mt-0.5">{sweetSpot.route}</p>
          )}
        </div>
        <div className="text-right ml-4">
          <div
            className="text-xl font-bold"
            style={{ color: ratingColors[rating.label] }}
          >
            {formatCpp(sweetSpot.cpp)}
          </div>
          <div className="text-xs text-gray-500">{rating.label}</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{sweetSpot.description}</p>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Via</span>
          <span className="font-medium text-gray-900">{sweetSpot.viaPartner.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Partner points needed</span>
          <span className="font-medium text-gray-900">
            {sweetSpot.pointsRequired.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{currencyName} needed</span>
          <span className="font-medium text-blue-600">
            {sweetSpot.sourcePointsRequired.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-500">Estimated cash value</span>
          <span className="font-medium text-green-600">
            ${sweetSpot.estimatedCashValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

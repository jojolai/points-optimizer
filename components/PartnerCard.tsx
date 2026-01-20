import { EffectivePartner } from '@/lib/types';
import { formatCpp, formatRatio, getCppRating } from '@/lib/calculations';

interface PartnerCardProps {
  partner: EffectivePartner;
  baseCpp: number;
}

export default function PartnerCard({ partner, baseCpp }: PartnerCardProps) {
  const rating = getCppRating(partner.effectiveCpp);
  const improvement = ((partner.effectiveCpp - baseCpp) / baseCpp) * 100;
  const isImprovement = improvement > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{partner.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                partner.type === 'airline'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {partner.type === 'airline' ? '✈️ Airline' : '🏨 Hotel'}
            </span>
            {partner.alliance && (
              <span className="text-xs text-gray-500">{partner.alliance}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${rating.color}`}>
            {formatCpp(partner.effectiveCpp)}
          </div>
          <div className="text-xs text-gray-500">{rating.label}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Transfer Ratio</div>
          <div className="font-medium">{formatRatio(partner.ratio)}</div>
        </div>
        <div>
          <div className="text-gray-500">Partner Base CPP</div>
          <div className="font-medium">{formatCpp(partner.baselineCpp)}</div>
        </div>
      </div>

      {isImprovement && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-green-600 font-medium">
            ↑ {improvement.toFixed(0)}% better than direct redemption
          </span>
        </div>
      )}
    </div>
  );
}

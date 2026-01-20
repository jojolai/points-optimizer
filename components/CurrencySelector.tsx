'use client';

import { PointsCurrency } from '@/lib/types';

interface CurrencySelectorProps {
  currencies: PointsCurrency[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CurrencySelector({
  currencies,
  selectedId,
  onSelect,
}: CurrencySelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Points Currency
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {currencies.map((currency) => (
          <button
            key={currency.id}
            onClick={() => onSelect(currency.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedId === currency.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: currency.color }}
            />
            <div className="font-medium text-gray-900">{currency.issuer}</div>
            <div className="text-sm text-gray-500">{currency.name}</div>
            <div className="text-xs text-gray-400 mt-1">
              Base: {currency.baselineCpp}¢/pt
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

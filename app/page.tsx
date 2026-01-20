'use client';

import { useState } from 'react';
import CurrencySelector from '@/components/CurrencySelector';
import PartnerCard from '@/components/PartnerCard';
import { getEffectivePartners } from '@/lib/calculations';
import { PointsCurrency, TransferPartner } from '@/lib/types';
import currenciesData from '@/data/currencies.json';
import partnersData from '@/data/partners.json';

const currencies = currenciesData as PointsCurrency[];
const partners = partnersData as TransferPartner[];

export default function Home() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'airline' | 'hotel'>('all');

  const selectedCurrency = currencies.find((c) => c.id === selectedCurrencyId);
  const effectivePartners = selectedCurrency
    ? getEffectivePartners(selectedCurrency, partners)
    : [];

  const filteredPartners =
    filterType === 'all'
      ? effectivePartners
      : effectivePartners.filter((p) => p.type === filterType);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transfer Partner Finder
        </h1>
        <p className="text-gray-600">
          Select your points currency to see all transfer partners ranked by value
        </p>
      </div>

      <CurrencySelector
        currencies={currencies}
        selectedId={selectedCurrencyId}
        onSelect={setSelectedCurrencyId}
      />

      {selectedCurrency && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Transfer Partners for {selectedCurrency.issuer} {selectedCurrency.name}
            </h2>
            <div className="flex gap-2">
              {(['all', 'airline', 'hotel'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterType === type
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredPartners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedCurrency.transferPartners.length === 0
                ? 'This program does not have transfer partners'
                : 'No partners match your filter'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  baseCpp={selectedCurrency.baselineCpp}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedCurrency && (
        <div className="mt-12 text-center text-gray-500">
          Select a points currency above to see transfer partners
        </div>
      )}
    </div>
  );
}

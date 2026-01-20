'use client';

import { useState } from 'react';
import SweetSpotCard from '@/components/SweetSpotCard';
import { getAccessibleSweetSpots } from '@/lib/calculations';
import { PointsCurrency, TransferPartner, SweetSpot } from '@/lib/types';
import currenciesData from '@/data/currencies.json';
import partnersData from '@/data/partners.json';
import sweetSpotsData from '@/data/sweetspots.json';

const currencies = currenciesData as PointsCurrency[];
const partners = partnersData as TransferPartner[];
const sweetSpots = sweetSpotsData as SweetSpot[];

export default function SweetSpotsPage() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'flight' | 'hotel'>('all');

  const selectedCurrency = currencies.find((c) => c.id === selectedCurrencyId);

  const accessibleSpots = selectedCurrency
    ? getAccessibleSweetSpots(selectedCurrency, sweetSpots, partners)
    : [];

  const filteredSpots =
    filterCategory === 'all'
      ? accessibleSpots
      : accessibleSpots.filter((s) => s.category === filterCategory);

  // For showing all sweet spots when no currency selected
  const allSpotsWithPartners = sweetSpots.map((spot) => {
    const partner = partners.find((p) => p.id === spot.partnerId);
    return {
      ...spot,
      sourcePointsRequired: spot.pointsRequired,
      viaPartner: partner!,
    };
  }).filter(s => s.viaPartner);

  const displaySpots = selectedCurrency ? filteredSpots :
    (filterCategory === 'all' ? allSpotsWithPartners : allSpotsWithPartners.filter(s => s.category === filterCategory));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sweet Spot Finder</h1>
        <p className="text-gray-600">
          Discover high-value redemption opportunities
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Your Points Currency
          </label>
          <select
            value={selectedCurrencyId}
            onChange={(e) => setSelectedCurrencyId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All sweet spots (no filter)</option>
            {currencies
              .filter((c) => c.transferPartners.length > 0)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.issuer} {c.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="flex gap-2">
            {(['all', 'flight', 'hotel'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-3 text-sm rounded-lg border transition-colors ${
                  filterCategory === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCurrency && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing sweet spots accessible with{' '}
            <strong>
              {selectedCurrency.issuer} {selectedCurrency.name}
            </strong>
            . Point requirements are calculated based on transfer ratios.
          </p>
        </div>
      )}

      {displaySpots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No sweet spots found for your selection
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displaySpots.map((spot) => (
            <SweetSpotCard
              key={spot.id}
              sweetSpot={spot}
              currencyName={
                selectedCurrency
                  ? `${selectedCurrency.issuer} ${selectedCurrency.name}`
                  : spot.viaPartner.name
              }
            />
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-amber-50 rounded-lg">
        <h3 className="font-semibold text-amber-900 mb-2">
          About Sweet Spots
        </h3>
        <p className="text-sm text-amber-800">
          Sweet spots are redemption opportunities that offer exceptional value—often
          2x or more the typical cents-per-point. These deals exist due to award chart
          quirks, partner agreements, or promotional offers. Values shown are estimates
          and actual availability varies.
        </p>
      </div>
    </div>
  );
}

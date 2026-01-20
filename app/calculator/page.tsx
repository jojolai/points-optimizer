'use client';

import { useState } from 'react';
import CppRating from '@/components/CppRating';
import { calculateRedemptionCpp, formatCpp } from '@/lib/calculations';
import { PointsCurrency, TransferPartner } from '@/lib/types';
import currenciesData from '@/data/currencies.json';
import partnersData from '@/data/partners.json';

const currencies = currenciesData as PointsCurrency[];
const partners = partnersData as TransferPartner[];

export default function CalculatorPage() {
  const [cashPrice, setCashPrice] = useState<string>('');
  const [pointsRequired, setPointsRequired] = useState<string>('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

  const cashValue = parseFloat(cashPrice) || 0;
  const pointsValue = parseFloat(pointsRequired) || 0;
  const cpp = calculateRedemptionCpp(cashValue, pointsValue);

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);
  const comparisonDiff = selectedPartner ? cpp - selectedPartner.baselineCpp : 0;

  const isValidCalculation = cashValue > 0 && pointsValue > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Redemption Calculator
        </h1>
        <p className="text-gray-600">
          Calculate the cents-per-point value of any redemption
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash Price (what you&apos;d pay with money)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={cashPrice}
                  onChange={(e) => setCashPrice(e.target.value)}
                  placeholder="500"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points Required
              </label>
              <input
                type="number"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare to Program (optional)
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a program...</option>
                <optgroup label="Airlines">
                  {partners
                    .filter((p) => p.type === 'airline')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (baseline: {formatCpp(p.baselineCpp)})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Hotels">
                  {partners
                    .filter((p) => p.type === 'hotel')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (baseline: {formatCpp(p.baselineCpp)})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>

          {isValidCalculation && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <CppRating cpp={cpp} size="lg" />

              {selectedPartner && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 text-center">
                    Compared to {selectedPartner.name} baseline ({formatCpp(selectedPartner.baselineCpp)}):
                  </div>
                  <div
                    className={`text-center text-lg font-semibold mt-1 ${
                      comparisonDiff > 0 ? 'text-green-600' : comparisonDiff < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {comparisonDiff > 0 ? '+' : ''}
                    {formatCpp(comparisonDiff)} ({comparisonDiff > 0 ? 'above' : comparisonDiff < 0 ? 'below' : 'at'} average)
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to use this calculator</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Find the cash price for your flight, hotel, or purchase</li>
            <li>Find how many points are required for the same redemption</li>
            <li>Enter both values to see your cents-per-point value</li>
            <li>Compare against the program baseline to see if it&apos;s a good deal</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

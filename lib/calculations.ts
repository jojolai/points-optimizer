import { PointsCurrency, TransferPartner, EffectivePartner, SweetSpot } from './types';

export function calculateEffectiveCpp(
  baselineCpp: number,
  transferRatio: number
): number {
  // Effective CPP = partner's baseline CPP * transfer ratio
  // If ratio is 1, you get 1 partner point per source point
  // If ratio is 2, you get 2 partner points per source point (bonus!)
  // If ratio is 0.5, you get 0.5 partner points per source point
  return baselineCpp * transferRatio;
}

export function getEffectivePartners(
  currency: PointsCurrency,
  partners: TransferPartner[]
): EffectivePartner[] {
  return currency.transferPartners
    .map((link) => {
      const partner = partners.find((p) => p.id === link.partnerId);
      if (!partner) return null;

      const effectiveCpp = calculateEffectiveCpp(partner.baselineCpp, link.ratio);

      return {
        ...partner,
        ratio: link.ratio,
        effectiveCpp,
      };
    })
    .filter((p): p is EffectivePartner => p !== null)
    .sort((a, b) => b.effectiveCpp - a.effectiveCpp);
}

export function calculateRedemptionCpp(
  cashPrice: number,
  pointsRequired: number
): number {
  if (pointsRequired === 0) return 0;
  return (cashPrice / pointsRequired) * 100; // Convert to cents per point
}

export function getCppRating(cpp: number): {
  label: string;
  color: string;
  description: string;
} {
  if (cpp >= 2.0) {
    return {
      label: 'Excellent',
      color: 'text-green-600',
      description: 'Outstanding value! This is a great redemption.',
    };
  }
  if (cpp >= 1.5) {
    return {
      label: 'Good',
      color: 'text-blue-600',
      description: 'Above average value. Solid redemption.',
    };
  }
  if (cpp >= 1.0) {
    return {
      label: 'Average',
      color: 'text-yellow-600',
      description: 'Fair value. Consider if you have better options.',
    };
  }
  return {
    label: 'Poor',
    color: 'text-red-600',
    description: 'Below average. You might get better value elsewhere.',
  };
}

export function formatCpp(cpp: number): string {
  return `${cpp.toFixed(2)}¢`;
}

export function formatRatio(ratio: number): string {
  if (ratio === 1) return '1:1';
  if (ratio > 1) return `1:${ratio}`; // Bonus transfer
  return `${Math.round(1 / ratio)}:1`; // Requires multiple source points
}

export function getAccessibleSweetSpots(
  currency: PointsCurrency,
  sweetSpots: SweetSpot[],
  partners: TransferPartner[]
): (SweetSpot & { sourcePointsRequired: number; viaPartner: TransferPartner })[] {
  const partnerIds = currency.transferPartners.map((tp) => tp.partnerId);

  return sweetSpots
    .filter((spot) => partnerIds.includes(spot.partnerId))
    .map((spot) => {
      const link = currency.transferPartners.find((tp) => tp.partnerId === spot.partnerId);
      const partner = partners.find((p) => p.id === spot.partnerId);

      if (!link || !partner) return null;

      // Calculate how many source points needed
      const sourcePointsRequired = Math.ceil(spot.pointsRequired / link.ratio);

      return {
        ...spot,
        sourcePointsRequired,
        viaPartner: partner,
      };
    })
    .filter((spot): spot is NonNullable<typeof spot> => spot !== null)
    .sort((a, b) => b.cpp - a.cpp);
}

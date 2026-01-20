export interface TransferPartner {
  id: string;
  name: string;
  type: 'airline' | 'hotel';
  baselineCpp: number;
  alliance?: string;
}

export interface TransferPartnerLink {
  partnerId: string;
  ratio: number; // 1 = 1:1, 0.5 = 2:1 (you need 2 source points for 1 partner point)
}

export interface PointsCurrency {
  id: string;
  name: string;
  issuer: string;
  baselineCpp: number;
  color: string;
  transferPartners: TransferPartnerLink[];
}

export interface SweetSpot {
  id: string;
  name: string;
  description: string;
  partnerId: string;
  pointsRequired: number;
  estimatedCashValue: number;
  cpp: number;
  category: 'flight' | 'hotel' | 'upgrade';
  route?: string;
  cabin?: string;
}

export interface EffectivePartner extends TransferPartner {
  ratio: number;
  effectiveCpp: number;
}

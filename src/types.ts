export type KoshaCategory = 'all' | 'women' | 'men' | 'traditional' | 'royal_vip';

export type HallSize = 'all' | 'small' | 'medium' | 'large';

export type EventTimeSlot = 'morning' | 'evening' | 'full_day';

export type BookingStatus = 'pending' | 'confirmed' | 'in_preparation' | 'completed' | 'cancelled';

export type PaymentMethod = 'kuraimi' | 'alnejm' | 'onecash' | 'cash_on_delivery';

export interface KoshaAddon {
  id: string;
  name: string;
  description: string;
  priceYER: number;
}

export interface KoshaDimensions {
  width: string;  // e.g. "6.5 متر"
  height: string; // e.g. "3.8 متر"
  depth: string;  // e.g. "2.5 متر"
}

export interface KoshaThemeColor {
  name: string;
  hex: string;
}

export interface Kosha {
  id: string;
  name: string;
  himyariteTag?: string; // e.g. "𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • طراز ملكي حميري"
  category: 'women' | 'men' | 'traditional' | 'royal_vip';
  categoryLabel: string;
  hallSize: 'small' | 'medium' | 'large';
  hallSizeLabel: string;
  priceYER: number;
  priceUSD: number;
  depositYER: number;
  images: string[];
  dimensions: KoshaDimensions;
  hallCompatibility: string[];
  features: string[];
  includedEquipment: string[];
  description: string;
  themeColors: KoshaThemeColor[];
  flowerColorOptions: string[];
  seatingOptions: string[];
  lightingModes: string[];
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CustomizationSelections {
  flowerColor: string;
  seatingStyle: string;
  lightingMode: string;
  carpetStyle: string;
  customAcrylicNames: {
    enabled: boolean;
    groomName: string;
    brideName: string;
  };
  selectedAddonIds: string[];
}

export interface BookingRequest {
  id: string;
  bookingCode: string;
  koshaId: string;
  koshaName: string;
  koshaImage: string;
  category: 'women' | 'men' | 'traditional' | 'royal_vip';
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerCity: string;
  hallName: string;
  hallAddress: string;
  eventDate: string;
  timeSlot: EventTimeSlot;
  customization: CustomizationSelections;
  basePriceYER: number;
  addonsPriceYER: number;
  totalPriceYER: number;
  depositAmountYER: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'owner';
  senderName: string;
  text: string;
  timestamp: string;
  relatedKoshaId?: string;
  relatedKoshaName?: string;
  relatedBookingCode?: string;
}

export interface YemeniHall {
  id: string;
  name: string;
  city: string;
  area: string;
  type: 'women' | 'men' | 'both';
  capacity: string;
  recommendedKoshas: string[];
}

export interface Review {
  id: string;
  author: string;
  city: string;
  hall: string;
  koshaName: string;
  rating: number;
  date: string;
  comment: string;
}

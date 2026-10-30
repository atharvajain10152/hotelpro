import { TAX_RATE_PERCENT } from '../config/constants.js';

export class PricingService {
  /**
   * Authoritative calculation of reservation pricing
   * @param {Object} params
   * @param {number} params.basePrice - Room category nightly base rate
   * @param {Date|string} params.checkInDate
   * @param {Date|string} params.checkOutDate
   * @param {number} params.adults
   * @param {number} params.children
   * @param {string} [params.couponCode]
   * @returns {Object} itemized price breakdown
   */
  static calculatePricing({
    basePrice,
    checkInDate,
    checkOutDate,
    adults = 1,
    children = 0,
    couponCode = ''
  }) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Calculate nights using half-open interval [start, end)
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      throw new Error('Check-out date must be at least 1 night after check-in date.');
    }

    const roomSubtotal = basePrice * nights;

    // Extra guest fee if adults > 2: ₹1,000 per extra adult per night
    let extraGuestFee = 0;
    if (adults > 2) {
      extraGuestFee = (adults - 2) * 1000 * nights;
    }

    // Children fee: ₹500 per child if children > 1 per night
    if (children > 1) {
      extraGuestFee += (children - 1) * 500 * nights;
    }

    // Coupon discount logic
    let discount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === 'HOTELPRO10') {
        discount = Math.round(roomSubtotal * 0.10); // 10% off
      } else if (code === 'LUXURY20') {
        discount = Math.round(roomSubtotal * 0.20); // 20% off
      }
    }

    const taxableAmount = Math.max(0, roomSubtotal + extraGuestFee - discount);
    const taxesAndFees = Math.round((taxableAmount * TAX_RATE_PERCENT) / 100);
    const totalAmount = taxableAmount + taxesAndFees;

    return {
      baseNightlyRate: basePrice,
      nights,
      roomSubtotal,
      extraGuestFee,
      taxesAndFees,
      discount,
      totalAmount,
      currency: 'INR'
    };
  }
}


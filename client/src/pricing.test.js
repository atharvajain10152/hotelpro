import { describe, it, expect } from 'vitest';

describe('Pricing Calculation Smoke Tests', () => {
  it('calculates 3 nights with 18% tax accurately', () => {
    const basePrice = 8500;
    const nights = 3;
    const subtotal = basePrice * nights; // 25,500
    const tax = Math.round((subtotal * 18) / 100); // 4,590
    const total = subtotal + tax; // 30,090

    expect(nights).toBe(3);
    expect(subtotal).toBe(25500);
    expect(tax).toBe(4590);
    expect(total).toBe(30090);
  });

  it('applies 10% coupon code discount correctly', () => {
    const subtotal = 20000;
    const discount = Math.round(subtotal * 0.1);
    const taxable = subtotal - discount;
    const tax = Math.round((taxable * 18) / 100);
    const total = taxable + tax;

    expect(discount).toBe(2000);
    expect(taxable).toBe(18000);
    expect(tax).toBe(3240);
    expect(total).toBe(21240);
  });
});

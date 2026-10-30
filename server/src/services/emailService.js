import nodemailer from 'nodemailer';

export class EmailService {
  static getTransporter() {
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_USER !== 'test_smtp_user'
    ) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT == '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    }

    // Dev fallback mock transporter that logs without network dependency
    return {
      sendMail: async (options) => {
        console.log(`\n================= [HOTELPRO TRANSACTIONAL EMAIL] =================`);
        console.log(`TO: ${options.to}`);
        console.log(`SUBJECT: ${options.subject}`);
        console.log(`CONTENT PREVIEW: ${options.text || options.subject}`);
        console.log(`===================================================================\n`);
        return { messageId: `mock_${Date.now()}` };
      }
    };
  }

  static async sendBookingConfirmation(booking, recipientEmail) {
    const transporter = this.getTransporter();
    const hotelName = booking.hotelId?.name || 'HotelPro Luxury Suites';
    const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a1e24; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; color: #d4af37;">HOTELPRO</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.85;">Luxury Hospitality & Reservation</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #111827; margin-top: 0;">Your Reservation is Confirmed!</h2>
          <p style="color: #4b5563; font-size: 15px;">Dear ${booking.guestSnapshot.name},</p>
          <p style="color: #4b5563; font-size: 15px;">Thank you for choosing <strong>${hotelName}</strong>. Your reservation has been confirmed and payment processed.</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Booking Reference:</strong> <span style="font-family: monospace; color: #2563eb; font-weight: bold;">${booking.bookingReference}</span></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Check-in:</strong> ${checkIn} (from 14:00)</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Check-out:</strong> ${checkOut} (until 11:00)</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Nights:</strong> ${booking.nights}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Total Paid:</strong> ₹${booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 13px;">Please present a valid photo ID and this booking reference at the front desk upon check-in.</p>
        </div>
      </div>
    `;

    return await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'HotelPro Reservations <no-reply@hotelpro.com>',
      to: recipientEmail,
      subject: `Booking Confirmed: ${booking.bookingReference} - ${hotelName}`,
      html,
      text: `Your reservation at ${hotelName} (${booking.bookingReference}) is confirmed. Total: ₹${booking.pricingBreakdown.totalAmount}`
    });
  }
}


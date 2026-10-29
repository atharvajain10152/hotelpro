import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

// Prevent multiple reviews for the same booking
reviewSchema.index({ guestId: 1, bookingId: 1 }, { unique: true });
reviewSchema.index({ hotelId: 1, createdAt: -1 });

// Static method to recalculate hotel average rating
reviewSchema.statics.calculateAverageRating = async function (hotelId) {
  const stats = await this.aggregate([
    { $match: { hotelId: new mongoose.Types.ObjectId(hotelId), status: 'approved' } },
    {
      $group: {
        _id: '$hotelId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  const Hotel = mongoose.model('Hotel');
  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.hotelId);
});

export default mongoose.model('Review', reviewSchema);

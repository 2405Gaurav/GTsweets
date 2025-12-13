import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a sweet name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'chocolate',
        'candy',
        'gummy',
        'lollipop',
        'marshmallow',
        'hard-candy',
        'sour-candy',
        'gum',
        'mints',
        'licorice',
        'caramel',
        'other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes for search functionality
sweetSchema.index({ name: 'text', category: 1 });
sweetSchema.index({ price: 1 });
sweetSchema.index({ category: 1, price: 1 });

export const Sweet = mongoose.model<ISweet>('Sweet', sweetSchema);
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  _id?: Types.ObjectId;
  sweetId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtTime: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  status: 'active' | 'checkout' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  sweetId: {
    type: Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  priceAtTime: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
});

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    status: {
      type: String,
      enum: ['active', 'checkout', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Ensure one active cart per user
cartSchema.index({ userId: 1, status: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IEmergencyContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    relationship: { type: String, required: [true, 'Relationship is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
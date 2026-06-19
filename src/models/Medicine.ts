import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'thrice_daily' | 'as_needed';
  timing: string[];
  startDate: Date;
  endDate?: Date;
  isLongTerm: boolean;
  prescribedBy?: string;
  notes?: string;
  isActive: boolean;
  refillDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    name: { type: String, required: [true, 'Medicine name is required'], trim: true },
    dosage: { type: String, required: [true, 'Dosage is required'], trim: true },
    frequency: {
      type: String,
      enum: ['once_daily', 'twice_daily', 'thrice_daily', 'as_needed'],
      required: true
    },
    timing: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isLongTerm: { type: Boolean, default: false },
    prescribedBy: { type: String, default: '' },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    refillDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
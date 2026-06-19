import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  title: string;
  type: 'blood_test' | 'xray' | 'mri' | 'ecg' | 'prescription' | 'other';
  fileUrl: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  notes?: string;
  reportDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    title: { type: String, required: [true, 'Report title is required'], trim: true },
    type: {
      type: String,
      enum: ['blood_test', 'xray', 'mri', 'ecg', 'prescription', 'other'],
      required: true
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    notes: { type: String, default: '' },
    reportDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
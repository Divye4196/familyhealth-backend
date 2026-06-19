import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthRecord extends Document {
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  type: 'bp' | 'sugar' | 'weight' | 'heart_rate' | 'spo2' | 'temperature';
  values: {
    systolic?: number;
    diastolic?: number;
    sugarValue?: number;
    sugarType?: 'fasting' | 'post_meal' | 'hba1c';
    weight?: number;
    height?: number;
    bmi?: number;
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    temperatureUnit?: 'C' | 'F';
  };
  alert: {
    status: string;
    message: string;
    color: string;
  };
  suddenChange?: string;
  notes?: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    type: {
      type: String,
      enum: ['bp', 'sugar', 'weight', 'heart_rate', 'spo2', 'temperature'],
      required: true
    },
    values: {
      systolic: Number,
      diastolic: Number,
      sugarValue: Number,
      sugarType: { type: String, enum: ['fasting', 'post_meal', 'hba1c'] },
      weight: Number,
      height: Number,
      bmi: Number,
      heartRate: Number,
      spo2: Number,
      temperature: Number,
      temperatureUnit: { type: String, enum: ['C', 'F'], default: 'F' }
    },
    alert: {
      status: { type: String, default: 'Normal' },
      message: { type: String, default: '' },
      color: { type: String, default: 'green' }
    },
    suddenChange: { type: String, default: '' },
    notes: { type: String, default: '' },
    recordedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);
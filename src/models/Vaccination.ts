import mongoose, { Document, Schema } from 'mongoose';

export interface IVaccination extends Document {
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  vaccineName: string;
  dateTaken: Date;
  nextDueDate?: Date;
  hospital?: string;
  doseNumber?: number;
  notes?: string;
  status: 'completed' | 'upcoming' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const VaccinationSchema = new Schema<IVaccination>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    vaccineName: { type: String, required: [true, 'Vaccine name is required'], trim: true },
    dateTaken: { type: Date, required: [true, 'Date taken is required'] },
    nextDueDate: { type: Date },
    hospital: { type: String, default: '' },
    doseNumber: { type: Number, default: 1 },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['completed', 'upcoming', 'overdue'], default: 'completed' }
  },
  { timestamps: true }
);

export default mongoose.model<IVaccination>('Vaccination', VaccinationSchema);
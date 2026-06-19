import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  specialization: string;
  phone: string;
  hospital: string;
  address?: string;
  availableDays?: string;
  availableTime?: string;
  assignedMembers: mongoose.Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Doctor name is required'], trim: true },
    specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    hospital: { type: String, required: [true, 'Hospital is required'], trim: true },
    address: { type: String, default: '' },
    availableDays: { type: String, default: '' },
    availableTime: { type: String, default: '' },
    assignedMembers: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }],
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  reason: string;
  location?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctorNotes?: string;
  prescription?: string;
  nextAppointment?: Date;
  remindersSent: {
    sevenDays: boolean;
    threeDays: boolean;
    oneDay: boolean;
    twoHours: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: [true, 'Appointment date is required'] },
    time: { type: String, required: [true, 'Appointment time is required'] },
    reason: { type: String, required: [true, 'Reason is required'], trim: true },
    location: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    doctorNotes: { type: String, default: '' },
    prescription: { type: String, default: '' },
    nextAppointment: { type: Date },
    remindersSent: {
      sevenDays: { type: Boolean, default: false },
      threeDays: { type: Boolean, default: false },
      oneDay: { type: Boolean, default: false },
      twoHours: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import familyRoutes from './routes/familyRoutes';
import healthRoutes from './routes/healthRoutes';
import medicineRoutes from './routes/medicineRoutes';
import doctorRoutes from './routes/doctorRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import vaccinationRoutes from './routes/vaccinationRoutes';
import reportRoutes from './routes/reportRoutes';
import emergencyRoutes from './routes/emergencyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/emergency', emergencyRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FamilyHealth+ API is running!',
    version: '1.0.0'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Auth API: http://localhost:${PORT}/api/auth`);
  });
};

startServer();

export default app;
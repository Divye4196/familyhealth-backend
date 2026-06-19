import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Doctor from '../models/Doctor';

// @route POST /api/doctors
export const addDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Doctor added successfully', doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/doctors
export const getDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctors = await Doctor.find({ userId: req.user._id })
      .populate('assignedMembers', 'name relationship')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/doctors/:id
export const getDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, userId: req.user._id } as any)
      .populate('assignedMembers', 'name relationship');
    if (!doctor) {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }
    res.status(200).json({ success: true, doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route PUT /api/doctors/:id
export const updateDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id } as any,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Doctor updated successfully', doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/doctors/:id
export const deleteDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id } as any
    );
    if (!doctor) {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
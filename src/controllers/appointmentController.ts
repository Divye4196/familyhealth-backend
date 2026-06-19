import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Appointment from '../models/Appointment';

// @route POST /api/appointments
export const addAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/appointments
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = { userId: req.user._id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('memberId', 'name relationship')
      .populate('doctorId', 'name specialization hospital phone')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/appointments/upcoming
export const getUpcomingAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({
      userId: req.user._id,
      status: 'upcoming',
      date: { $gte: new Date() }
    } as any)
      .populate('memberId', 'name relationship')
      .populate('doctorId', 'name specialization hospital phone')
      .sort({ date: 1 })
      .limit(10);

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route PUT /api/appointments/:id
export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id } as any,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Appointment updated successfully', appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/appointments/:id
export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id } as any
    );
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
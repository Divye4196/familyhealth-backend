import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Vaccination from '../models/Vaccination';

// @route POST /api/vaccinations
export const addVaccination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vaccination = await Vaccination.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Vaccination record added successfully', vaccination });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/vaccinations/:memberId
export const getVaccinations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vaccinations = await Vaccination.find({
      userId: req.user._id,
      memberId: req.params.memberId
    } as any).sort({ dateTaken: -1 });

    res.status(200).json({ success: true, count: vaccinations.length, vaccinations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/vaccinations/due/all
export const getDueVaccinations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const vaccinations = await Vaccination.find({
      userId: req.user._id,
      nextDueDate: { $gte: today, $lte: thirtyDaysLater }
    } as any)
      .populate('memberId', 'name relationship')
      .sort({ nextDueDate: 1 });

    res.status(200).json({ success: true, count: vaccinations.length, vaccinations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route PUT /api/vaccinations/:id
export const updateVaccination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vaccination = await Vaccination.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id } as any,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vaccination) {
      res.status(404).json({ success: false, message: 'Vaccination record not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Vaccination updated successfully', vaccination });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/vaccinations/:id
export const deleteVaccination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vaccination = await Vaccination.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id } as any
    );
    if (!vaccination) {
      res.status(404).json({ success: false, message: 'Vaccination record not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Vaccination deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
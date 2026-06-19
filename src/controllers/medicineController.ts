import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Medicine from '../models/Medicine';

// @route POST /api/medicines
export const addMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      medicine
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/medicines/:memberId
export const getMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { active } = req.query;
    const query: any = {
      userId: req.user._id,
      memberId: req.params.memberId
    };
    if (active === 'true') query.isActive = true;

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: medicines.length, medicines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/medicines/today/all
export const getTodayMedicines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicines = await Medicine.find({
      userId: req.user._id,
      isActive: true
    }).populate('memberId', 'name relationship');

    res.status(200).json({ success: true, count: medicines.length, medicines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route PUT /api/medicines/:id
export const updateMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id } as any,
      req.body,
      { new: true, runValidators: true }
    );
    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Medicine updated successfully', medicine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/medicines/:id
export const deleteMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id } as any
    );
    if (!medicine) {
      res.status(404).json({ success: false, message: 'Medicine not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
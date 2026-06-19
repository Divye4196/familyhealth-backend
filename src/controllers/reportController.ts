import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Report from '../models/Report';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

// @route POST /api/reports
export const uploadReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const { memberId, title, type, notes, reportDate } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `familyhealth/${req.user._id}`,
      resource_type: 'auto'
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    const report = await Report.create({
      userId: req.user._id,
      memberId,
      title,
      type,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      notes: notes || '',
      reportDate: reportDate || new Date()
    });

    res.status(201).json({ success: true, message: 'Report uploaded successfully', report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/reports/:memberId
export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const query: any = {
      userId: req.user._id,
      memberId: req.params.memberId
    };
    if (type) query.type = type;

    const reports = await Report.find(query).sort({ reportDate: -1 });
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/reports/all
export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await Report.find({ userId: req.user._id } as any)
      .populate('memberId', 'name relationship')
      .sort({ reportDate: -1 });
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/reports/:id
export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    } as any);

    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(report.publicId);

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
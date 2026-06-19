import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import FamilyMember from '../models/FamilyMember';

// @route   POST /api/family
export const addFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, relationship, age, gender, bloodGroup, allergies, medicalConditions, primaryDoctor } = req.body;

    const member = await FamilyMember.create({
      userId: req.user._id,
      name,
      relationship,
      age,
      gender,
      bloodGroup,
      allergies: allergies || [],
      medicalConditions: medicalConditions || [],
      primaryDoctor: primaryDoctor || ''
    });

    res.status(201).json({
      success: true,
      message: 'Family member added successfully',
      member
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @route   GET /api/family
export const getFamilyMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @route   GET /api/family/:id
export const getFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await FamilyMember.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      member
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @route   PUT /api/family/:id
export const updateFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Family member updated successfully',
      member
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @route   DELETE /api/family/:id
export const deleteFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await FamilyMember.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Family member deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
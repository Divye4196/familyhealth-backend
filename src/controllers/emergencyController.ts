import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import EmergencyContact from '../models/EmergencyContact';
import FamilyMember from '../models/FamilyMember';
import Doctor from '../models/Doctor';

// @route POST /api/emergency/contacts
export const addEmergencyContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await EmergencyContact.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Emergency contact added successfully', contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/emergency/contacts
export const getEmergencyContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user._id } as any).sort({ isPrimary: -1 });
    res.status(200).json({ success: true, count: contacts.length, contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/emergency/contacts/:id
export const deleteEmergencyContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await EmergencyContact.findOneAndDelete(
      { _id: req.params.id, userId: req.user._id } as any
    );
    if (!contact) {
      res.status(404).json({ success: false, message: 'Contact not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/emergency/overview — THE MAIN EMERGENCY SCREEN DATA
export const getEmergencyOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // All family members with blood group, allergies, conditions
    const members = await FamilyMember.find({ userId: req.user._id } as any).select(
      'name relationship bloodGroup allergies medicalConditions'
    );

    // All doctors (for emergency doctor list)
    const doctors = await Doctor.find({ userId: req.user._id } as any).select(
      'name specialization phone hospital'
    );

    // All emergency contacts
    const contacts = await EmergencyContact.find({ userId: req.user._id } as any).sort({ isPrimary: -1 });

    res.status(200).json({
      success: true,
      overview: {
        members,
        doctors,
        contacts
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
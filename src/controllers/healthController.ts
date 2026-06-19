import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import HealthRecord from '../models/HealthRecord';
import {
  getBPAlert,
  getSugarAlert,
  getBMIAlert,
  getHeartRateAlert,
  getSpO2Alert,
  getTemperatureAlert,
  detectSuddenChange
} from '../utils/healthAlerts';

// @route POST /api/health
export const addHealthRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId, type, values, notes, recordedAt } = req.body;

    let alert = { status: 'Normal', message: '', color: 'green' };
    let suddenChange = '';

    if (type === 'bp' && values.systolic && values.diastolic) {
      alert = getBPAlert(values.systolic, values.diastolic);
      const lastRecord = await HealthRecord.findOne(
        { memberId, type: 'bp' } as any
      ).sort({ createdAt: -1 });
      if (lastRecord?.values?.systolic) {
        const change = detectSuddenChange('bp_systolic', values.systolic, lastRecord.values.systolic);
        if (change) suddenChange = change;
      }
    }

    if (type === 'sugar' && values.sugarValue) {
      alert = getSugarAlert(values.sugarValue, values.sugarType || 'fasting');
      const lastRecord = await HealthRecord.findOne(
        { memberId, type: 'sugar' } as any
      ).sort({ createdAt: -1 });
      if (lastRecord?.values?.sugarValue) {
        const change = detectSuddenChange('sugar', values.sugarValue, lastRecord.values.sugarValue);
        if (change) suddenChange = change;
      }
    }

    if (type === 'weight' && values.weight && values.height) {
      const heightInMeters = values.height / 100;
      values.bmi = parseFloat((values.weight / (heightInMeters * heightInMeters)).toFixed(1));
      alert = getBMIAlert(values.bmi);
    }

    if (type === 'heart_rate' && values.heartRate) {
      alert = getHeartRateAlert(values.heartRate);
      const lastRecord = await HealthRecord.findOne(
        { memberId, type: 'heart_rate' } as any
      ).sort({ createdAt: -1 });
      if (lastRecord?.values?.heartRate) {
        const change = detectSuddenChange('heart_rate', values.heartRate, lastRecord.values.heartRate);
        if (change) suddenChange = change;
      }
    }

    if (type === 'spo2' && values.spo2) {
      alert = getSpO2Alert(values.spo2);
    }

    if (type === 'temperature' && values.temperature) {
      alert = getTemperatureAlert(values.temperature, values.temperatureUnit || 'F');
    }

    const record = await HealthRecord.create({
      userId: req.user._id,
      memberId,
      type,
      values,
      alert,
      suddenChange,
      notes: notes || '',
      recordedAt: recordedAt || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Health record added successfully',
      record,
      alert,
      suddenChange: suddenChange || null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/health/:memberId
export const getHealthRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, limit } = req.query;
    const query: any = {
      userId: req.user._id,
      memberId: req.params.memberId
    };
    if (type) query.type = type;

    const records = await HealthRecord.find(query)
      .sort({ recordedAt: -1 })
      .limit(Number(limit) || 50);

    res.status(200).json({ success: true, count: records.length, records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route GET /api/health/:memberId/latest
export const getLatestVitals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const types = ['bp', 'sugar', 'weight', 'heart_rate', 'spo2', 'temperature'];
    const vitals: any = {};

    for (const type of types) {
      const record = await HealthRecord.findOne({
        userId: req.user._id,
        memberId: req.params.memberId,
        type
      } as any).sort({ recordedAt: -1 });
      if (record) vitals[type] = record;
    }

    res.status(200).json({ success: true, vitals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route DELETE /api/health/:id
export const deleteHealthRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    } as any);

    if (!record) {
      res.status(404).json({ success: false, message: 'Record not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
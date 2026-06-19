export interface AlertResult {
  status: 'Normal' | 'Monitor' | 'Consult Doctor' | 'Urgent';
  message: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

// BP Alert
export const getBPAlert = (systolic: number, diastolic: number): AlertResult => {
  // Sudden spike detection handled separately
  if (systolic >= 180 || diastolic >= 110) {
    return {
      status: 'Urgent',
      message: 'DANGER — Go to doctor / hospital immediately',
      color: 'red'
    };
  } else if (systolic >= 140 || diastolic >= 90) {
    return {
      status: 'Consult Doctor',
      message: 'High BP — Please consult your doctor soon',
      color: 'orange'
    };
  } else if (systolic >= 120 || diastolic >= 80) {
    return {
      status: 'Monitor',
      message: 'Slightly high — Watch your diet and salt intake',
      color: 'yellow'
    };
  } else if (systolic < 90 || diastolic < 60) {
    return {
      status: 'Monitor',
      message: 'Low BP — Rest, drink water, consult doctor if it persists',
      color: 'yellow'
    };
  } else {
    return {
      status: 'Normal',
      message: 'BP is in normal range',
      color: 'green'
    };
  }
};

// Blood Sugar Alert
export const getSugarAlert = (value: number, type: string): AlertResult => {
  if (type === 'fasting') {
    if (value < 70) {
      return {
        status: 'Urgent',
        message: 'Low sugar — Eat something sweet immediately',
        color: 'red'
      };
    } else if (value <= 100) {
      return {
        status: 'Normal',
        message: 'Fasting sugar is in normal range',
        color: 'green'
      };
    } else if (value <= 125) {
      return {
        status: 'Monitor',
        message: 'Pre-diabetic range — Consult doctor',
        color: 'yellow'
      };
    } else if (value <= 250) {
      return {
        status: 'Consult Doctor',
        message: 'High sugar — Take medicine, consult doctor',
        color: 'orange'
      };
    } else {
      return {
        status: 'Urgent',
        message: 'DANGER — Go to doctor immediately',
        color: 'red'
      };
    }
  } else {
    // post-meal
    if (value < 140) {
      return {
        status: 'Normal',
        message: 'Post-meal sugar is in normal range',
        color: 'green'
      };
    } else if (value <= 199) {
      return {
        status: 'Monitor',
        message: 'Slightly high post-meal sugar — Monitor diet',
        color: 'yellow'
      };
    } else {
      return {
        status: 'Consult Doctor',
        message: 'High post-meal sugar — Consult doctor',
        color: 'orange'
      };
    }
  }
};

// Weight / BMI Alert
export const getBMIAlert = (bmi: number): AlertResult => {
  if (bmi < 18.5) {
    return { status: 'Monitor', message: 'Underweight — Consider consulting a nutritionist', color: 'yellow' };
  } else if (bmi <= 24.9) {
    return { status: 'Normal', message: 'BMI is in healthy range', color: 'green' };
  } else if (bmi <= 29.9) {
    return { status: 'Monitor', message: 'Overweight — Watch diet and exercise', color: 'yellow' };
  } else {
    return { status: 'Consult Doctor', message: 'Obese — Please consult a doctor', color: 'orange' };
  }
};

// Heart Rate Alert
export const getHeartRateAlert = (bpm: number): AlertResult => {
  if (bpm < 60) {
    return { status: 'Monitor', message: 'Low heart rate — Monitor if symptoms appear', color: 'yellow' };
  } else if (bpm <= 100) {
    return { status: 'Normal', message: 'Heart rate is normal', color: 'green' };
  } else if (bpm <= 120) {
    return { status: 'Monitor', message: 'Slightly elevated heart rate — Rest and monitor', color: 'yellow' };
  } else {
    return { status: 'Consult Doctor', message: 'High heart rate — Consult doctor', color: 'orange' };
  }
};

// SpO2 Alert
export const getSpO2Alert = (spo2: number): AlertResult => {
  if (spo2 >= 95) {
    return { status: 'Normal', message: 'Oxygen level is normal', color: 'green' };
  } else if (spo2 >= 90) {
    return { status: 'Consult Doctor', message: 'Low oxygen — Consult doctor soon', color: 'orange' };
  } else {
    return { status: 'Urgent', message: 'DANGER — Very low oxygen, go to hospital immediately', color: 'red' };
  }
};

// Temperature Alert
export const getTemperatureAlert = (temp: number, unit: string): AlertResult => {
  const celsius = unit === 'F' ? (temp - 32) * 5 / 9 : temp;
  if (celsius < 36) {
    return { status: 'Monitor', message: 'Low temperature — Monitor closely', color: 'yellow' };
  } else if (celsius <= 37.5) {
    return { status: 'Normal', message: 'Temperature is normal', color: 'green' };
  } else if (celsius <= 38.5) {
    return { status: 'Monitor', message: 'Mild fever — Rest and stay hydrated', color: 'yellow' };
  } else if (celsius <= 39.5) {
    return { status: 'Consult Doctor', message: 'High fever — Consult doctor', color: 'orange' };
  } else {
    return { status: 'Urgent', message: 'Very high fever — Go to hospital immediately', color: 'red' };
  }
};

// Sudden change detection
export const detectSuddenChange = (
  type: string,
  currentValue: number,
  previousValue: number
): string | null => {
  const change = Math.abs(currentValue - previousValue);
  if (type === 'bp_systolic' && change >= 20) {
    return `Sudden BP change detected (+${change} points) — Consult doctor`;
  }
  if (type === 'sugar' && change >= 50) {
    return `Sudden sugar change detected (+${change} mg/dL) — Consult doctor`;
  }
  if (type === 'heart_rate' && change >= 30) {
    return `Sudden heart rate change detected (+${change} bpm) — Monitor closely`;
  }
  return null;
};
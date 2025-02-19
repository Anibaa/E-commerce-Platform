import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const dayScheduleSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true,
  },
  timeSlots: [timeSlotSchema],
});

const specialDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['holiday', 'modified_hours', 'vacation'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isFullDayOff: {
    type: Boolean,
    default: true,
  },
  timeSlots: {
    type: [timeSlotSchema],
    default: undefined,
  },
});

const recurringHolidaySchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isFullDayOff: {
    type: Boolean,
    default: true,
  },
  timeSlots: {
    type: [timeSlotSchema],
    default: undefined,
  },
});

const seasonalScheduleSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isFullPeriodOff: {
    type: Boolean,
    default: false,
  },
  schedule: {
    type: {
      monday: dayScheduleSchema,
      tuesday: dayScheduleSchema,
      wednesday: dayScheduleSchema,
      thursday: dayScheduleSchema,
      friday: dayScheduleSchema,
      saturday: dayScheduleSchema,
      sunday: dayScheduleSchema,
    },
    required: false,
  },
});

const scheduleSchema = new mongoose.Schema({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
  sessionDuration: {
    type: Number,
    required: true,
    default: 60, // in minutes
  },
  specialDates: [specialDateSchema],
  recurringHolidays: [recurringHolidaySchema],
  seasonalSchedules: [seasonalScheduleSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema); 
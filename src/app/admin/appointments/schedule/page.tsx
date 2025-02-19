'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import SpecialDates from './SpecialDates';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface SpecialDate {
  date: Date;
  type: 'holiday' | 'modified_hours' | 'vacation';
  description: string;
  isFullDayOff: boolean;
  timeSlots?: TimeSlot[];
}

interface RecurringHoliday {
  month: number;
  day: number;
  description: string;
  isFullDayOff: boolean;
  timeSlots?: TimeSlot[];
}

interface SeasonalSchedule {
  startDate: Date;
  endDate: Date;
  description: string;
  isFullPeriodOff: boolean;
  schedule?: {
    [key: string]: {
      enabled: boolean;
      timeSlots: TimeSlot[];
    };
  };
}

const defaultTimeSlot: TimeSlot = {
  startTime: '08:00',
  endTime: '17:00',
};

const defaultDaySchedule: DaySchedule = {
  enabled: true,
  timeSlots: [defaultTimeSlot],
};

const defaultWeeklySchedule: WeeklySchedule = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { enabled: false, timeSlots: [defaultTimeSlot] },
  sunday: { enabled: false, timeSlots: [defaultTimeSlot] },
};

export default function ScheduleManagement() {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(defaultWeeklySchedule);
  const [sessionDuration, setSessionDuration] = useState('60');
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [recurringHolidays, setRecurringHolidays] = useState<RecurringHoliday[]>([]);
  const [seasonalSchedules, setSeasonalSchedules] = useState<SeasonalSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/admin/schedule');
        if (response.ok) {
          const data = await response.json();
          if (data.schedule) {
            setWeeklySchedule(data.schedule);
          }
          if (data.sessionDuration) {
            setSessionDuration(data.sessionDuration);
          }
          if (Array.isArray(data.specialDates)) {
            setSpecialDates(data.specialDates.map((date: any) => ({
              ...date,
              date: new Date(date.date),
            })));
          }
          if (Array.isArray(data.recurringHolidays)) {
            setRecurringHolidays(data.recurringHolidays);
          }
          if (Array.isArray(data.seasonalSchedules)) {
            setSeasonalSchedules(data.seasonalSchedules.map((schedule: any) => ({
              ...schedule,
              startDate: new Date(schedule.startDate),
              endDate: new Date(schedule.endDate),
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleDayToggle = (day: keyof WeeklySchedule) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeSlotChange = (
    day: keyof WeeklySchedule,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { startTime: '09:00', endTime: '17:00' }],
      },
    }));
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schedule: weeklySchedule,
          sessionDuration: parseInt(sessionDuration),
          specialDates: specialDates.map(date => ({
            ...date,
            date: date.date.toISOString(),
          })),
          recurringHolidays,
          seasonalSchedules: seasonalSchedules.map(schedule => ({
            ...schedule,
            startDate: schedule.startDate.toISOString(),
            endDate: schedule.endDate.toISOString(),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSpecialDatesUpdate = (data: {
    specialDates: SpecialDate[];
    recurringHolidays: RecurringHoliday[];
    seasonalSchedules: SeasonalSchedule[];
  }) => {
    setSpecialDates(data.specialDates);
    setRecurringHolidays(data.recurringHolidays);
    setSeasonalSchedules(data.seasonalSchedules);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-600">Set your availability for appointments</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            <FiSave className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>

        {/* Session Duration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Session Duration</h2>
          <div className="max-w-xs">
            <select
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1 hour 30 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        {/* Special Dates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SpecialDates
            specialDates={specialDates}
            recurringHolidays={recurringHolidays}
            seasonalSchedules={seasonalSchedules}
            onUpdate={handleSpecialDatesUpdate}
          />
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule</h2>
          <div className="space-y-6">
            {Object.entries(weeklySchedule).map(([day, schedule]) => (
              <div key={day} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={() => handleDayToggle(day as keyof WeeklySchedule)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-900 capitalize">{day}</span>
                    </label>
                  </div>
                  {schedule.enabled && (
                    <button
                      onClick={() => addTimeSlot(day as keyof WeeklySchedule)}
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Add Time Slot
                    </button>
                  )}
                </div>

                {schedule.enabled && (
                  <div className="space-y-4">
                    {schedule.timeSlots.map((slot: TimeSlot, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleTimeSlotChange(
                              day as keyof WeeklySchedule,
                              index,
                              'startTime',
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleTimeSlotChange(
                              day as keyof WeeklySchedule,
                              index,
                              'endTime',
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {schedule.timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(day as keyof WeeklySchedule, index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 
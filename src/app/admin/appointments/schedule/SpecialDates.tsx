import { useState } from 'react';
import { FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';

interface TimeSlot {
  startTime: string;
  endTime: string;
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

interface SpecialDatesProps {
  specialDates: SpecialDate[];
  recurringHolidays: RecurringHoliday[];
  seasonalSchedules: SeasonalSchedule[];
  onUpdate: (data: {
    specialDates: SpecialDate[];
    recurringHolidays: RecurringHoliday[];
    seasonalSchedules: SeasonalSchedule[];
  }) => void;
}

export default function SpecialDates({
  specialDates,
  recurringHolidays,
  seasonalSchedules,
  onUpdate,
}: SpecialDatesProps) {
  const [activeTab, setActiveTab] = useState<'special' | 'recurring' | 'seasonal'>('special');

  const addSpecialDate = () => {
    const newSpecialDates = [
      ...specialDates,
      {
        date: new Date(),
        type: 'holiday' as const,
        description: '',
        isFullDayOff: true,
        timeSlots: [{ startTime: '09:00', endTime: '17:00' }],
      },
    ];
    onUpdate({ specialDates: newSpecialDates, recurringHolidays, seasonalSchedules });
  };

  const addRecurringHoliday = () => {
    const newRecurringHolidays = [
      ...recurringHolidays,
      {
        month: 1,
        day: 1,
        description: '',
        isFullDayOff: true,
        timeSlots: [{ startTime: '09:00', endTime: '17:00' }],
      },
    ];
    onUpdate({ specialDates, recurringHolidays: newRecurringHolidays, seasonalSchedules });
  };

  const addSeasonalSchedule = () => {
    const newSeasonalSchedules = [
      ...seasonalSchedules,
      {
        startDate: new Date(),
        endDate: new Date(),
        description: '',
        isFullPeriodOff: false,
      },
    ];
    onUpdate({ specialDates, recurringHolidays, seasonalSchedules: newSeasonalSchedules });
  };

  const updateSpecialDate = (index: number, data: Partial<SpecialDate>) => {
    const newSpecialDates = specialDates.map((date, i) =>
      i === index ? { ...date, ...data } : date
    );
    onUpdate({ specialDates: newSpecialDates, recurringHolidays, seasonalSchedules });
  };

  const updateRecurringHoliday = (index: number, data: Partial<RecurringHoliday>) => {
    const newRecurringHolidays = recurringHolidays.map((holiday, i) =>
      i === index ? { ...holiday, ...data } : holiday
    );
    onUpdate({ specialDates, recurringHolidays: newRecurringHolidays, seasonalSchedules });
  };

  const updateSeasonalSchedule = (index: number, data: Partial<SeasonalSchedule>) => {
    const newSeasonalSchedules = seasonalSchedules.map((schedule, i) =>
      i === index ? { ...schedule, ...data } : schedule
    );
    onUpdate({ specialDates, recurringHolidays, seasonalSchedules: newSeasonalSchedules });
  };

  const handleTimeSlotChange = (
    index: number,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newSpecialDates = specialDates.map((date, i) =>
      i === index
        ? {
            ...date,
            timeSlots: (date.timeSlots || []).map((slot, si) =>
              si === slotIndex ? { ...slot, [field]: value } : slot
            ),
          }
        : date
    );
    onUpdate({ specialDates: newSpecialDates, recurringHolidays, seasonalSchedules });
  };

  const addTimeSlot = (index: number) => {
    const newSpecialDates = specialDates.map((date, i) =>
      i === index
        ? {
            ...date,
            timeSlots: [
              ...(date.timeSlots || []),
              { startTime: '09:00', endTime: '17:00' },
            ],
          }
        : date
    );
    onUpdate({ specialDates: newSpecialDates, recurringHolidays, seasonalSchedules });
  };

  const removeTimeSlot = (dateIndex: number, slotIndex: number) => {
    const newSpecialDates = specialDates.map((date, i) =>
      i === dateIndex
        ? {
            ...date,
            timeSlots: (date.timeSlots || []).filter((_, si) => si !== slotIndex),
          }
        : date
    );
    onUpdate({ specialDates: newSpecialDates, recurringHolidays, seasonalSchedules });
  };

  const handleRecurringHolidayTimeSlotChange = (
    index: number,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newRecurringHolidays = recurringHolidays.map((holiday, i) =>
      i === index
        ? {
            ...holiday,
            timeSlots: (holiday.timeSlots || []).map((slot, si) =>
              si === slotIndex ? { ...slot, [field]: value } : slot
            ),
          }
        : holiday
    );
    onUpdate({ specialDates, recurringHolidays: newRecurringHolidays, seasonalSchedules });
  };

  const addRecurringHolidayTimeSlot = (index: number) => {
    const newRecurringHolidays = recurringHolidays.map((holiday, i) =>
      i === index
        ? {
            ...holiday,
            timeSlots: [
              ...(holiday.timeSlots || []),
              { startTime: '09:00', endTime: '17:00' },
            ],
          }
        : holiday
    );
    onUpdate({ specialDates, recurringHolidays: newRecurringHolidays, seasonalSchedules });
  };

  const removeRecurringHolidayTimeSlot = (holidayIndex: number, slotIndex: number) => {
    const newRecurringHolidays = recurringHolidays.map((holiday, i) =>
      i === holidayIndex
        ? {
            ...holiday,
            timeSlots: (holiday.timeSlots || []).filter((_, si) => si !== slotIndex),
          }
        : holiday
    );
    onUpdate({ specialDates, recurringHolidays: newRecurringHolidays, seasonalSchedules });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('special')}
            className={`${
              activeTab === 'special'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Special Dates
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`${
              activeTab === 'recurring'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Recurring Holidays
          </button>
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`${
              activeTab === 'seasonal'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Seasonal Schedules
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'special' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Special Dates</h3>
              <button
                onClick={addSpecialDate}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Special Date
              </button>
            </div>
            {specialDates.map((date, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={new Date(date.date).toISOString().split('T')[0]}
                      onChange={(e) =>
                        updateSpecialDate(index, { date: new Date(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={date.type}
                      onChange={(e) =>
                        updateSpecialDate(index, {
                          type: e.target.value as SpecialDate['type'],
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="holiday">Holiday</option>
                      <option value="modified_hours">Modified Hours</option>
                      <option value="vacation">Vacation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={date.description}
                    onChange={(e) =>
                      updateSpecialDate(index, { description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., National Holiday"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={date.isFullDayOff}
                      onChange={(e) =>
                        updateSpecialDate(index, {
                          isFullDayOff: e.target.checked,
                          timeSlots: e.target.checked ? undefined : [{ startTime: '09:00', endTime: '17:00' }],
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Full day off</span>
                  </label>
                  <button
                    onClick={() => {
                      const newSpecialDates = specialDates.filter((_, i) => i !== index);
                      onUpdate({
                        specialDates: newSpecialDates,
                        recurringHolidays,
                        seasonalSchedules,
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Time Slots Section */}
                {!date.isFullDayOff && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Available Time Slots</h4>
                      <button
                        onClick={() => addTimeSlot(index)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Time Slot
                      </button>
                    </div>
                    {(date.timeSlots || []).map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center space-x-4">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleTimeSlotChange(index, slotIndex, 'startTime', e.target.value)
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleTimeSlotChange(index, slotIndex, 'endTime', e.target.value)
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {(date.timeSlots || []).length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(index, slotIndex)}
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
        )}

        {activeTab === 'recurring' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recurring Holidays</h3>
              <button
                onClick={addRecurringHoliday}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Recurring Holiday
              </button>
            </div>
            {recurringHolidays.map((holiday, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Month</label>
                    <select
                      value={holiday.month}
                      onChange={(e) =>
                        updateRecurringHoliday(index, { month: parseInt(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString('default', {
                            month: 'long',
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select
                      value={holiday.day}
                      onChange={(e) =>
                        updateRecurringHoliday(index, { day: parseInt(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={holiday.description}
                    onChange={(e) =>
                      updateRecurringHoliday(index, { description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., New Year's Day"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={holiday.isFullDayOff}
                      onChange={(e) =>
                        updateRecurringHoliday(index, {
                          isFullDayOff: e.target.checked,
                          timeSlots: e.target.checked ? undefined : [{ startTime: '09:00', endTime: '17:00' }],
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Full day off</span>
                  </label>
                  <button
                    onClick={() => {
                      const newRecurringHolidays = recurringHolidays.filter(
                        (_, i) => i !== index
                      );
                      onUpdate({
                        specialDates,
                        recurringHolidays: newRecurringHolidays,
                        seasonalSchedules,
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Time Slots Section */}
                {!holiday.isFullDayOff && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700">Available Time Slots</h4>
                      <button
                        onClick={() => addRecurringHolidayTimeSlot(index)}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Time Slot
                      </button>
                    </div>
                    {(holiday.timeSlots || []).map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center space-x-4">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleRecurringHolidayTimeSlotChange(
                              index,
                              slotIndex,
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
                            handleRecurringHolidayTimeSlotChange(
                              index,
                              slotIndex,
                              'endTime',
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {(holiday.timeSlots || []).length > 1 && (
                          <button
                            onClick={() => removeRecurringHolidayTimeSlot(index, slotIndex)}
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
        )}

        {activeTab === 'seasonal' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Seasonal Schedules</h3>
              <button
                onClick={addSeasonalSchedule}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Seasonal Schedule
              </button>
            </div>
            {seasonalSchedules.map((schedule, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={new Date(schedule.startDate).toISOString().split('T')[0]}
                      onChange={(e) =>
                        updateSeasonalSchedule(index, {
                          startDate: new Date(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={new Date(schedule.endDate).toISOString().split('T')[0]}
                      onChange={(e) =>
                        updateSeasonalSchedule(index, {
                          endDate: new Date(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={schedule.description}
                    onChange={(e) =>
                      updateSeasonalSchedule(index, { description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Summer Vacation"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.isFullPeriodOff}
                      onChange={(e) =>
                        updateSeasonalSchedule(index, {
                          isFullPeriodOff: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Full period off</span>
                  </label>
                  <button
                    onClick={() => {
                      const newSeasonalSchedules = seasonalSchedules.filter(
                        (_, i) => i !== index
                      );
                      onUpdate({
                        specialDates,
                        recurringHolidays,
                        seasonalSchedules: newSeasonalSchedules,
                      });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
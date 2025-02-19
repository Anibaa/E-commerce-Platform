import { Schedule } from '@/models/Schedule';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
}

export async function getAvailableSlots(date: Date): Promise<AvailabilitySlot[]> {
  const schedule = await Schedule.findOne();
  if (!schedule) {
    return [];
  }

  // Check if it's a special date
  const specialDate = schedule.specialDates.find(
    (special) => special.date.toDateString() === date.toDateString()
  );
  
  if (specialDate) {
    if (specialDate.isFullDayOff) {
      return [];
    }
    return convertTimeSlotsToAvailability(date, specialDate.timeSlots || []);
  }

  // Check if it's a recurring holiday
  const recurringHoliday = schedule.recurringHolidays.find(
    (holiday) => 
      holiday.month === date.getMonth() + 1 && 
      holiday.day === date.getDate()
  );

  if (recurringHoliday) {
    if (recurringHoliday.isFullDayOff) {
      return [];
    }
    return convertTimeSlotsToAvailability(date, recurringHoliday.timeSlots || []);
  }

  // Check if it's within a seasonal schedule
  const seasonalSchedule = schedule.seasonalSchedules.find(
    (season) => 
      date >= new Date(season.startDate) && 
      date <= new Date(season.endDate)
  );

  if (seasonalSchedule) {
    if (seasonalSchedule.isFullPeriodOff) {
      return [];
    }
    if (seasonalSchedule.schedule) {
      const dayOfWeek = getDayOfWeek(date);
      const daySchedule = seasonalSchedule.schedule[dayOfWeek];
      if (!daySchedule?.enabled) {
        return [];
      }
      return convertTimeSlotsToAvailability(date, daySchedule.timeSlots);
    }
  }

  // Use regular weekly schedule
  const dayOfWeek = getDayOfWeek(date);
  const daySchedule = schedule[dayOfWeek];
  
  if (!daySchedule?.enabled) {
    return [];
  }

  return convertTimeSlotsToAvailability(date, daySchedule.timeSlots);
}

function getDayOfWeek(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

function convertTimeSlotsToAvailability(date: Date, timeSlots: TimeSlot[]): AvailabilitySlot[] {
  return timeSlots.map(slot => {
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const startTime = new Date(date);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    return { startTime, endTime };
  });
}

export async function isTimeSlotAvailable(startTime: Date, endTime: Date): Promise<boolean> {
  const availableSlots = await getAvailableSlots(startTime);
  
  return availableSlots.some(slot => 
    startTime >= slot.startTime && endTime <= slot.endTime
  );
}

export async function generateAvailableTimeSlots(
  date: Date,
  sessionDuration: number
): Promise<AvailabilitySlot[]> {
  const availableSlots = await getAvailableSlots(date);
  const slots: AvailabilitySlot[] = [];

  for (const slot of availableSlots) {
    let currentTime = slot.startTime;
    while (currentTime < slot.endTime) {
      const slotEndTime = new Date(currentTime.getTime() + sessionDuration * 60000);
      if (slotEndTime <= slot.endTime) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: slotEndTime,
        });
      }
      currentTime = slotEndTime;
    }
  }

  return slots;
} 
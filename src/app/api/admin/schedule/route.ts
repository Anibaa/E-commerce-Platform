import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

// Helper function to get or create default schedule
async function getOrCreateSchedule() {
  let schedule = await Schedule.findOne();
  
  if (!schedule) {
    schedule = await Schedule.create({
      monday: { enabled: true, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      tuesday: { enabled: true, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      wednesday: { enabled: true, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      thursday: { enabled: true, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      friday: { enabled: true, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      saturday: { enabled: false, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      sunday: { enabled: false, timeSlots: [{ startTime: '08:00', endTime: '17:00' }] },
      sessionDuration: 60,
      specialDates: [],
      recurringHolidays: [],
      seasonalSchedules: [],
    });
  }

  return schedule;
}

export async function GET() {
  try {
    await connectToDatabase();
    const schedule = await getOrCreateSchedule();
    
    // Format dates for special dates and seasonal schedules
    const formattedSchedule = {
      schedule: {
        monday: schedule.monday,
        tuesday: schedule.tuesday,
        wednesday: schedule.wednesday,
        thursday: schedule.thursday,
        friday: schedule.friday,
        saturday: schedule.saturday,
        sunday: schedule.sunday,
      },
      sessionDuration: schedule.sessionDuration.toString(),
      specialDates: schedule.specialDates.map((date: any) => ({
        ...date.toObject(),
        date: new Date(date.date),
      })),
      recurringHolidays: schedule.recurringHolidays,
      seasonalSchedules: schedule.seasonalSchedules.map((season: any) => ({
        ...season.toObject(),
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      })),
    };

    return NextResponse.json(formattedSchedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      schedule: weeklySchedule,
      sessionDuration,
      specialDates,
      recurringHolidays,
      seasonalSchedules,
    } = await request.json();

    await connectToDatabase();
    
    // Validate the data
    if (!weeklySchedule || typeof sessionDuration !== 'number') {
      return NextResponse.json(
        { error: 'Invalid schedule data' },
        { status: 400 }
      );
    }

    // Validate special dates
    if (specialDates?.some(date => !date.date || !date.type || !date.description)) {
      return NextResponse.json(
        { error: 'Invalid special dates data' },
        { status: 400 }
      );
    }

    // Validate recurring holidays
    if (recurringHolidays?.some(holiday => 
      !holiday.month || !holiday.day || !holiday.description ||
      holiday.month < 1 || holiday.month > 12 || holiday.day < 1 || holiday.day > 31
    )) {
      return NextResponse.json(
        { error: 'Invalid recurring holidays data' },
        { status: 400 }
      );
    }

    // Validate seasonal schedules
    if (seasonalSchedules?.some(season => 
      !season.startDate || !season.endDate || !season.description ||
      new Date(season.startDate) > new Date(season.endDate)
    )) {
      return NextResponse.json(
        { error: 'Invalid seasonal schedules data' },
        { status: 400 }
      );
    }

    // Update or create the schedule
    const updatedSchedule = await Schedule.findOneAndUpdate(
      {},
      {
        ...weeklySchedule,
        sessionDuration,
        specialDates: specialDates.map(date => ({
          ...date,
          date: new Date(date.date),
        })),
        recurringHolidays,
        seasonalSchedules: seasonalSchedules.map(season => ({
          ...season,
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
        })),
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    // Format dates for the response
    const formattedSchedule = {
      ...updatedSchedule.toObject(),
      specialDates: updatedSchedule.specialDates.map(date => ({
        ...date,
        date: new Date(date.date),
      })),
      seasonalSchedules: updatedSchedule.seasonalSchedules.map(season => ({
        ...season,
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      })),
    };

    return NextResponse.json(formattedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
} 
import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    start: {
      type: Date,
      required: [true, 'Event start date is required']
    },
    end: {
      type: Date
    },
    category: {
      type: String,
      enum: ['exam', 'class', 'deadline', 'revision', 'study', 'milestone'],
      default: 'study'
    },
    color: {
      type: String,
      default: '#4F46E5'
    }
  },
  { timestamps: true }
);

export const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
export default CalendarEvent;

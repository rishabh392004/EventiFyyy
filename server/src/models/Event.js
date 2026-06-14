import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter an event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please enter the event date and time'],
  },
  location: {
    type: String,
    required: [true, 'Please enter the event location (physical address or virtual link)'],
  },
  category: {
    type: String,
    required: [true, 'Please select an event category'],
    enum: ['Tech', 'Workshop', 'Social', 'Music', 'Sports', 'Other'],
    default: 'Other',
  },
  capacity: {
    type: Number,
    required: false,
    default: null, 
  },
  imageUrl: {
    type: String,
    required: false,
    default: '',
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User schema in User.js
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Keeps an array of User IDs who attend the event
    }
  ]
}, {
  timestamps: true, 
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
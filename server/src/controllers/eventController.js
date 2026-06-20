import Event from '../models/Event.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;

  try {
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      organizer: req.user._id, // Set the organizer as the logged-in user
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    // Fetch all events and populate the organizer's name and email
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the logged-in user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated document & run schema validation
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the logged-in user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP / Join or leave an event
// @route   POST /api/events/:id/rsvp
// @access  Private
export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Initialize attendees array if not already present (failsafe)
    if (!event.attendees) {
      event.attendees = [];
    }

    // Check if the user has already RSVP'd
    const isAlreadyAttendee = event.attendees.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (isAlreadyAttendee) {
      // User already RSVP'd - remove them (Un-RSVP)
      event.attendees = event.attendees.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      await event.save();
      return res.json({ message: 'RSVP removed successfully', attendees: event.attendees });
    } else {
      // User has not RSVP'd - add them
      event.attendees.push(req.user._id);
      await event.save();
      return res.json({ message: 'RSVP added successfully', attendees: event.attendees });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
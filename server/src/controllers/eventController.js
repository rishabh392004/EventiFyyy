import Event from '../models/Event.js'; // 1. Added .js extension
//createEvent
export const createEvent = async (req, res) => {
  const { title, description, date, location, category, capacity, imageUrl } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      capacity: capacity ? Number(capacity) : null,
      imageUrl,
      organizer: req.user._id, // Set by auth middleware
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//this is we make it for the getEvents
export const getEvents = async (req, res) => {
  const { category, search } = req.query;
  let query = {};
  
  if (category && category !== 'All') {
    query.category = category;
  }
  //$or: This is a MongoDB operator. It tells the database: "Return the event if either the title matches or the description matche
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  try {
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => { // 2. Renamed to getEventById
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, date, location, category, capacity, imageUrl } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event is not found' });
    }
    // Authorization check
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }
    // Apply updates
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.capacity = capacity !== undefined ? (capacity ? Number(capacity) : null) : event.capacity;
    event.imageUrl = imageUrl !== undefined ? imageUrl : event.imageUrl;
    const updatedEvent = await event.save(); // 3. Kept inside the try block
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//rsvp means the jion the the event
export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    if (event.capacity && event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event capacity full' });
    }
    event.attendees.push(req.user._id);
    await event.save();
    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//for cancel the event
export const cancelRsvp = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have not RSVPed to this event' });
    }
    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== req.user._id.toString()
    );
    await event.save();
    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
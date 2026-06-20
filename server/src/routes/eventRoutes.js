import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent, // Imported RSVP controller
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: /api/events
// GET: Public (fetch all events)
// POST: Private (create an event - requires login)
router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

// Route: /api/events/:id/rsvp
// POST: Private (RSVP/Join or Leave - requires login)
router.route('/:id/rsvp')
  .post(protect, rsvpEvent);

// Route: /api/events/:id
// GET: Public (fetch details of a specific event)
// PUT: Private (update event details - requires login & ownership)
// DELETE: Private (delete event - requires login & ownership)
router.route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;
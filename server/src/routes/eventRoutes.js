import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
} from '../controllers/eventController.js';

const router = express.Router();

// Routes for "/api/events"
router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

// Routes for "/api/events/:id"
router.route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

// Routes for "/api/events/:id/rsvp"
router.route('/:id/rsvp')
  .post(protect, rsvpEvent)
  .delete(protect, cancelRsvp);

export default router;
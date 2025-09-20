import express from 'express';
import { body } from 'express-validator';
import { chatWithAI, getQuickActionResponse } from '../controllers/chatbotController.js';

const router = express.Router();

// Chat with AI endpoint
router.post(
  '/chat',
  [
    body('message').isString().isLength({ min: 1, max: 500 }).trim(),
    body('context').optional().isString().isLength({ max: 50 })
  ],
  chatWithAI
);

// Quick action responses
router.post('/quick-action', getQuickActionResponse);

export default router;

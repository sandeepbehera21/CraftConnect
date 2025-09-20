import { GoogleGenerativeAI } from '@google/generative-ai';
import { validationResult } from 'express-validator';

// Initialize Gemini AI
const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(key);
};

// Chat with Gemini AI
export const chatWithAI = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Invalid input', details: errors.array() });
    }
    const { message, context = 'general' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const genAI = getGenAI();
    
    // Create a concise prompt for the artisan marketplace chatbot
    const systemPrompt = `You are an AI assistant for CraftConnect, an artisan marketplace. Keep responses SHORT and helpful (2-3 sentences max).

Context: ${context}
User Message: ${message}

Respond briefly about:
- Handcrafted product recommendations
- Traditional crafts and cultural heritage
- Order assistance
- Artisan connections
- Platform help

Use emojis sparingly. Be friendly but concise.`;

    // Try different Gemini models with fallback
    const candidateModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ];

    let response = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(systemPrompt);
        const aiResponse = await result.response;
        response = aiResponse.text();
        
        if (response && response.trim().length > 0) {
          console.log(`Gemini succeeded with model: ${modelName}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model failed: ${modelName}`, err?.message || err);
      }
    }

    if (!response || response.trim().length === 0) {
      throw new Error(lastError?.message || 'No response from Gemini AI');
    }

    res.json({
      success: true,
      response: response.trim(),
      model: 'gemini-ai'
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get quick action responses
export const getQuickActionResponse = async (req, res) => {
  try {
    const { action } = req.body;

    const quickActions = {
      "recommend": "I can recommend handcrafted products! What type of items interest you? (pottery, textiles, jewelry, woodwork)",
      "cultural": "I can teach about traditional crafts! Which technique interests you? (Madhubani, Pashmina, Terracotta)",
      "order": "I can help with your order! What do you need? (tracking, returns, payment issues)",
      "consultation": "I can connect you with artisans! What type of consultation do you need?",
      "faq": "Common questions: How to order? Payment methods? Shipping time? Returns? Becoming an artisan? What can I help with?"
    };

    const response = quickActions[action] || "How can I help you with that?";

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Quick action error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process quick action'
    });
  }
};

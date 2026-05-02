const express = require('express');
const authGuard = require('../middleware/authGuard');
const Session = require('../models/Session');

const router = express.Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callAI(systemPrompt, userPrompt) {
  const url = `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  let rawText = data.candidates[0].content.parts[0].text;
  
  // Clean up potential markdown formatting that Gemini sometimes includes
  rawText = rawText.replace(/```json\n?|\n?```/g, '').trim();
  
  return rawText;
}

// POST /api/interview/generate
router.post('/generate', authGuard, async (req, res) => {
  console.log('Generate route hit');
  try {
    const { jobRole } = req.body;

    if (!jobRole) {
      return res.status(400).json({ message: 'jobRole is required' });
    }

    const systemPrompt = 'You are an expert technical interviewer.';
    const userPrompt = `Generate exactly 5 interview questions for the job role: "${jobRole}". Return them as a JSON array of strings with no extra text or explanation. Example format: ["Question 1", "Question 2", ...]`;

    console.log('Gemini API Key exists:', !!process.env.GEMINI_API_KEY);
    const rawResponse = await callAI(systemPrompt, userPrompt);
    const questions = JSON.parse(rawResponse);

    const session = await Session.create({
      userId: req.user.id,
      jobRole,
      questions,
    });

    res.status(201).json({ sessionId: session._id, questions });
  } catch (err) {
    console.error('Generate route error:', err.message);
    res.status(500).json({ message: 'Failed to generate questions', error: err.message });
  }
});

// POST /api/interview/answer
router.post('/answer', authGuard, async (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({ message: 'sessionId, question, and answer are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const systemPrompt = 'You are an expert technical interviewer giving feedback.';
    const userPrompt = `Evaluate the following answer to an interview question.

Question: "${question}"
Answer: "${answer}"

Return a JSON object with these fields and no extra text:
- "score": a number from 1 to 10
- "feedback": a string with detailed feedback
- "improvements": an array of strings with specific suggestions for improvement`;

    const rawResponse = await callAI(systemPrompt, userPrompt);
    const feedback = JSON.parse(rawResponse);

    session.answers.push({
      question,
      answer,
      feedback: JSON.stringify(feedback),
    });
    await session.save();

    res.json(feedback);
  } catch (err) {
    console.error('Answer route error:', err.message);
    res.status(500).json({ message: 'Failed to evaluate answer', error: err.message });
  }
});

// GET /api/interview/history
router.get('/history', authGuard, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
});

module.exports = router;

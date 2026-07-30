import { Router } from 'express';
import { db } from '../db.js';
import { Message } from '../../src/types/index.js';
import { getAiClient, generateSmartAiReply } from '../aiHelper.js';

export const aiRouter = Router();

// ReadyNest AI Chat Bot Assistant endpoint
aiRouter.post('/chat', async (req, res) => {
  try {
    const { prompt, conversationId, userContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const aiClient = getAiClient();
    let replyText = '';

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: `You are 'ReadyNest AI Assistant', an intelligent, helpful, and friendly AI chatbot integrated inside Ready Nest Messenger platform built by Archit Shakya. 
Answer concisely, concisely formatted with markdown, emojis, code snippets where applicable, and maintain a warm, professional tone. 
Keep answers readable for chat screens.`,
          },
        });
        replyText = response.text || generateSmartAiReply(prompt);
      } catch (genErr: any) {
        console.warn('Gemini generateContent call failed, using smart fallback:', genErr?.message || genErr);
        replyText = generateSmartAiReply(prompt);
      }
    } else {
      replyText = generateSmartAiReply(prompt);
    }

    // Save AI response to DB if conversationId provided
    if (conversationId) {
      const aiUser = db.getUserById('user-ai');
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        conversationId,
        senderId: 'user-ai',
        senderName: 'ReadyNest AI Assistant',
        senderAvatar: aiUser?.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        content: replyText,
        type: 'ai',
        status: 'seen',
        createdAt: new Date().toISOString(),
        isAiResponse: true,
      };
      db.addMessage(aiMsg);
      return res.json({ message: aiMsg });
    }

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in AI Assistant route:', error);
    return res.status(500).json({ error: error.message || 'AI processing failed' });
  }
});

// Summarize conversation endpoint
aiRouter.post('/summarize', async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId required' });
    }

    const messages = db.getMessagesForConversation(conversationId);
    if (messages.length === 0) {
      return res.json({ summary: 'No messages to summarize yet.' });
    }

    const chatContext = messages
      .map(m => `${m.senderName}: ${m.content}`)
      .join('\n');

    const aiClient = getAiClient();
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Please summarize the key points and action items from this chat transcript:\n\n${chatContext}`,
        config: {
          systemInstruction: 'You are a chat summarizer. Provide a concise bullet-point summary.',
        },
      });
      return res.json({ summary: response.text || 'Summary unavailable' });
    } else {
      return res.json({
        summary: `• Discussion between ${messages.length} messages.\n• Real-time updates and active chat participants.\n• Action items logged in Ready Nest Messenger.`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
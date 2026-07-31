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
    const systemInstruction = `You are 'ReadyNest AI Assistant', an intelligent, helpful, and friendly AI chatbot integrated inside the Ready Nest Messenger platform built by Archit Shakya.
Always provide complete, thorough, and direct answers to user questions. Never output placeholder or generic non-answers.
When asked for questions, code, study topics, summaries, or explanations, provide them in full detail formatted cleanly with markdown, emojis, code blocks, and clear lists.`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { systemInstruction },
        });
        replyText = response.text || '';
      } catch (genErr1: any) {
        console.warn('Gemini 2.5 Flash call failed in REST route, trying gemini-2.5-pro:', genErr1?.message || genErr1);
        try {
          const response2 = await aiClient.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { systemInstruction },
          });
          replyText = response2.text || '';
        } catch (genErr2: any) {
          console.warn('Gemini fallback failed in REST route:', genErr2?.message || genErr2);
        }
      }
    }

    if (!replyText || replyText.trim().length === 0) {
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

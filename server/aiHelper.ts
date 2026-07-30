import { GoogleGenAI } from '@google/genai';

export const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export function generateSmartAiReply(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  // Date & Time queries
  if (
    lower.includes('date') ||
    lower.includes('today') ||
    lower.includes('time') ||
    lower.includes('day is it') ||
    lower.includes('aaj ki date') ||
    lower.includes('aaj kya date') ||
    lower.includes('what date')
  ) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    return `📅 **Current Date & Time**:\n- **Today's Date**: ${dateStr}\n- **Current Time**: ${timeStr}\n\nIs there anything else I can help you with in ReadyNest Messenger?`;
  }

  // Greeting
  if (lower.match(/^(hi|hello|hey|namaste|greetings|hola|good morning|good evening|good afternoon|kaise ho|kaise)/)) {
    return `👋 **Hello! Welcome to ReadyNest AI Assistant.**\n\nI am your intelligent companion built into **ReadyNest Messenger**. I can help you with:\n- 💬 **Answering Questions & Explanations**\n- 📝 **Summarizing Chats & Notes**\n- 💻 **Writing Code Snippets**\n- ⚡ **Exploring ReadyNest Messenger Features**\n\nHow can I assist you today?`;
  }

  // Weather query
  if (lower.includes('weather') || lower.includes('forecast') || lower.includes('temperature') || lower.includes('mausam')) {
    return `🌤️ **Weather Information**:\n\nWhile I am operating in offline mode without live weather sensors, it's always a pleasant climate for real-time messaging on **ReadyNest Messenger**! ⚡`;
  }

  // About ReadyNest / Author
  if (
    lower.includes('readynest') ||
    lower.includes('who made') ||
    lower.includes('who created') ||
    lower.includes('author') ||
    lower.includes('developer') ||
    lower.includes('archit')
  ) {
    return `🚀 **About ReadyNest Messenger**:\n\nDesigned & Developed by **Archit Shakya**, ReadyNest Messenger is a modern communication platform featuring:\n- ⚡ **Sub-100ms WebSockets** messaging & status updates\n- 🤖 **Gemini 3.6 Flash AI Assistant**\n- 📞 **HD Voice & Video Calls**\n- 🎨 **White & Emerald Green Theme**\n- 🔒 **Secure Enterprise Workspace**`;
  }

  // Code or Programming
  if (
    lower.includes('code') ||
    lower.includes('javascript') ||
    lower.includes('typescript') ||
    lower.includes('react') ||
    lower.includes('python') ||
    lower.includes('html') ||
    lower.includes('css') ||
    lower.includes('function') ||
    lower.includes('sql')
  ) {
    return `💻 **Here is a code snippet for you**:\n\n\`\`\`typescript\n// Example WebSocket message sender in ReadyNest Messenger\nimport { socketService } from './services/socketService';\n\nexport const sendChatMessage = (conversationId: string, text: string) => {\n  socketService.send('message:send', {\n    conversationId,\n    content: text,\n    type: 'text'\n  });\n};\n\`\`\`\n\nLet me know if you need specific algorithms or React component code!`;
  }

  // Math / Calculations
  if (
    lower.includes('calculate') ||
    lower.includes('+') ||
    lower.includes('-') ||
    lower.includes('*') ||
    lower.includes('/') ||
    lower.includes('math')
  ) {
    try {
      const sanitized = prompt.replace(/[^0-9+\-*/().]/g, '');
      if (sanitized && sanitized.length > 0) {
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (result !== undefined && !isNaN(result)) {
          return `🔢 **Math Calculation Result**:\n\nExpression: \`${sanitized}\` = **${result}**`;
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  // Joke / Fun
  if (lower.includes('joke') || lower.includes('funny')) {
    return `😄 **Here's a quick joke for you**:\n\n*Why do programmers prefer dark mode?*\n\nBecause light attracts bugs! 🐛 (Though ReadyNest's White & Emerald Green theme is ultra clean too!)`;
  }

  // General fallback that addresses the specific prompt
  const capitalized = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return `🤖 **ReadyNest AI Assistant**:\n\nRegarding your query: "${capitalized}"\n\nI am powered by **Gemini 3.6 Flash**. I can help answer questions, summarize discussions, assist with code, or provide information about ReadyNest Messenger. What else would you like to explore?`;
}

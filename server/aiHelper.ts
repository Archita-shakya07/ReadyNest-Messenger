import { GoogleGenAI } from '@google/genai';

export const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Multiple models try karo order mein
export async function callGeminiAI(client: any, prompt: string, systemInstruction: string): Promise<string> {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction },
      });
      const text = response.text || '';
      if (text.trim().length > 0) return text;
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.message);
    }
  }
  return '';
}

export function generateSmartAiReply(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  if (lower.match(/^(hi|hello|hey|namaste|hola|good morning|good afternoon|good evening|kaise ho)/)) {
    return `👋 **Hello! Main hoon ReadyNest AI Assistant.**\n\nMain aapki help kar sakta hoon:\n- 💬 Kisi bhi sawaal ka jawab\n- 💻 Code writing & debugging\n- 📝 Content drafting\n- 🧮 Math calculations\n- 📚 Study material & explanations\n\nKuch bhi poochein — Hindi, English, ya Hinglish mein!`;
  }

  if (lower.includes('date') || lower.includes('time') || lower.includes('aaj') || lower.includes('today')) {
    const now = new Date();
    return `📅 **Current Date & Time:**\n- **Date:** ${now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n- **Time:** ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  }

  if (lower.includes('code') || lower.includes('javascript') || lower.includes('react') || lower.includes('python') || lower.includes('html') || lower.includes('css') || lower.includes('typescript')) {
    return `💻 **Programming Help:**\n\nAapne coding question pucha! Main in languages mein help kar sakta hoon:\n- JavaScript / TypeScript / React\n- Python / Node.js\n- HTML / CSS / Tailwind\n- SQL & Databases\n\n**Apna specific problem batayein — main complete working code dunga!** 🚀`;
  }

  if (lower.includes('calculate') || lower.includes('math') || /\d+\s*[+\-*/]\s*\d+/.test(prompt)) {
    try {
      const sanitized = prompt.replace(/[^0-9+\-*/().]/g, '').trim();
      if (sanitized.length > 0) {
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (!isNaN(result)) return `🔢 **Result:** \`${sanitized}\` = **${result}**`;
      }
    } catch (e) {}
  }

  if (lower.includes('readynest') || lower.includes('archit') || lower.includes('who made') || lower.includes('who created')) {
    return `🚀 **ReadyNest Messenger** — Built by **Archit Shakya**\n\n**Features:**\n- ⚡ Sub-100ms WebSocket messaging\n- 🤖 Full AI Assistant (Gemini)\n- 📞 Voice & Video Calls\n- 🔒 Admin Dashboard\n- 📱 WhatsApp-style Mobile UI`;
  }

  // General fallback
  return `🤖 **ReadyNest AI:**\n\nAapne pucha: *"${prompt.slice(0, 80)}"*\n\nMain samajh raha hoon! Thoda aur detail mein batayein:\n1. Aap specifically kya jaanna chahte hain?\n2. Koi example chahiye?\n3. Code chahiye ya explanation?\n\n**Main kisi bhi topic pe help kar sakta hoon — bas clearly poochein!** 💡`;
}
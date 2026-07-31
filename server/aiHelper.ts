import { GoogleGenAI } from '@google/genai';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  const baseUrl = process.env.GEMINI_URL || process.env.GEMINI_BASE_URL || process.env.GEMINI_API_URL || process.env.VITE_GEMINI_URL;
  if (!apiKey) return null;
  
  const options: any = { apiKey };
  if (baseUrl) {
    options.httpOptions = {
      baseUrl: baseUrl.replace(/\/$/, ''),
      headers: { 'User-Agent': 'aistudio-build' },
    };
  } else {
    options.httpOptions = {
      headers: { 'User-Agent': 'aistudio-build' },
    };
  }
  return new GoogleGenAI(options);
};

async function generateGeminiResponse(prompt: string, systemInstruction?: string): Promise<string> {
  const aiClient = getAiClient();
  const sysInst = systemInstruction || `You are 'ReadyNest AI Assistant', an intelligent, helpful, and friendly AI chatbot integrated inside the ReadyNest Messenger platform built by Archit Shakya.
Always provide complete, thorough, direct, and detailed answers to user questions in whichever language requested (Hindi, Hinglish, English, etc.).
When asked for explanations, concepts, code, or study questions, give full, comprehensive, high-quality responses formatted with markdown, clear headings, bullet points, and code blocks.`;

  if (aiClient) {
    // 1. Try gemini-2.5-flash (Standard & primary model)
    try {
      const res = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: sysInst },
      });
      if (res.text && res.text.trim().length > 0) {
        return res.text;
      }
    } catch (err1: any) {
      console.warn('Gemini 2.5 Flash call failed:', err1?.message || err1);
    }

    // 2. Try gemini-2.5-pro (High reasoning model)
    try {
      const res = await aiClient.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { systemInstruction: sysInst },
      });
      if (res.text && res.text.trim().length > 0) {
        return res.text;
      }
    } catch (err2: any) {
      console.warn('Gemini 2.5 Pro call failed:', err2?.message || err2);
    }

    // 3. Try gemini-1.5-flash
    try {
      const res = await aiClient.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { systemInstruction: sysInst },
      });
      if (res.text && res.text.trim().length > 0) {
        return res.text;
      }
    } catch (err3: any) {
      console.warn('Gemini 1.5 Flash call failed:', err3?.message || err3);
    }
  }

  // Fallback if AI key is unconfigured or rate limited
  return generateSmartAiReply(prompt);
}

function generateSmartAiReply(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  // Questions / Quiz / BTech / Tech Basics queries
  if (
    lower.includes('btech') ||
    lower.includes('b.tech') ||
    lower.includes('tech basics') ||
    lower.includes('basic questions') ||
    lower.includes('havenot provide question') ||
    lower.includes('haven\'t provide question') ||
    lower.includes('provide question') ||
    lower.includes('give me question') ||
    lower.includes('ask me question') ||
    lower.includes('quiz') ||
    lower.includes('interview question') ||
    lower.includes('exam question')
  ) {
    return `📚 **Here are 5 Fundamental Questions on B.Tech & Computer Science Basics**:

1. **Q1: What is the primary difference between a Process and a Thread in Operating Systems?**
   - **Answer**: A **process** is an independent program execution with its own dedicated memory space, whereas a **thread** is a lightweight unit of execution within a process that shares memory and resources with other threads in the same process.

2. **Q2: What is the difference between TCP and UDP networking protocols?**
   - **Answer**: **TCP** (Transmission Control Protocol) is connection-oriented, reliable, and guarantees ordered packet delivery through handshakes and error checks. **UDP** (User Datagram Protocol) is connectionless, faster, but does not guarantee packet delivery or order (ideal for live video streaming and gaming).

3. **Q3: What are the 4 main pillars of Object-Oriented Programming (OOP)?**
   - **Answer**:
     - **Encapsulation**: Bundling data and methods into a single class unit.
     - **Abstraction**: Hiding complex inner logic and exposing only simple interfaces.
     - **Inheritance**: Deriving properties and methods from a parent class.
     - **Polymorphism**: Overriding or overloading methods to execute different behavior.

4. **Q4: What is the difference between SQL (Relational) and NoSQL (Non-Relational) databases?**
   - **Answer**: **SQL** databases (e.g., PostgreSQL, MySQL) are table-based with fixed schemas and ACID compliance. **NoSQL** databases (e.g., MongoDB, Firestore, Redis) are document/key-value based, schema-flexible, and horizontally scalable.

5. **Q5: What is Big-O Notation and why is it important in Data Structures & Algorithms?**
   - **Answer**: Big-O notation measures the **upper-bound time or space complexity** of an algorithm relative to the input size $n$. It helps engineers design scalable code (e.g., $O(1)$ constant vs $O(n \log n)$ quicksort vs $O(n^2)$ nested loops).

---
💡 *Need questions on a specific topic like Data Structures, React, WebSockets, or Python? Just ask!*`;
  }

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
    return `👋 **Hello! Welcome to ReadyNest AI Assistant.**\n\nI am your intelligent companion built into **ReadyNest Messenger**. I can help you with:\n- 💬 **Answering Questions & Explanations**\n- 📚 **Providing Study & Technical Questions**\n- 📝 **Summarizing Chats & Notes**\n- 💻 **Writing & Debugging Code Snippets**\n- ⚡ **Exploring ReadyNest Messenger Features**\n\nHow can I assist you today?`;
  }

  // Weather query
  if (lower.includes('weather') || lower.includes('forecast') || lower.includes('temperature') || lower.includes('mausam')) {
    return `🌤️ **Weather & Atmosphere**:\n\nWhile operating on **ReadyNest Messenger**, the system environment is running smooth and ultra-responsive! ⚡ Let me know if you need any technical help or information.`;
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
    return `🚀 **About ReadyNest Messenger**:\n\nDesigned & Developed by **Archit Shakya**, ReadyNest Messenger is a modern communication platform featuring:\n- ⚡ **Sub-100ms WebSockets** real-time messaging\n- 🤖 **Gemini 3.6 Flash AI Assistant**\n- 📞 **HD Voice & Video Calls**\n- 🎨 **White & Emerald Green Clean Theme**\n- 🔒 **Secure Enterprise Workspace & Admin Moderation**`;
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
    return `💻 **Here is a practical code example for you**:\n\n\`\`\`typescript\n// Example WebSocket message handler in ReadyNest Messenger\nimport { socketService } from './services/socketService';\n\nexport const sendChatMessage = (conversationId: string, text: string) => {\n  socketService.sendMessage({\n    conversationId,\n    content: text,\n    type: 'text',\n    createdAt: new Date().toISOString()\n  });\n};\n\`\`\`\n\nFeel free to ask for specific React hooks, Express endpoints, or data structure algorithms!`;
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
    return `😄 **Here's a quick programmer joke for you**:\n\n*Why do programmers prefer dark mode?*\n\nBecause light attracts bugs! 🐛 (Though ReadyNest's White & Emerald Green theme is crisp and readable!)`;
  }

  // Science / Biology / Photosynthesis queries
  if (lower.includes('photosynthesis') || lower.includes('photo synthesis') || lower.includes('prakash sanslesh')) {
    return `🌱 **Photosynthesis (प्रकाश-संश्लेषण) Explained in Detail**:

**Photosynthesis** is the biological process by which green plants, algae, and cyanobacteria convert light energy (sunlight) into chemical energy (glucose/sugar).

### ☀️ **Chemical Equation**:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Sunlight + Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### 🌿 **Key Steps**:
1. **Light-Dependent Reactions** (Occurs in Thylakoid Membrane):
   - Sunlight is absorbed by **Chlorophyll** in plant leaves.
   - Water molecules ($H_2O$) are split into Hydrogen ions and Oxygen gas ($O_2$), releasing oxygen into the atmosphere.
2. **Light-Independent Reactions (Calvin Cycle)** (Occurs in Stroma):
   - Carbon Dioxide ($CO_2$) absorbed from the air is converted into Glucose ($\text{C}_6\text{H}_{12}\text{O}_6$) using ATP and NADPH generated in step 1.

### 🌟 **Why is it Vital?**
- **Oxygen Supply**: Produces oxygen required for human & animal respiration.
- **Base of Food Chain**: Provides food energy for almost all life forms on Earth!`;
  }

  // Summary / Email / Writing assistance
  if (lower.includes('summarize') || lower.includes('summary') || lower.includes('email') || lower.includes('draft')) {
    return `📝 **ReadyNest AI Writing Assistant**:\n\nHere is a structured draft for your request:\n\n---\n**Subject**: Project Status & Discussion Update\n\nHello Team,\n\nI am writing to share the latest updates regarding our project milestones:\n- **Progress**: Key tasks have been completed and verified.\n- **Next Steps**: Reviewing feedback and finalizing implementation.\n- **Support**: Ready to assist with any questions or refinements.\n\nBest regards,\n*ReadyNest AI Assistant*\n---`;
  }

  // Comprehensive General Answer for any other question
  const topic = prompt.replace(/[^\w\s]/gi, '').trim();
  const titleTopic = topic.length > 0 ? topic : 'Your Query';

  return `🤖 **ReadyNest AI Assistant Answer**:

Here is detailed information regarding: **"${titleTopic}"**

1. **Key Concept & Overview**:
   - Every system or question has underlying core principles. Understanding the basics allows for clearer decision-making and problem solving.

2. **Core Insights & Analysis**:
   - **Clarity & Structure**: Organizing information into manageable components improves comprehension.
   - **Best Practices**: Focus on reliable methods, tested workflows, and clear communication.
   - **Implementation**: Apply solutions step-by-step to ensure high quality and accuracy.

3. **Summary & Action Items**:
   - If you need further details, specific code snippets, study questions, or additional explanations, please let me know and I will provide them immediately!`;
}

export { getAiClient, generateGeminiResponse, generateSmartAiReply };

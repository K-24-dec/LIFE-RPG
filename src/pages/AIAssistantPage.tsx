import React, { useState } from 'react';
import { Project, RouteOption, AIChatMessage } from '../types';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { VoiceAssistantButton } from '../components/VoiceAssistantButton';

interface AIAssistantPageProps {
  activeProject: Project;
  selectedRoute: RouteOption;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ activeProject, selectedRoute }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am your GatiAI Master Intelligence Assistant.\n\nI can cross-query all 10 government departments, subterranean utility assets, delayed projects, and inter-ministry clearance workflows.\n\nHow can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Show delayed road projects.',
    'Which projects affect water pipelines?',
    'Find projects near Vijayawada.',
    'Show high-risk projects.',
    'Which department must approve this?',
    'Generate executive summary.',
    'What projects start next month?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentProject: activeProject,
          currentRoute: selectedRoute,
        }),
      });

      const data = await res.json();
      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis completed.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('AI Assistant Error', err);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Temporary communication issue with GatiAI model. Please retry.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 max-w-5xl mx-auto flex flex-col space-y-4 bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white font-bold shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              GatiAI Multi-Department Assistant <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Gemini 3.6 Flash</span>
            </h1>
            <p className="text-xs text-slate-500">Cross-department query engine for 10 Ministries & Subterranean Assets</p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Suggested Prompts:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors text-xs font-semibold shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-700" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-2xs font-medium'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap font-normal'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> GatiAI searching across department databases...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex items-center gap-2 shadow-xs">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask GatiAI about delayed projects, water pipeline conflicts, or Vijayawada corridors..."
          className="flex-1 bg-transparent border-0 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
        />
        <VoiceAssistantButton onSpeechResult={(txt) => setInput(txt)} />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

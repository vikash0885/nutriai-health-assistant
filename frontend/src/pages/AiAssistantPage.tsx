import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Info,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time?: string;
  referenced_data?: any;
}

export const AiAssistantPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste ${profile?.display_name || ''}! I am your NutriAI assistant powered by Google Gemini. I have access to your verified diary logs for today. You can ask me in English, हिन्दी (Hindi), or Hinglish!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Aaj maine kya khaya aur nutrition kaisa tha?',
    'Mere meal mein protein kaise badhaun?',
    'Saste healthy Indian breakfast ke options batao.',
    'Maine aaj kitna paani piya?',
    'Vegetarian diet mein protein ke best sources kya hain?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await api.sendChatMessage(text.trim(), historyPayload);

      const aiMessage: Message = {
        role: 'assistant',
        content: res.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referenced_data: res.referenced_data,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Service Notice: ${err.message || 'Could not communicate with Gemini.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Title & Gemini Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-600" />
            <span>NutriAI Assistant</span>
          </h1>
          <p className="text-xs text-slate-500">
            Bilingual Hindi & English intelligence grounded in your personal diary data.
          </p>
        </div>

        <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white shadow-sm rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.referenced_data && m.referenced_data.today_calories !== undefined && (
                <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex flex-wrap gap-2">
                  <span>Logged Today: {m.referenced_data.today_calories} kcal</span>
                  <span>•</span>
                  <span>{m.referenced_data.today_protein_g}g Protein</span>
                  <span>•</span>
                  <span>{m.referenced_data.today_water_ml}ml Water</span>
                </div>
              )}

              {m.time && (
                <div
                  className={`text-[9px] text-right mt-1 ${
                    m.role === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Gemini is thinking with your diary context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 px-3 py-1.5 rounded-full transition-colors text-[11px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type your question in English, Hindi, or Hinglish..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !inputMsg.trim()}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <MedicalDisclaimer compact />
    </div>
  );
};

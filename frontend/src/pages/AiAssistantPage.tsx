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
      content: `Namaste ${profile?.display_name || ''}! I am your SehatSense AI assistant. I have access to your verified diary logs for today. You can ask me in English, हिन्दी (Hindi), or Hinglish!`,
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
          content: `Service Notice: ${err.message || 'Could not reach the AI service. Please try again.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Title & Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <span>SehatSense AI Assistant</span>
          </h1>
          <p className="text-sm text-zinc-300 font-medium">
            Bilingual Hindi & English intelligence grounded in your personal diary data.
          </p>
        </div>

        <div className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>SehatSense AI Smart Intelligence</span>
        </div>
      </div>

      {/* Chat Messages Container - Royal Purple AI Theme */}
      <div className="flex-1 bg-gradient-to-br from-[#1a082e]/95 via-[#10041b]/95 to-[#08020e] rounded-3xl p-4 sm:p-6 border border-purple-500/40 shadow-2xl overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                m.role === 'user'
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-black shadow-sm'
                  : 'bg-purple-950/70 text-purple-300 border border-purple-800/60'
              }`}
            >
              {m.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold shadow-md rounded-tr-none'
                  : 'bg-[#160624]/80 text-purple-100 border border-purple-800/60 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.referenced_data && m.referenced_data.today_calories !== undefined && (
                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-300 font-semibold flex flex-wrap gap-2">
                  <span>Logged Today: {m.referenced_data.today_calories} kcal</span>
                  <span>•</span>
                  <span>{m.referenced_data.today_protein_g}g Protein</span>
                  <span>•</span>
                  <span>{m.referenced_data.today_water_ml}ml Water</span>
                </div>
              )}

              {m.time && (
                <div
                  className={`text-xs text-right mt-1 font-medium ${
                    m.role === 'user' ? 'text-black/70' : 'text-zinc-400'
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
            <div className="w-9 h-9 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center justify-center text-sm font-bold">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>SehatSense AI is thinking with your diary context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 bg-black/60 hover:bg-amber-950/40 text-zinc-200 hover:text-amber-300 border border-zinc-800 px-3.5 py-1.5 rounded-full transition-colors text-xs font-semibold cursor-pointer"
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
        className="flex items-center gap-2 bg-gradient-to-r from-[#160626]/95 via-[#0e0319]/95 to-[#07010d] p-2 rounded-2xl border border-purple-500/40 shadow-xl focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-400"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type your question in English, Hindi, or Hinglish..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !inputMsg.trim()}
          className="p-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 hover:from-purple-400 hover:to-fuchsia-400 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <MedicalDisclaimer compact />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Crown, 
  CheckCheck, 
  PhoneCall, 
  Sparkles, 
  HelpCircle,
  FileText,
  Clock
} from 'lucide-react';
import { ChatMessage, Kosha } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, relatedKoshaId?: string, relatedBookingCode?: string) => void;
  attachedKosha?: Kosha | null;
  attachedBookingCode?: string;
  onClearAttachment?: () => void;
  senderRole?: 'customer' | 'owner';
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  attachedKosha,
  attachedBookingCode,
  onClearAttachment,
  senderRole = 'customer',
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    onSendMessage(
      textToSend,
      attachedKosha?.id,
      attachedBookingCode
    );

    if (onClearAttachment) {
      onClearAttachment();
    }

    // Realistic owner auto-response simulation if customer sends
    if (senderRole === 'customer') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };

  const quickQuestions = [
    'هل السعر يشمل التوصيل والتركيب داخل الصالة؟',
    'كم من الوقت يستغرق تركيب الكوشة في الصالة؟',
    'هل يمكن تغيير لون الورد إلى الأبيض مع العنابي؟',
    'أريد حجز موعد للمعاينة على أرض الواقع.',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-r border-[#D4AF37]/40 animate-in slide-in-from-left duration-300"
        id="chat-drawer"
      >
        {/* Chat Drawer Header */}
        <div className="bg-gradient-to-r from-[#5C1320] via-[#801B2E] to-[#5C1320] text-[#F9E8B2] p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#FAF0DF] text-[#801B2E] flex items-center justify-center font-serif font-bold text-base border border-[#D4AF37]">
                𐩴𐩵
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#5C1320]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold font-title text-white">إدارة كوش وأفراح الجعدبي</h3>
              </div>
              <p className="text-[11px] text-[#F3E5AB]">متواجدون للرد الفوري على استفساراتكم وحجوزاتكم</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="tel:777123456"
              className="p-2 rounded-full text-[#F9E8B2] hover:bg-white/10 transition-colors"
              title="اتصال هاتفي مباشر"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#F9E8B2] hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Attached Context (Kosha or Booking Code) */}
        {(attachedKosha || attachedBookingCode) && (
          <div className="bg-[#FAF0E1] border-b border-[#E6DEC8] p-2.5 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className="w-4 h-4 text-[#801B2E] shrink-0" />
              <span className="text-[#5B4636] font-medium truncate">
                {attachedKosha && `بخصوص: ${attachedKosha.name}`}
                {attachedBookingCode && ` | رقم الحجز: ${attachedBookingCode}`}
              </span>
            </div>
            {onClearAttachment && (
              <button
                onClick={onClearAttachment}
                className="text-[#8A7A6A] hover:text-[#801B2E] text-[11px] font-bold shrink-0 mr-2"
              >
                إلغاء الإرفاق
              </button>
            )}
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
          <div className="text-center my-2">
            <span className="text-[10px] bg-[#EFE9DC] text-[#7A6A5A] px-3 py-1 rounded-full border border-[#DDD3BF]">
              محادثة آمنة ومباشرة مع المؤجر
            </span>
          </div>

          {messages.map((msg) => {
            const isMe =
              (senderRole === 'customer' && msg.sender === 'customer') ||
              (senderRole === 'owner' && msg.sender === 'owner');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-[#7A6A5A]">{msg.senderName}</span>
                  <span className="text-[9px] text-[#A6998B]">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#801B2E] text-white rounded-br-xs'
                      : 'bg-white text-[#2B1B10] border border-[#E6DEC8] rounded-bl-xs'
                  }`}
                >
                  {/* Context preview inside message if present */}
                  {msg.relatedKoshaName && (
                    <div
                      className={`text-[10px] pb-1.5 mb-1.5 border-b font-medium flex items-center gap-1 ${
                        isMe ? 'border-white/20 text-[#F9E8B2]' : 'border-[#E8DEC8] text-[#801B2E]'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                      <span>الكوشة المحددة: {msg.relatedKoshaName}</span>
                    </div>
                  )}

                  {msg.relatedBookingCode && (
                    <div
                      className={`text-[10px] pb-1.5 mb-1.5 border-b font-medium flex items-center gap-1 ${
                        isMe ? 'border-white/20 text-[#F9E8B2]' : 'border-[#E8DEC8] text-[#801B2E]'
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      <span>رقم الحجز: {msg.relatedBookingCode}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#7A6A5A] p-2 bg-white rounded-xl border border-[#E6DEC8] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#801B2E] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#801B2E] animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-[#801B2E] animate-bounce delay-200"></span>
              <span className="text-[11px] font-medium">إدارة الجعدبي تكتب الآن...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Chips */}
        <div className="p-2.5 bg-[#F2EDE4] border-t border-[#E6DEC8] overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(q)}
              className="text-[11px] bg-white border border-[#DDD3BF] hover:border-[#801B2E] text-[#5B4636] px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E6DEC8] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب رسالتك أو استفسارك هنا..."
            className="flex-1 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#801B2E] text-[#F9E8B2] hover:bg-[#681424] disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

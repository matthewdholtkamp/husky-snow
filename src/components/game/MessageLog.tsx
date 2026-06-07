import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types';
import { FrostContainer } from '../ui/FrostContainer';
import { Typewriter } from '../effects/Typewriter';

interface MessageLogProps {
  messages: Message[];
}

export const MessageLog: React.FC<MessageLogProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <FrostContainer
      className="flex-1 min-h-0 p-0"
      contentClassName="h-full min-h-0 overflow-y-auto custom-scrollbar p-4 md:p-6 flex flex-col"
      noBorder
    >
      <div className="flex-1 min-h-4" /> {/* Spacer to push messages down initially */}

      <div 
        className="flex flex-col gap-4 md:gap-6"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';
          const isModel = msg.role === 'model';
          const isRoll = msg.isRoll;

          if (isSystem) {
             return (
               <motion.div
                 key={msg.id || idx}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-center py-2"
               >
                 <span className="text-xs font-serif text-slate-400 uppercase tracking-widest px-3 py-1 border-y border-white/10">
                   {msg.text}
                 </span>
               </motion.div>
             );
          }

          if (isRoll) {
            return (
              <motion.div
                key={msg.id || idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="self-center my-2 bg-black/40 border border-indigo-500/30 rounded px-4 py-2 text-indigo-200 font-mono text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                {msg.text}
              </motion.div>
            );
          }

          const isLatest = idx === messages.length - 1;

          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col max-w-[90%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
            >
               {/* Author Name */}
               <span className={`text-[10px] uppercase tracking-wider mb-1 ${isUser ? 'text-slate-400 mr-1' : 'text-sky-300 ml-1 font-bold'}`}>
                 {msg.author || (isUser ? 'You' : 'Quinn')}
               </span>

               {/* Bubble */}
               <div className={`
                 relative px-5 py-4 rounded-2xl text-base leading-relaxed font-serif shadow-sm
                 ${isUser
                   ? 'bg-white/10 text-slate-100 rounded-br-none border border-white/5'
                   : 'bg-black/40 text-slate-200 rounded-bl-none border border-white/10 backdrop-blur-md'
                 }
               `}>
                 {isModel && isLatest ? (
                   <Typewriter 
                     text={msg.text} 
                     onComplete={() => {
                       bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                     }}
                   />
                 ) : (
                   <div className="whitespace-pre-wrap">{msg.text}</div>
                 )}
               </div>
            </motion.div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </FrostContainer>
  );
};

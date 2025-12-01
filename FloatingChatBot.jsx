import React, { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, ChatMessage } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useClickOutside } from '../../hooks/useClickOutside';
import * as Icons from './Icons';
import Button from './Button';
import Spinner from './Spinner';
import { streamAssistanceResponse } from '../../services/geminiService';

const pageToName = (page) => {
    return page.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const TypingIndicator.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

const FloatingChatBot.FC<{ currentPage }> = ({ currentPage }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chatPanelRef = useRef(null);
    const chatBodyRef = useRef(null);

    const closeAndClearChat = useCallback(() => {
        setIsOpen(false);
        setMessages([]);
    }, []);

    useClickOutside(chatPanelRef, closeAndClearChat);
    
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    
    const handleNewChat = () => {
        setMessages([]);
    }
    
    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage = { role: 'user', parts{ text }] };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        const pageName = pageToName(currentPage);
        const context = `You are a friendly and helpful AI assistant for the Web Scratch platform. The user is currently on the "${pageName}" page. Your answers should be concise, helpful, and relevant to this page. Address the user by their name, ${user?.fullName?.split(' ')[0] || 'there'}.`;

        try {
            const stream = await streamAssistanceResponse(context, currentInput);
            
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', parts{ text: '' }] }]);

            for await (const chunk of stream) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', parts{ text }] };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', parts{ text }] };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            
                {isOpen && (
                    <motion.div
                        ref={chatPanelRef}
                        initial={{ opacity, x, scale.9 }}
                        animate={{ opacity, x, scale }}
                        exit={{ opacity, x, scale.9 }}
                        transition={{ type: 'spring', damping, stiffness }}
                        className="fixed bottom-24 right-5 w-[min(360px,calc(100vw-2.5rem))] h-[min(550px,75vh)] bg-dark-bg/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glow-cyan-lg flex flex-col z-[9998]"
                    >
                        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                             
                                <h3 className="font-bold text-lg text-white">Web Scratch Assistant</h3>
                                <p className="text-xs text-text-secondary">Context: {pageToName(currentPage)}</p>
                            </div>
                            <div className="flex items-center">
                                <Button size="sm" variant="ghost" iconOnly onClick={handleNewChat} title="New Chat"><Icons.PlusIcon className="w-5 h-5" /></Button>
                                <Button size="sm" variant="ghost" iconOnly onClick={closeAndClearChat} title="Close Chat"><Icons.CloseIcon className="w-5 h-5" /></Button>
                            </div>
                        </header>
                        <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto space-y-4 disclaimer-scroll">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity, y }}
                                    animate={{ opacity, y }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs md-w-sm rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary-gradient text-white rounded-br-none' : 'bg-white/5 text-text-main rounded-bl-none'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity, y }} animate={{ opacity, y }} className="flex justify-start">
                                    <div className="max-w-xs md-w-sm rounded-2xl px-4 py-3 bg-white/5 text-text-main rounded-bl-none">
                                        <TypingIndicator />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        <footer className="p-4 border-t border-white/10 flex-shrink-0">
                            <form onSubmit={handleSend} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Ask about this page..."
                                    className="flex-1 px-3 py-2 border rounded-md shadow-sm focus-none focus-2 border-white/[.08] focus-secondary focus-secondary bg-white/5 text-white placeholder-muted"
                                />
                                <Button type="submit" variant="primary" iconOnly disabled={isLoading || !userInput.trim()}>
                                    <Icons.PaperAirplaneIcon className="w-5 h-5" />
                                </Button>
                            </form>
                            <p className="text-xs text-muted text-center mt-2">This chat is temporary — messages are not stored or shared.</p>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button
                title="Ask Web Scratch Assistant"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-primary-gradient shadow-glow-cyan-lg flex items-center justify-center text-white z-[9999] cursor-pointer animate-pulse-subtle"
                whileHover={{ scale.1, animation: 'none' }}
                whileTap={{ scale.9 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isOpen ? 'close' : 'chat'}
                        initial={{ opacity, rotate: -30, scale.8 }}
                        animate={{ opacity, rotate, scale }}
                        exit={{ opacity, rotate, scale.8 }}
                        transition={{ duration.2 }}
                    >
                        {isOpen ? <Icons.CloseIcon className="w-8 h-8" /> : <Icons.SparklesIcon className="w-8 h-8" />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </>
    );
};

export default FloatingChatBot;
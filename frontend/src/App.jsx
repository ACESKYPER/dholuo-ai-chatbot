import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Bot, Moon, Sun } from 'lucide-react';

// Self-contained theme-aware Chat App
export default function App() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Karibu — welcome to Remb Luo (Dholuo chatbot)!', role: 'model', timestamp: { seconds: Date.now() / 1000 } },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Apply theme class to html element
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), text: input.trim(), role: 'user', timestamp: { seconds: Date.now() / 1000 } };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setIsLoading(true);

        // optimistic AI placeholder
        const temp = { id: 'temp-' + Date.now(), text: 'Thinking...', role: 'model', isFetching: true, timestamp: { seconds: Date.now() / 1000 } };
        setMessages((m) => [...m, temp]);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userMsg.text }),
            });
            const data = await res.json();
            const botText = data?.response || data?.reply || 'Aonge maber — no reply.';

            // remove temp and add real response
            setMessages((m) => [...m.filter((x) => !x.isFetching), { id: Date.now()+1, text: botText, role: 'model', timestamp: { seconds: Date.now() / 1000 } }]);
        } catch (err) {
            console.error(err);
            setMessages((m) => [...m.filter((x) => !x.isFetching), { id: Date.now()+2, text: 'Error: could not reach backend.', role: 'model', timestamp: { seconds: Date.now() / 1000 } }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    const Bubble = ({ msg }) => {
        const isUser = msg.role === 'user';
        const base = 'max-w-[80%] p-3 rounded-2xl shadow-xl transition';
        const userClasses = 'bg-blue-500 text-white rounded-br-md rounded-tl-2xl ml-auto';
        const modelLight = 'bg-white text-gray-800 rounded-bl-md rounded-tr-2xl border border-gray-100';
        const modelDark = 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 bg-white text-gray-800 rounded-bl-md rounded-tr-2xl border border-gray-100';

        return (
            <div className={`w-full flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`${base} ${isUser ? userClasses : (theme === 'dark' ? modelDark : modelLight)}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                    {msg.timestamp && (
                        <div className="text-[11px] text-gray-400 mt-2 text-right">{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <style>
                {`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }`}
            </style>

            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Bot className="text-blue-600" />
                    <h1 className="text-lg font-semibold">Dholuo AI Chatbot</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-3xl">
                    {messages.map((m) => (
                        <Bubble key={m.id} msg={m} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? 'Waiting for response...' : 'Type your message in Dholuo...'}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className={`p-3 rounded-full ${!input.trim() || isLoading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition`}
                        aria-label="Send message"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : <Send />}
                    </button>
                </form>
            </footer>
        </div>
    );
}
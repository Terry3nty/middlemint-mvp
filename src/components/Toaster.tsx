'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md
              animate-in slide-in-from-right-5 fade-in duration-300
              ${t.type === 'success' ? 'bg-[#14F195]/20 border border-[#14F195]/40 text-[#14F195]' : ''}
              ${t.type === 'error' ? 'bg-red-500/20 border border-red-500/40 text-red-400' : ''}
              ${t.type === 'info' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' : ''}
            `}
                    >
                        {t.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        {t.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {t.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}

                        <span className="text-sm text-white flex-1">{t.message}</span>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

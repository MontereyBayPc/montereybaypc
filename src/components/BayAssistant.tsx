import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/Logo';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';

const KEY = 'mbpc_bay_chat';
function savedMessages(): UIMessage[] { try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
const transport = new DefaultChatTransport({ api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pc-assistant`, headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } });

export default function BayAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [initial] = useState(savedMessages);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({ id: 'bay', messages: initial, transport });
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(messages)); } catch { /* storage may be disabled */ } }, [messages]);
  useEffect(() => { if (open && !busy) textarea.current?.focus(); }, [open, busy]);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  return <>
    {!open && <Button onClick={() => setOpen(true)} aria-label="Chat with Bay AI" className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 rounded-full h-12 w-12 lg:h-14 lg:w-auto p-2 lg:px-4 bg-brand text-brand-foreground shadow-lg print:hidden"><LogoMark className="h-8 w-8" /><span className="font-heading hidden lg:inline">Ask Bay <span className="text-xs opacity-70">AI</span></span></Button>}
    {open && <section aria-label="Bay AI assistant" className="fixed z-50 inset-x-3 bottom-24 lg:inset-x-auto lg:right-6 lg:bottom-6 w-auto lg:w-[390px] h-[min(560px,calc(100dvh-120px))] flex flex-col bg-background border border-border rounded-2xl shadow-2xl print:hidden overflow-hidden">
      <header className="flex items-center gap-3 p-4 border-b border-border shrink-0"><LogoMark /><div className="flex-1 min-w-0"><h2 className="font-heading font-semibold">Bay / PC adviser</h2><p className="text-xs text-muted-foreground">Monterey Bay PCs AI assistant</p></div><Button title="Clear chat" aria-label="Clear chat" size="icon-sm" variant="ghost" disabled={busy} onClick={() => setMessages([])}><RotateCcw /></Button><Button title="Close assistant" aria-label="Close assistant" size="icon-sm" variant="ghost" onClick={() => setOpen(false)}><X /></Button></header>
      <Conversation className="min-h-0 flex-1"><ConversationContent className="p-4 gap-5">
        {!messages.length && <div className="space-y-4"><h3 className="font-heading text-xl">Let's find your next PC.</h3><p className="text-sm text-muted-foreground">What do you play, create, or need help fixing?</p><div className="flex flex-wrap gap-2">{['A gaming PC under $1,600','Help with an overheating PC','Can I use my own parts?'].map(text => <Button key={text} variant="outline" size="sm" className="h-auto whitespace-normal rounded-full text-left text-xs" onClick={() => sendMessage({ text })}>{text}</Button>)}</div></div>}
        {messages.map(message => <Message from={message.role} key={message.id}><MessageContent className={message.role === 'user' ? 'bg-primary text-primary-foreground rounded-xl' : 'bg-transparent text-foreground'}>{message.parts.map((part,i) => part.type === 'text' ? <MessageResponse key={i}>{part.text}</MessageResponse> : part.type === 'reasoning' ? <Reasoning key={i} defaultOpen={false} isStreaming={busy}><ReasoningTrigger /><ReasoningContent>{part.text}</ReasoningContent></Reasoning> : null)}</MessageContent></Message>)}
        {status === 'submitted' && <Shimmer>Thinking...</Shimmer>}
        {error && <p role="alert" className="text-sm text-destructive break-words">{error.message || 'Assistant unavailable. Please call (831) 718-7730.'}</p>}
      </ConversationContent><ConversationScrollButton /></Conversation>
      <div className="p-3 border-t border-border shrink-0"><PromptInput onSubmit={({ text }) => { if (!text.trim() || busy) return; setInput(''); void sendMessage({ text: text.trim() }); textarea.current?.focus(); }}><PromptInputTextarea ref={textarea} aria-label="Message Bay" placeholder="Games, budget, or a PC question..." value={input} onChange={e => setInput(e.target.value)} maxLength={2000} className="min-h-[64px] max-h-28 text-sm" /><PromptInputFooter className="justify-end"><PromptInputSubmit status={status} onStop={stop} disabled={!busy && !input.trim()} /></PromptInputFooter></PromptInput><p className="mt-2 text-[10px] text-muted-foreground">AI can make mistakes. Confirm parts and pricing with us. Chat stays on this device.</p></div>
    </section>}
  </>;
}
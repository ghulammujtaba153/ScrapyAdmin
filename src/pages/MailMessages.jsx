import React, { useState, useEffect, useRef } from 'react';
import api from '../config/url';
import { Card } from 'antd';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import {
  FaEnvelope,
  FaPlus,
  FaPaperPlane,
  FaSync,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaEnvelopeOpen,
  FaReply,
  FaArrowLeft,
  FaInbox
} from 'react-icons/fa';

// ─── Gmail-like email body renderer ───
const EmailBody = ({ html, text }) => {
  const iframeRef = useRef();

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      const styledHtml = `
        <html>
          <head>
            <style>
              body { 
                font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;
                margin: 0; padding: 16px; 
                font-size: 14px; line-height: 1.6; 
                color: #202124; 
              }
              img { max-width: 100%; height: auto; }
              a { color: #1a73e8; }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `;
      doc.write(styledHtml);
      doc.close();
    }
  }, [html]);

  if (!html) {
    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
        {text || '(No content)'}
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title="Email Preview"
      className="w-full min-h-[80px] max-h-[400px] border-0 bg-white"
      sandbox="allow-same-origin"
      style={{ overflow: 'auto' }}
    />
  );
};

// ─── Single collapsed message card (Gmail-style) ───
const CollapsedMessage = ({ msg, onClick }) => {
  const isInbound = msg.direction === 'inbound';
  const preview = msg.text?.substring(0, 80) || (msg.html ? 'HTML message' : '(No content)');
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3 transition-colors group"
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
        isInbound 
          ? 'bg-blue-100 text-blue-600' 
          : 'bg-emerald-100 text-emerald-600'
      }`}>
        {isInbound ? msg.from?.charAt(0).toUpperCase() : 'M'}
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-700">
          {isInbound ? msg.from : 'Me'}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          — {preview}
        </span>
      </div>

      <span className="text-[11px] text-gray-400 flex-shrink-0">
        {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </span>
      
      <FaChevronRight className="text-gray-300 text-xs group-hover:text-gray-500 transition-colors" />
    </button>
  );
};

// ─── Single expanded message card (Gmail-style) ───
const ExpandedMessage = ({ msg, onCollapse }) => {
  const isInbound = msg.direction === 'inbound';
  const time = new Date(msg.createdAt).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="border-b border-gray-100">
      {/* Message Header */}
      <button
        onClick={onCollapse}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors"
      >
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 ${
          isInbound 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-emerald-100 text-emerald-600'
        }`}>
          {isInbound ? msg.from?.charAt(0).toUpperCase() : 'M'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-bold text-gray-800">
                {isInbound ? msg.from : 'Me'}
              </span>
              {!isInbound && (
                <span className="text-xs text-gray-400 ml-1.5">
                  (grow@mapharvest.live)
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">
              to {isInbound ? 'me' : msg.to?.join(', ')}
            </span>
            <FaChevronDown className="text-gray-300 text-[8px]" />
          </div>
        </div>
      </button>

      {/* Message Body */}
      <div className="px-5 pb-5 pl-[68px]">
        <EmailBody html={msg.html} text={msg.text} />
      </div>
    </div>
  );
};


const MailMessages = () => {
  // State
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null); // threadId string
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMsgIds, setExpandedMsgIds] = useState(new Set());

  // Loading states
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [sendingCompose, setSendingCompose] = useState(false);

  // UI toggles
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  // Form state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [replyBody, setReplyBody] = useState('');

  // Toast alert
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const messagesEndRef = useRef(null);

  const triggerAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 4000);
  };

  // Fetch threads on mount
  useEffect(() => {
    fetchThreads();
  }, []);

  // Fetch messages when thread selected
  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread);
    } else {
      setMessages([]);
      setExpandedMsgIds(new Set());
      setReplyOpen(false);
    }
  }, [selectedThread]);

  const fetchThreads = async () => {
    try {
      setLoadingThreads(true);
      const res = await api.get('/mails/threads');
      if (res.data.success) {
        setThreads(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      triggerAlert('Failed to load email threads', 'error');
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchMessages = async (threadId) => {
    try {
      setLoadingMessages(true);
      const res = await api.get(`/mails/thread/${encodeURIComponent(threadId)}`);
      if (res.data.success) {
        const msgs = res.data.data;
        setMessages(msgs);
        
        // Gmail behavior: expand the last message, collapse the rest
        if (msgs.length > 0) {
          setExpandedMsgIds(new Set([msgs[msgs.length - 1]._id]));
        }
        
        // Clear unread locally
        setThreads(prev =>
          prev.map(t => (t._id === threadId ? { ...t, unreadCount: 0 } : t))
        );
      }
    } catch (error) {
      console.error('Error fetching thread messages:', error);
      triggerAlert('Failed to load thread messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const toggleMessage = (msgId) => {
    setExpandedMsgIds(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) {
        next.delete(msgId);
      } else {
        next.add(msgId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedMsgIds(new Set(messages.map(m => m._id)));
  };

  // Get thread metadata for the selected thread
  const activeThread = threads.find(t => t._id === selectedThread);
  const activeSubject = messages[0]?.subject?.replace(/^(re:\s*|fwd?:\s*)+/i, '') || activeThread?.latestMessage?.subject?.replace(/^(re:\s*|fwd?:\s*)+/i, '') || 'Conversation';
  const activeContact = activeThread?.contactEmail || messages[0]?.contactEmail || '';

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim() || !selectedThread) return;

    try {
      setSendingReply(true);
      const replySubject = `Re: ${activeSubject}`;

      const res = await api.post('/mails/send', {
        to: activeContact,
        subject: replySubject,
        text: replyBody,
        threadId: selectedThread // pass existing threadId so it groups correctly
      });

      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        setReplyBody('');
        setReplyOpen(false);
        // Expand the new message
        setExpandedMsgIds(prev => new Set([...prev, res.data.data._id]));
        triggerAlert('Reply sent successfully!', 'success');
        fetchThreads();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      triggerAlert(error.response?.data?.error || 'Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleSendCompose = async (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      triggerAlert('Please fill in all fields', 'error');
      return;
    }

    try {
      setSendingCompose(true);
      const res = await api.post('/mails/send', {
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        text: composeBody
      });

      if (res.data.success) {
        setComposeOpen(false);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        triggerAlert('Email sent successfully!', 'success');
        // Select the new thread
        setSelectedThread(res.data.data.threadId);
        fetchThreads();
      }
    } catch (error) {
      console.error('Error composing:', error);
      triggerAlert(error.response?.data?.error || 'Failed to send email', 'error');
    } finally {
      setSendingCompose(false);
    }
  };

  // Filter threads
  const filteredThreads = threads.filter(thread => {
    const term = searchTerm.toLowerCase();
    const matchesEmail = thread.contactEmail?.toLowerCase().includes(term);
    const matchesSubject = thread.latestMessage?.subject?.toLowerCase().includes(term);
    return matchesEmail || matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Mail messages"
        subtitle="View and reply to inbound and outbound email threads"
      />

      <Card bordered={false} className="shadow-sm" styles={{ body: { padding: 0 } }}>
    <div className="flex h-[calc(100vh-10rem)] bg-white overflow-hidden relative">

      {/* ─── Toast Alert ─── */}
      {alert.show && (
        <div className={`absolute top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm transition-all duration-300 ${
          alert.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-200/80'
            : 'bg-red-50 text-red-800 border-red-200/80'
        }`}>
          {alert.type === 'success' ? (
            <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-red-500 text-lg flex-shrink-0" />
          )}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* LEFT PANEL: Thread List (Gmail Sidebar) */}
      {/* ═══════════════════════════════════════ */}
      <div className="w-full md:w-[360px] flex-shrink-0 border-r border-gray-200/60 flex flex-col bg-gray-50/30 h-full">
        
        {/* Inbox Header */}
        <div className="p-4 border-b border-gray-200/60 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
              <FaInbox className="text-primary" />
              Inbox
            </h1>
            <button
              onClick={() => setComposeOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-xs shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              title="Compose"
            >
              <FaPlus className="text-[10px]" />
              <span>Compose</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100/80 focus:bg-white text-gray-700 placeholder-gray-400 pl-9 pr-4 py-2 rounded-xl border border-transparent focus:border-gray-300 focus:ring-1 focus:ring-gray-200 outline-none text-sm transition-all"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingThreads ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <FaSpinner className="animate-spin text-primary text-2xl" />
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Loading</span>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <FaEnvelopeOpen className="text-gray-300 text-xl" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No conversations</p>
              <p className="text-xs text-gray-400 mt-1">Compose a new email to get started</p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isActive = selectedThread === thread._id;
              const hasUnread = thread.unreadCount > 0;
              const latestMsg = thread.latestMessage || {};
              const contact = thread.contactEmail || thread._id;
              const initial = contact.charAt(0).toUpperCase();
              const msgCount = thread.messageCount || 1;

              // Clean subject (strip Re:/Fwd: for display)
              const displaySubject = (latestMsg.subject || '(No Subject)')
                .replace(/^(re:\s*|fwd?:\s*)+/i, '');

              const relativeTime = latestMsg.createdAt
                ? new Date(latestMsg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                : '';

              const preview = latestMsg.text?.substring(0, 60) || 'No preview available';

              return (
                <button
                  key={thread._id}
                  onClick={() => setSelectedThread(thread._id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 flex items-start gap-3 transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50/70 border-l-[3px] border-l-primary'
                      : hasUnread
                        ? 'bg-white hover:bg-gray-50 font-semibold'
                        : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {initial}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {contact}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {msgCount > 1 && (
                          <span className="text-[10px] text-gray-400 font-medium">{msgCount}</span>
                        )}
                        <span className="text-[11px] text-gray-400">
                          {relativeTime}
                        </span>
                      </div>
                    </div>

                    <h4 className={`text-xs mt-0.5 truncate ${hasUnread ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>
                      {displaySubject}
                    </h4>

                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {latestMsg.direction === 'outbound' ? 'Me: ' : ''}{preview}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {hasUnread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-3 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer sync */}
        <div className="p-2.5 bg-white border-t border-gray-200/60 flex justify-center">
          <button
            onClick={fetchThreads}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-gray-50"
          >
            <FaSync className={loadingThreads ? 'animate-spin text-primary' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* RIGHT PANEL: Thread View (Gmail Main Area) */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {selectedThread ? (
          <>
            {/* ─── Thread Header ─── */}
            <div className="px-5 py-3.5 border-b border-gray-200/60 bg-white flex items-center gap-3 z-10 flex-shrink-0">
              {/* Back button (mobile-friendly) */}
              <button
                onClick={() => setSelectedThread(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all md:hidden"
              >
                <FaArrowLeft />
              </button>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {activeSubject}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {activeContact}
                  </span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-xs text-gray-400">
                    {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {messages.length > 1 && (
                  <button
                    onClick={expandAll}
                    className="text-xs text-gray-400 hover:text-primary px-2 py-1 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Expand all
                  </button>
                )}
                <button
                  onClick={() => fetchMessages(selectedThread)}
                  className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-50 transition-all"
                  title="Refresh thread"
                >
                  <FaSync className={`text-sm ${loadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* ─── Messages Stream ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <FaSpinner className="animate-spin text-primary text-3xl" />
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Loading messages</span>
                </div>
              ) : (
                <div className="border-t border-gray-100">
                  {messages.map((msg) => {
                    const isExpanded = expandedMsgIds.has(msg._id);

                    return isExpanded ? (
                      <ExpandedMessage
                        key={msg._id}
                        msg={msg}
                        onCollapse={() => toggleMessage(msg._id)}
                      />
                    ) : (
                      <CollapsedMessage
                        key={msg._id}
                        msg={msg}
                        onClick={() => toggleMessage(msg._id)}
                      />
                    );
                  })}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ─── Reply Section (Gmail-style) ─── */}
            <div className="border-t border-gray-200/60 bg-gray-50/50 flex-shrink-0">
              {!replyOpen ? (
                /* Collapsed reply bar */
                <button
                  onClick={() => setReplyOpen(true)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all text-sm"
                >
                  <FaReply className="text-gray-400" />
                  <span>Reply to {activeContact}...</span>
                </button>
              ) : (
                /* Expanded reply composer */
                <form onSubmit={handleSendReply} className="p-4">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Reply header */}
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <FaReply className="text-gray-400 text-xs" />
                        <span className="text-xs text-gray-500">
                          Reply to <strong className="text-gray-700">{activeContact}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setReplyOpen(false); setReplyBody(''); }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>

                    {/* Reply body */}
                    <textarea
                      placeholder="Write your reply..."
                      rows="4"
                      required
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none border-0"
                      autoFocus
                    />

                    {/* Reply footer */}
                    <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                      <div />
                      <button
                        type="submit"
                        disabled={sendingReply || !replyBody.trim()}
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all duration-200"
                      >
                        {sendingReply ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </>
        ) : (
          /* ─── Empty state ─── */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <FaEnvelope className="text-gray-300 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-600">Select a conversation</h2>
            <p className="text-gray-400 max-w-sm mt-2 text-sm">
              Choose a thread from the sidebar to view the conversation, or compose a new email.
            </p>
            <button
              onClick={() => setComposeOpen(true)}
              className="mt-5 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200"
            >
              <FaPlus />
              Compose
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════ */}
      {/* COMPOSE MODAL (Gmail Overlay)  */}
      {/* ═══════════════════════════════ */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800 text-white flex items-center justify-between rounded-t-2xl">
              <h3 className="text-sm font-bold">New Message</h3>
              <button
                onClick={() => setComposeOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded transition-all"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendCompose} className="flex-1 flex flex-col">
              <div className="border-b border-gray-100">
                <div className="flex items-center px-4 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400 w-10">To</span>
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none py-1"
                  />
                </div>
                <div className="flex items-center px-4 py-2">
                  <span className="text-xs text-gray-400 w-10">Subject</span>
                  <input
                    type="text"
                    placeholder="Subject"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none py-1"
                  />
                </div>
              </div>

              <textarea
                placeholder="Compose email..."
                required
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none resize-none min-h-[200px]"
              />

              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={sendingCompose}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  {sendingCompose ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      </Card>
    </div>
  );
};

export default MailMessages;
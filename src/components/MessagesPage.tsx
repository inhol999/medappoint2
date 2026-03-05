'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

function getDisplayName(user: any) {
  if (!user) return 'Unknown';
  if (user.admin) return user.admin.name;
  if (user.doctor) return user.doctor.fullName;
  if (user.patient) return user.patient.fullName;
  return user.username;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = parseInt((session?.user as any)?.id || '0');

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeUser) fetchMessages(activeUser.userId);
  }, [activeUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchConversations() {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setConversations(Array.isArray(data) ? data : []);
  }

  async function fetchMessages(userId: number) {
    const res = await fetch(`/api/messages?with=${userId}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  }

  async function fetchAllUsers() {
    const res = await fetch('/api/users');
    const data = await res.json();
    setAllUsers(Array.isArray(data) ? data.filter((u: any) => u.userId !== currentUserId) : []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || !activeUser) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: activeUser.userId, content: newMsg }),
    });
    setNewMsg('');
    fetchMessages(activeUser.userId);
    fetchConversations();
  }

  const role = (session?.user as any)?.role;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="dash-topbar">
        <h1 className="dash-title">Messages</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowNew(true); fetchAllUsers(); }}>+ New Message</button>
      </div>

      <div className="msg-layout" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Conversation List */}
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">Conversations</div>
          {conversations.length === 0 && (
            <div style={{ padding: '2rem', color: 'var(--gray2)', fontSize: '0.875rem', textAlign: 'center' }}>
              No conversations yet.<br />Start a new message.
            </div>
          )}
          {conversations.map((conv: any, i) => {
            const name = getDisplayName(conv.user);
            return (
              <div
                key={i}
                className={`msg-contact ${activeUser?.userId === conv.user?.userId ? 'active' : ''}`}
                onClick={() => setActiveUser(conv.user)}
              >
                <div className="msg-avatar">{getInitials(name)}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="msg-contact-name">{name}</div>
                    {conv.unread > 0 && <span className="badge badge-blue">{conv.unread}</span>}
                  </div>
                  <div className="msg-contact-preview">{conv.lastMessage}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className="msg-chat">
          {activeUser ? (
            <>
              <div className="msg-chat-header">
                {getDisplayName(activeUser)}
                <span style={{ fontSize: '0.75rem', color: 'var(--gray2)', marginLeft: '0.5rem' }}>
                  {activeUser.role}
                </span>
              </div>
              <div className="msg-messages">
                {messages.map((m: any) => {
                  const isSent = m.senderId === currentUserId;
                  return (
                    <div key={m.messageId} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                      <div className={`msg-bubble ${isSent ? 'sent' : 'recv'}`}>
                        {m.content}
                        <div className="msg-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form className="msg-input-wrap" onSubmit={sendMessage}>
                <input
                  className="msg-input"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit" className="btn btn-blue" disabled={!newMsg.trim()}>Send</button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--gray2)', fontSize: '0.875rem' }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">New Message</h2>
            <div className="form-group">
              <label className="form-label">Search user</label>
              <input className="form-input" placeholder="Search by name..." value={searchUser} onChange={e => setSearchUser(e.target.value)} />
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: '6px' }}>
              {allUsers
                .filter(u => {
                  const name = getDisplayName(u).toLowerCase();
                  return !searchUser || name.includes(searchUser.toLowerCase()) || u.username.includes(searchUser.toLowerCase());
                })
                .map(u => (
                  <div
                    key={u.userId}
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid var(--line)' }}
                    onClick={() => { setActiveUser(u); setShowNew(false); fetchMessages(u.userId); }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <div className="msg-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>{getInitials(getDisplayName(u))}</div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{getDisplayName(u)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray2)' }}>{u.role} · @{u.username}</div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

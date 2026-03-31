/* ============================================
   Messaging Module
   ============================================ */
const Messaging = (() => {
  async function getOrCreateConversation(userId) {
    const convos = await CarDB.query('conversations', c => c.userId === userId);
    if (convos.length > 0) return convos[0];

    const admins = await CarDB.getByIndex('users', 'role', 'admin');
    const adminId = admins.length > 0 ? admins[0].id : 1;

    const id = await CarDB.add('conversations', {
      userId,
      adminId,
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadUser: 0,
      unreadAdmin: 0
    });
    return await CarDB.get('conversations', id);
  }

  async function sendMessage(conversationId, senderId, senderRole, text) {
    if (!text.trim()) return;

    const msgId = await CarDB.add('messages', {
      conversationId,
      senderId,
      text: text.trim(),
      timestamp: Date.now(),
      seen: false,
      senderRole
    });

    const convo = await CarDB.get('conversations', conversationId);
    if (convo) {
      convo.lastMessage = text.trim().substring(0, 50);
      convo.lastMessageTime = Date.now();
      if (senderRole === 'user') {
        convo.unreadAdmin = (convo.unreadAdmin || 0) + 1;
      } else {
        convo.unreadUser = (convo.unreadUser || 0) + 1;
      }
      await CarDB.put('conversations', convo);
    }

    return msgId;
  }

  async function getMessages(conversationId) {
    const msgs = await CarDB.getByIndex('messages', 'conversationId', conversationId);
    return msgs.sort((a, b) => a.timestamp - b.timestamp);
  }

  async function getUserConversations(userId) {
    return await CarDB.query('conversations', c => c.userId === userId);
  }

  async function getAllConversations() {
    return await CarDB.getAll('conversations');
  }

  async function markAsRead(conversationId, role) {
    const convo = await CarDB.get('conversations', conversationId);
    if (!convo) return;
    if (role === 'user') {
      convo.unreadUser = 0;
    } else {
      convo.unreadAdmin = 0;
    }
    await CarDB.put('conversations', convo);

    const msgs = await getMessages(conversationId);
    for (const msg of msgs) {
      if (!msg.seen && msg.senderRole !== role) {
        msg.seen = true;
        await CarDB.put('messages', msg);
      }
    }
  }

  async function getUnreadCount(userId, role) {
    if (role === 'admin') {
      const convos = await getAllConversations();
      return convos.reduce((sum, c) => sum + (c.unreadAdmin || 0), 0);
    }
    const convos = await getUserConversations(userId);
    return convos.reduce((sum, c) => sum + (c.unreadUser || 0), 0);
  }

  return { getOrCreateConversation, sendMessage, getMessages, getUserConversations, getAllConversations, markAsRead, getUnreadCount };
})();

window.Messaging = Messaging;

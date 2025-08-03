import { supabase } from './supabase.js';

export async function getOrCreateChat(userIds) {
  const sortedIds = userIds.slice().sort();
  const [user1, user2] = sortedIds;

  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .or(`and(user1.eq.${user1},user2.eq.${user2}),and(user1.eq.${user2},user2.eq.${user1})`)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('getOrCreateChat error:', error);
    return null;
  }

  if (chats) return chats;

  const { data: newChat, error: insertError } = await supabase
    .from('chats')
    .insert({ user1, user2 })
    .select()
    .single();

  if (insertError) {
    console.error('insert chat error:', insertError);
    return null;
  }

  return newChat;
}

export function subscribeMessages(chatId, callback) {
  return supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

export async function sendMessage(chatId, content, senderId) {
  const { error } = await supabase.from('messages').insert({
    chat_id: chatId,
    sender: senderId,
    content: content,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error('sendMessage error:', error);
  }
}

export async function getUserChats(userId) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .or(`user1.eq.${userId},user2.eq.${userId}`)
    .order('created_at', { ascending: false }); // ← исправлено

  if (error) {
    console.error('getUserChats error:', error);
    return [];
  }

  return data;
}

export function showChat(user) {
  console.log('[DOT] showChat called with user:', user);
}

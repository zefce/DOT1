import { supabase } from './supabase.js';
import { signUpWithEmail, signInWithEmailPassword } from './auth.js';
import { sendMessage, subscribeMessages, getUserChats } from './chats.js';

export function showLoginModal() {
  const dotCore = document.getElementById('dot-core');
  if (dotCore) dotCore.style.visibility = 'hidden';

  const main = document.getElementById('main-content');
  if (!main) {
    console.error('showLoginModal: #main-content not found');
    return;
  }

  main.style.minHeight = '100vh';
  main.style.display = 'flex';
  main.style.alignItems = 'center';
  main.style.justifyContent = 'center';

  main.innerHTML = `
    <div id="login-modal" class="login-modal">
      <div class="dot-slogan">Welcome to DOT</div>
      <input id="email-input" type="email" placeholder="Email" />
      <input id="password-input" type="password" placeholder="Password" />
      <button id="login-btn">Login</button>
      <button id="register-btn">Register</button>
    </div>
  `;

  document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    if (!email || !password) return alert('Enter email and password');
    try {
      await signInWithEmailPassword(email, password);
      window.location.reload();
    } catch (err) {
      alert('Login failed');
    }
  };

  document.getElementById('register-btn').onclick = async () => {
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    if (!email || !password) return alert('Enter email and password');
    try {
      await signUpWithEmail(email, password);
      alert('Registered! Now login.');
    } catch (err) {
      alert('Registration failed');
    }
  };
}

export function showChat(user) {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="chat-window">
      <div class="chat-messages" id="chat-messages"></div>
      <form id="chat-form">
        <input type="text" id="chat-input" class="chat-input" placeholder="Type a message..." />
        <button type="submit" class="chat-dot-btn" id="chat-send-btn">
          <div class="dot-svg-wrap"></div>
        </button>
      </form>
    </div>
  `;

  const dot = document.getElementById('dot-core');
  const chatId = [user.id, user.id].sort().join('_');
  const messagesDiv = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  input.addEventListener('focus', () => {
    if (dot) dot.classList.add('dot-hide');
    sendBtn.classList.add('dot-show');
  });

  input.addEventListener('blur', () => {
    if (dot) dot.classList.remove('dot-hide');
    sendBtn.classList.remove('dot-show');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;
    await sendMessage(chatId, content, user.id);
    input.value = '';
  });

  subscribeMessages(chatId, (msg) => {
    const div = document.createElement('div');
    div.className = 'chat-message';
    div.textContent = msg.content;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

export function handleFunctionClick(action) {
  console.log('[DOT] handleFunctionClick →', action);
}

export async function showContacts() {
  const dot = document.getElementById('dot-core');
  if (!dot) return;

  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;
  if (!user) return;

  const chats = await getUserChats(user.id);
  const oldContent = dot.innerHTML;

  dot.innerHTML = '';
  dot.classList.add('search-mode');

  const dotInner = document.createElement('div');
  dotInner.className = 'dot-inner dot-settings-fadein';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'search-input';
  input.className = 'dot-search-input';
  input.placeholder = 'Search or add contact...';

  const addBtn = document.createElement('button');
  addBtn.className = 'dot-add-btn';
  addBtn.textContent = '＋';
  addBtn.id = 'add-contact-btn';

  const wrapper = document.createElement('div');
  wrapper.className = 'dot-search-wrapper';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.marginBottom = '16px';
  wrapper.appendChild(input);
  wrapper.appendChild(addBtn);

  dotInner.appendChild(wrapper);

  const list = document.createElement('div');
  list.className = 'contacts-list';
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';
  list.style.overflowY = 'auto';
  list.style.maxHeight = '240px';

  for (const chat of chats) {
    const otherUserId = chat.user1 === user.id ? chat.user2 : chat.user1;

    const { data: otherUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', otherUserId)
      .maybeSingle();

    const name = otherUser?.email || otherUserId;

    const contactDiv = document.createElement('div');
    contactDiv.textContent = name;
    contactDiv.className = 'contact-entry';
    contactDiv.style.padding = '8px 12px';
    contactDiv.style.borderRadius = '12px';
    contactDiv.style.background = '#111';
    contactDiv.style.color = '#fff';
    contactDiv.style.cursor = 'pointer';
    contactDiv.style.transition = 'background 0.18s';

    contactDiv.onmouseenter = () => {
      contactDiv.style.background = '#222';
    };
    contactDiv.onmouseleave = () => {
      contactDiv.style.background = '#111';
    };

    contactDiv.onclick = async () => {
      const { showChat } = await import('./ui.js');
      showChat({ id: otherUserId });
    };

    list.appendChild(contactDiv);
  }

  dotInner.appendChild(list);
  dot.appendChild(dotInner);

  // Обеспечиваем focus после рендера
  requestAnimationFrame(() => {
    input.focus();
  });

  // Закрытие при клике вне
  setTimeout(() => {
    const closeHandler = (e) => {
      if (!dot.contains(e.target)) {
        e.stopPropagation();
        dot.classList.remove('search-mode');
        dot.innerHTML = oldContent;
        document.removeEventListener('click', closeHandler);
      }
    };
    document.addEventListener('click', closeHandler);
  }, 10);
}



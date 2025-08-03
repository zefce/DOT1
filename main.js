import { supabase } from './js/supabase.js';
import { initDotMenu, cleanupMenus } from './js/handlers.js';
import { showLoginModal } from './js/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const dot = document.getElementById('dot-core');
  if (!dot) {
    console.error('[DOT] dot-core не найден');
    return;
  }

  // Инициализация DOT меню
  initDotMenu(dot);

  // Глобальный обработчик для скрытия меню при клике вне
  document.addEventListener('click', cleanupMenus);

  // Проверка пользователя
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[DOT] Ошибка авторизации:', error);
      showLoginModal();
      return;
    }

    if (!user) {
      console.log('[DOT] Пользователь не найден → открываем логин');
      showLoginModal();
    } else {
      console.log('[DOT] Пользователь найден → загружаем чат');
      const { showChat } = await import('./js/ui.js');
      showChat(user);
    }
  } catch (err) {
    console.error('[DOT] Ошибка получения пользователя:', err);
    showLoginModal();
  }
});

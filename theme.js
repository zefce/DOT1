export function toggleTheme() {
  const root = document.documentElement;
  root.style.transition = "background-color 0.6s ease, color 0.6s ease";

  // ВРЕМЕННО СКРЫТЬ ЧАТ
  const chat = document.querySelector(".chat-window");
  if (chat) {
    chat.style.opacity = "0";
    chat.style.transition = "opacity 0.25s ease, background-color 0.6s ease, color 0.6s ease";
  }

  const all = document.querySelectorAll("body, .top-bar, #main-content, #dot-menu, #function-menu, .chat-window");
  all.forEach(el => {
    el.style.transition = "background-color 0.6s ease, color 0.6s ease";
  });

  document.body.classList.toggle("light-theme");

  // ВОЗВРАТ ЧАТА после задержки
  setTimeout(() => {
    if (chat) {
      chat.style.opacity = "1";
    }
  }, 300);
}
import { createDotMenu } from './menu.js';
import { toggleTheme } from './theme.js';
import { showContacts, handleFunctionClick } from './ui.js';

let searchModeActive = false;
let settingsModeActive = false;

// SVG-контент для DOT (чёрный или белый, зависит от темы)
function getDotSVG(color = "#000") {
  return `<svg id="dot-grow-svg" width="100%" height="100%" viewBox="0 0 44 44" style="display:block;position:absolute;left:0;top:0;width:100%;height:100%;z-index:2;transition:all 0.38s cubic-bezier(0.3,0.64,0.4,1.1);">
    <circle id="dot-grow-circle" cx="22" cy="22" r="22" fill="${color}"/>
  </svg>`;
}

export function initDotMenu(dot) {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!searchModeActive && !settingsModeActive) {
      let dotMenuWrapper = document.getElementById('dot-menu-wrapper');
      if (dotMenuWrapper) {
        dotMenuWrapper.classList.toggle('show');
        if (!dotMenuWrapper.classList.contains('show')) {
          dotMenuWrapper.remove();
        }
      } else {
        const newWrapper = createDotMenu(
          dot,
          handleFunctionClick,
          toggleTheme,
          showContacts,
          showSettings
        );
        newWrapper.classList.add('show');
      }
      dot.classList.remove('pressed');
      void dot.offsetWidth;
      dot.classList.add('pressed');
      setTimeout(() => dot.classList.remove('pressed'), 220);
    }
  });
}

export function cleanupMenus(e) {
  let dot = document.getElementById('dot-core');
  let dotMenuWrapper = document.getElementById('dot-menu-wrapper');
  let functionMenu = document.getElementById('function-menu');

  if (!dot.contains(e.target) &&
      (!dotMenuWrapper || !dotMenuWrapper.contains(e.target)) &&
      (!functionMenu || !functionMenu.contains(e.target))) {
    dot.classList.remove('active');
    if (dotMenuWrapper) {
      dotMenuWrapper.classList.remove('show');
      setTimeout(() => {
        dotMenuWrapper.remove();
      }, 90);
    }
    if (functionMenu) {
      functionMenu.remove();
    }
  }
}

// --- WOW-эффект: DOT увеличивается кругом через svg, потом появляется панель ---
export function showSettings() {
  const dot = document.getElementById('dot-core');
  if (!dot) return;

  // Закрыть меню, если открыто
  const dotMenuWrapper = document.getElementById('dot-menu-wrapper');
  if (dotMenuWrapper) dotMenuWrapper.classList.remove('show');

  // Сохраняем исходное содержимое DOT (чтобы вернуть при закрытии)
  const oldContent = dot.innerHTML;

  // Определяем цвет точки по теме
  const isLight = document.body.classList.contains('light-theme');
  const dotColor = isLight ? "#fff" : "#000";

  // Вставляем svg-круг (точку) на весь dot-core
  dot.innerHTML = getDotSVG(dotColor);
  dot.classList.add('settings-mode');

  setTimeout(() => {
    dot.innerHTML = `
      <div class="dot-settings-panel dot-settings-fadein">
        <div class="settings-header">
          Settings
          <button class="settings-close-btn" id="settings-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="settings-content">
          <div>Тут будут настройки профиля (например, смена темы, логаут и др.).</div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('settings-close-btn');
    closeBtn.onclick = function () {
      dot.innerHTML = getDotSVG(dotColor);
      dot.classList.add('dot-settings-fadeout');

      setTimeout(() => {
        dot.classList.remove('dot-settings-fadeout');
        dot.classList.remove('settings-mode');
        dot.innerHTML = oldContent;
      }, 220);
    };

    // Добавляем глобальный обработчик: клик вне DOT — закрыть
    setTimeout(() => {
      const closeOutside = (e) => {
        if (!dot.contains(e.target)) {
          e.stopPropagation();
          dot.innerHTML = getDotSVG(dotColor);
          dot.classList.remove('dot-settings-fadeout');
          dot.classList.remove('settings-mode');
          dot.innerHTML = oldContent;
          document.removeEventListener('click', closeOutside);
        }
      };
      document.addEventListener('click', closeOutside);
    }, 10);
  }, 400);
}

export { searchModeActive, settingsModeActive };

document.getElementById('contacts-btn')?.addEventListener('click', () => {
  console.log('[DOT] Contacts button clicked');
  import('./ui.js').then(({ showContacts }) => {
    showContacts();
  });
});


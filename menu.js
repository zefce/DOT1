export function createDotMenu(dot, onFunctionClick, onThemeClick, onContactsClick, onSettingsClick) {
  const wrapper = document.createElement("div");
  wrapper.id = "dot-menu-wrapper";

  const dotMenu = document.createElement("div");
  dotMenu.id = "dot-menu";

  const functionBtn = document.createElement("button");
  functionBtn.textContent = "Function";
  functionBtn.className = "menu-item";
  functionBtn.onclick = onFunctionClick;

  const themeBtn = document.createElement("button");
  themeBtn.textContent = "Theme";
  themeBtn.className = "menu-item";
  themeBtn.onclick = onThemeClick;

  const contactsBtn = document.createElement("button");
  contactsBtn.textContent = "Contacts";
  contactsBtn.className = "menu-item";
  contactsBtn.id = "contacts-btn"; // ✅ ключевая правка
  contactsBtn.onclick = onContactsClick;

  const settingsBtn = document.createElement("button");
  settingsBtn.textContent = "Settings";
  settingsBtn.className = "menu-item";
  settingsBtn.onclick = onSettingsClick;

  dotMenu.appendChild(functionBtn);
  dotMenu.appendChild(themeBtn);
  dotMenu.appendChild(contactsBtn);
  dotMenu.appendChild(settingsBtn);
  wrapper.appendChild(dotMenu);
  document.body.appendChild(wrapper);

  return wrapper;
}
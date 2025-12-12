# WEB EDIT v3.1.1 ELITE

Userscript для редактирования веб-страниц в браузере.

---

## Возможности

### Основные функции
- Text Control — WYSIWYG редактор
- Delete Mode — удаление элементов
- Style Edit — редактирование стилей
- HTML/CSS/JS редакторы
- 8 тем оформления
- Undo/Redo (Ctrl+Z/Y)
- FPS Control
- Screen Rotate
- Download HTML/ZIP
- Заготовки элементов
- Dark Mode
- Rainbow Mode

### BETA функции
- Glitch Effect
- Neon Glow
- Mouse Trail
- Speed ×2

### Elite Menu
- Консоль команд
- Заготовки (button, form, div, script)
- Pro команды

### Dev Tools
- Inspect Element
- Performance Log
- Console Log перехват
- Disable All Modes
- Dev Console

---

## Установка

1. Установить [Tampermonkey](https://www.tampermonkey.net/) или [Violentmonkey](https://violentmonkey.github.io/)
2. Скопировать код из файла webedit.user.js
3. Создать новый скрипт в Tampermonkey
4. Вставить код и сохранить

---

## Использование

### Активация
`javascript
webedit()       // Запуск
we()            // Короткая версия
webedit('dev')  // Запуск с Dev Tools
Горячие клавиши
Ctrl+Z — Undo
Ctrl+Y — Redo
Ctrl+Shift+D — Toggle Dev Tools
Команды в Elite Menu
create button   - Создать кнопку
create form     - Создать форму
insert <html>   - Вставить HTML
debug           - Включить Dev Tools
help            - Показать помощь
Переключение Dev Mode
debug = true;   // Включить
debug = false;  // Выключить

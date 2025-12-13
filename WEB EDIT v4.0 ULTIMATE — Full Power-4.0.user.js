// ==UserScript==
// @name         WEB EDIT v4.0 ULTIMATE — Full Power
// @namespace    H7S
// @version      4.0
// @description  Мощнейший редактор сайтов • Enhanced Text Editor • Advanced Delete • Settings • Key Bindings • Elite Commands
// @author       H7S
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ⚠️ EDUCATIONAL USE ONLY

    let modes = { text: false, del: false, style: false, html: false, css: false, js: false, rainbow: false };
    let history = [];
    let historyStep = -1;
    let selectedElement = null;
    let currentTheme = 'cyberpunk';
    let panelPosition = 'top';
    let fpsThrottle = 60;
    let screenRotation = 0;
    let eliteMenuOpen = false;
    let debugMode = false;
    let currentLang = 'en';
    let optimizationMode = false;
    let maxHistorySteps = 100;
    let keyBindings = {
        delete: 'Delete',
        undo: 'KeyZ',
        redo: 'KeyY',
        devMode: 'KeyD'
    };

    const LANG = {
        en: {
            title: 'WEB EDIT v4.0 ULTIMATE',
            textControl: 'Text Control',
            delete: 'Delete',
            styleEdit: 'Style Edit',
            htmlEdit: 'HTML Edit',
            cssEdit: 'CSS Edit',
            jsEdit: 'JS Edit',
            darkMode: 'Dark Mode',
            rainbow: 'Rainbow',
            undo: 'Undo',
            redo: 'Redo',
            download: 'Download HTML',
            downloadZip: 'Download ZIP',
            presets: 'Presets',
            nuke: 'NUKE',
            betaFeatures: 'BETA FEATURES',
            eliteMenu: 'Elite Menu',
            devTools: 'DEV TOOLS',
            settings: 'SETTINGS',
            about: 'About',
            position: 'Position',
            hide: 'Hide',
            save: 'Save',
            cancel: 'Cancel',
            language: 'Language',
            optimization: 'Optimization Mode',
            keyBindings: 'Key Bindings',
            advancedDelete: 'Advanced Delete',
            fontSize: 'Font Size',
            rotation: 'Rotation',
            positionXY: 'Position X,Y',
            textShadow: 'Text Shadow',
            textOutline: 'Text Outline',
            gradient: 'Gradient'
        },
        ru: {
            title: 'WEB EDIT v4.0 УЛЬТИМЕЙТ',
            textControl: 'Текст',
            delete: 'Удаление',
            styleEdit: 'Стиль',
            htmlEdit: 'HTML',
            cssEdit: 'CSS',
            jsEdit: 'JS',
            darkMode: 'Темная тема',
            rainbow: 'Радуга',
            undo: 'Отмена',
            redo: 'Вернуть',
            download: 'Скачать HTML',
            downloadZip: 'Скачать ZIP',
            presets: 'Заготовки',
            nuke: 'ОЧИСТИТЬ ВСЁ',
            betaFeatures: 'БЕТА ФУНКЦИИ',
            eliteMenu: 'Elite Меню',
            devTools: 'РЕЖИМ РАЗРАБОТЧИКА',
            settings: 'НАСТРОЙКИ',
            about: 'О программе',
            position: 'Позиция',
            hide: 'Скрыть',
            save: 'Сохранить',
            cancel: 'Отмена',
            language: 'Язык',
            optimization: 'Режим оптимизации',
            keyBindings: 'Горячие клавиши',
            advancedDelete: 'Расширенное удаление',
            fontSize: 'Размер шрифта',
            rotation: 'Поворот',
            positionXY: 'Позиция X,Y',
            textShadow: 'Тень текста',
            textOutline: 'Обводка',
            gradient: 'Градиент'
        }
    };

    const commandPresets = {
        button: '<button onclick="alert(\'Click!\')">Новая Кнопка</button>',
        form: '<form><input type="text" placeholder="Ввод"><button>Отправить</button></form>',
        div: '<div style="background:red;padding:20px;">Новый DIV</div>',
        script: '<script>console.log("JS!");<\/script>',
        menuBtn: '<button style="position:fixed;top:10px;right:10px;z-index:9999;background:purple;color:white;padding:10px;border-radius:5px;">Elite Menu</button>',
        input: '<input type="text" placeholder="Введите текст" style="padding:10px;border:2px solid #0ff;border-radius:5px;">',
        image: '<img src="https://via.placeholder.com/300x200" style="max-width:100%;border-radius:10px;">',
        video: '<video controls style="max-width:100%;border-radius:10px;"><source src="video.mp4" type="video/mp4"></video>'
    };

    const THEMES = {
        cyberpunk: { bg: '#0f0f1e', accent: '#ff00ff', text: '#00ffff', header: '#1a0033' },
        dracula:   { bg: '#282a36', accent: '#ff79c6', text: '#f8f8f2', header: '#44475a' },
        nord:      { bg: '#2e3440', accent: '#88c0d0', text: '#eceff4', header: '#3b4252' },
        vaporwave: { bg: '#1a0b2e', accent: '#ff6bda', text: '#00f0ff', header: '#2d1b3a' },
        monokai:   { bg: '#272822', accent: '#f92672', text: '#f8f8f2', header: '#3e3d32' },
        solarized: { bg: '#002b36', accent: '#b58900', text: '#839496', header: '#073642' },
        matrix:    { bg: '#000000', accent: '#00ff00', text: '#00ff00', header: '#001100' },
        retro:     { bg: '#000000', accent: '#ffff00', text: '#ffffff', header: '#333333' }
    };

    const css = '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Roboto+Mono&display=swap");' +
    '#we-panel{position:fixed;left:50%;transform:translateX(-50%);top:10px;background:linear-gradient(135deg,var(--bg),var(--header));color:var(--text);padding:16px 24px;border-radius:20px;box-shadow:0 15px 40px rgba(0,0,0,0.7);z-index:2147483647;font-family:Inter,sans-serif;border:2px solid var(--accent);backdrop-filter:blur(12px);min-width:320px;max-width:96vw;}' +
    '.we-compact #we-panel{padding:8px 12px;min-width:280px;}' +
    '.we-compact .we-btn{padding:6px 10px;font-size:12px;}' +
    '.we-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px;}' +
    '.we-header strong{font-size:20px;color:var(--accent);text-shadow:0 0 10px;}' +
    '.we-compact .we-header strong{font-size:16px;}' +
    '.we-tools{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;}' +
    '.we-btn{padding:10px 16px;background:rgba(255,255,255,0.05);border:1px solid var(--accent);color:var(--accent);border-radius:12px;cursor:pointer;font-weight:600;transition:all 0.3s;backdrop-filter:blur(5px);}' +
    '.we-btn:hover{background:var(--accent);color:#000;transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.4);}' +
    '.we-btn.active{background:var(--accent);color:#000;box-shadow:0 0 20px var(--accent);}' +
    '.we-btn.danger{border-color:#ff3366;color:#ff3366;}' +
    '.we-btn.danger:hover{background:#ff3366;color:white;}' +
    '.we-btn.elite{border-color:#00ff00;color:#00ff00;font-size:12px;}' +
    '.we-btn.elite:hover{background:#00ff00;color:#000;}' +
    'details.we-beta,details.we-about,details.we-elite,details.we-dev,details.we-settings{margin-top:16px;background:rgba(0,0,0,0.3);padding:12px;border-radius:12px;}' +
    'summary{cursor:pointer;font-weight:600;color:var(--accent);user-select:none;}' +
    '.we-beta-grid,.we-elite-grid,.we-settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;margin-top:10px;}' +
    '#we-text-modal,#we-html-modal,#we-css-modal,#we-js-modal,#we-elite-modal,#we-delete-modal,#we-settings-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);z-index:2147483647;display:none;align-items:center;justify-content:center;}' +
    '.we-modal-content{background:var(--bg);padding:24px;border-radius:20px;border:2px solid var(--accent);width:90%;max-width:900px;max-height:90vh;overflow:auto;color:var(--text);resize:both;}' +
    '.we-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;padding:12px;background:rgba(0,0,0,0.3);border-radius:12px;}' +
    '.we-toolbar button,.we-toolbar select,.we-toolbar input{padding:8px 12px;border-radius:8px;border:1px solid var(--accent);background:rgba(255,255,255,0.1);color:var(--text);}' +
    '.we-text-controls{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px;padding:10px;background:rgba(0,0,0,0.3);border-radius:8px;}' +
    '.we-control-group{display:flex;flex-direction:column;gap:5px;}' +
    '.we-control-group label{font-size:12px;color:var(--accent);}' +
    '.we-control-group input,.we-control-group select{padding:8px;border-radius:5px;border:1px solid var(--accent);background:rgba(0,0,0,0.5);color:var(--text);}' +
    '#we-wysiwyg,#we-html-editor,#we-css-editor,#we-js-editor{width:100%;min-height:300px;background:#111;color:white;padding:20px;border-radius:12px;font-size:16px;outline:none;font-family:"Roboto Mono",monospace;border:1px solid var(--accent);}' +
    '.we-highlight{outline:3px dashed var(--accent)!important;cursor:pointer;}' +
    '#we-console,#we-dev-console{background:#000;color:#00ff00;padding:10px;font-family:monospace;height:200px;overflow:auto;border:1px solid #0f0;border-radius:5px;}' +
    '.we-command-input{width:100%;padding:10px;background:rgba(0,0,0,0.5);color:var(--text);border:1px solid var(--accent);border-radius:5px;margin-bottom:10px;}' +
    '.we-elite-close{float:right;background:#f00;color:white;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;margin-left:10px;}' +
    '#we-dev-section,#we-settings-section{display:none;}' +
    '.we-delete-list{max-height:400px;overflow:auto;background:rgba(0,0,0,0.5);padding:10px;border-radius:8px;margin-top:10px;}' +
    '.we-delete-item{padding:8px;margin:5px 0;background:rgba(255,255,255,0.1);border:1px solid var(--accent);border-radius:5px;display:flex;justify-content:space-between;align-items:center;}' +
    '.we-delete-item:hover{background:rgba(255,255,255,0.2);}' +
    '.we-delete-item input[type="checkbox"]{margin-right:10px;}' +
    '.we-filter-input{width:100%;padding:8px;margin-bottom:10px;border-radius:5px;border:1px solid var(--accent);background:rgba(0,0,0,0.5);color:var(--text);}' +
    '.debug-log{color:#ff0;font-size:12px;}';

    function t(key) {
        return LANG[currentLang][key] || key;
    }

    const panelHTML = () => '<div id="we-panel">' +
      '<div class="we-header">' +
        '<strong>' + t('title') + '</strong>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<select id="we-theme-select" style="padding:5px;border-radius:5px;background:rgba(0,0,0,0.5);color:var(--text);border:1px solid var(--accent);">' +
            '<option value="cyberpunk">Cyberpunk</option>' +
            '<option value="dracula">Dracula</option>' +
            '<option value="nord">Nord</option>' +
            '<option value="vaporwave">Vaporwave</option>' +
            '<option value="monokai">Monokai</option>' +
            '<option value="solarized">Solarized</option>' +
            '<option value="matrix">Matrix</option>' +
            '<option value="retro">Retro</option>' +
          '</select>' +
          '<button class="we-btn" id="we-pos-btn" style="padding:5px 10px;">' + t('position') + '</button>' +
          '<button class="we-btn" id="we-hide-btn" style="padding:5px 10px;">' + t('hide') + '</button>' +
          '<button class="we-btn elite" id="we-settings-toggle">' + t('settings') + '</button>' +
          '<button class="we-btn elite" id="we-elite-toggle">' + t('eliteMenu') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="we-tools">' +
        '<button class="we-btn" data-mode="text">' + t('textControl') + '</button>' +
        '<button class="we-btn" data-mode="del">' + t('delete') + '</button>' +
        '<button class="we-btn" id="we-advanced-delete">' + t('advancedDelete') + '</button>' +
        '<button class="we-btn" data-mode="style">' + t('styleEdit') + '</button>' +
        '<button class="we-btn" data-mode="html">' + t('htmlEdit') + '</button>' +
        '<button class="we-btn" data-mode="css">' + t('cssEdit') + '</button>' +
        '<button class="we-btn" data-mode="js">' + t('jsEdit') + '</button>' +
        '<button class="we-btn" id="we-dark">' + t('darkMode') + '</button>' +
        '<button class="we-btn" id="we-rainbow">' + t('rainbow') + '</button>' +
        '<button class="we-btn" id="we-fps">FPS: 60</button>' +
        '<button class="we-btn" id="we-rotate">Rotate: 0°</button>' +
        '<button class="we-btn" id="we-undo">' + t('undo') + '</button>' +
        '<button class="we-btn" id="we-redo">' + t('redo') + '</button>' +
        '<button class="we-btn" id="we-download">' + t('download') + '</button>' +
        '<button class="we-btn" id="we-download-zip">' + t('downloadZip') + '</button>' +
        '<button class="we-btn" id="we-command-preset">' + t('presets') + '</button>' +
        '<button class="we-btn danger" id="we-nuke">' + t('nuke') + '</button>' +
      '</div>' +
      '<details class="we-beta">' +
        '<summary>' + t('betaFeatures') + '</summary>' +
        '<div class="we-beta-grid">' +
          '<button class="we-btn" id="beta-glitch">Glitch</button>' +
          '<button class="we-btn" id="beta-neon">Neon Glow</button>' +
          '<button class="we-btn" id="beta-trail">Mouse Trail</button>' +
          '<button class="we-btn" id="beta-speed">Speed ×2</button>' +
        '</div>' +
      '</details>' +
      '<details class="we-settings" id="we-settings-section" style="display:none;">' +
        '<summary>' + t('settings') + ' <button class="we-elite-close" id="we-settings-close">✕</button></summary>' +
        '<div class="we-settings-grid">' +
          '<div style="grid-column:1/-1;">' +
            '<label>' + t('language') + ':</label>' +
            '<select id="we-lang-select" style="width:100%;padding:8px;margin-top:5px;border-radius:5px;background:rgba(0,0,0,0.5);color:var(--text);border:1px solid var(--accent);">' +
              '<option value="en">English</option>' +
              '<option value="ru">Русский</option>' +
            '</select>' +
          '</div>' +
          '<div style="grid-column:1/-1;margin-top:10px;">' +
            '<label><input type="checkbox" id="we-optimization"> ' + t('optimization') + '</label>' +
            '<p style="font-size:11px;opacity:0.7;margin-top:5px;">Undo: 30 steps, compact UI, better performance</p>' +
          '</div>' +
          '<div style="grid-column:1/-1;margin-top:10px;">' +
            '<h4 style="margin:0 0 10px 0;">' + t('keyBindings') + '</h4>' +
            '<div style="display:grid;gap:8px;">' +
              '<div><label>Delete: <input type="text" id="kb-delete" value="Delete" style="width:100px;padding:5px;"></label></div>' +
              '<div><label>Undo: <input type="text" id="kb-undo" value="Ctrl+Z" style="width:100px;padding:5px;"></label></div>' +
              '<div><label>Redo: <input type="text" id="kb-redo" value="Ctrl+Y" style="width:100px;padding:5px;"></label></div>' +
              '<div><label>Dev Mode: <input type="text" id="kb-dev" value="Ctrl+Shift+D" style="width:100px;padding:5px;"></label></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</details>' +
      '<details class="we-elite" id="we-elite-section" style="display:none;">' +
        '<summary>' + t('eliteMenu') + ' <button class="we-elite-close" id="we-elite-close">✕</button></summary>' +
        '<div class="we-elite-grid" style="resize:both;overflow:auto;max-height:400px;min-height:200px;">' +
          '<input type="text" class="we-command-input" id="we-command-input" placeholder="Command: createBtn, clone body, hide .ads, help">' +
          '<button class="we-btn" id="we-execute-command">Execute</button>' +
          '<div id="we-console"></div>' +
          '<button class="we-btn" id="we-clear-console">Clear Console</button>' +
        '</div>' +
      '</details>' +
      '<details class="we-dev" id="we-dev-section">' +
        '<summary>' + t('devTools') + ' <button class="we-elite-close" id="we-dev-close">✕</button></summary>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:10px;">' +
          '<button class="we-btn" id="dev-inspect">Inspect</button>' +
          '<button class="we-btn" id="dev-performance">Performance</button>' +
          '<button class="we-btn" id="dev-console-log">Console Log</button>' +
          '<button class="we-btn danger" id="dev-disable-all">Disable All</button>' +
        '</div>' +
        '<div id="we-dev-console"></div>' +
      '</details>' +
      '<details class="we-about">' +
        '<summary>' + t('about') + ' WEB EDIT v4.0 ULTIMATE</summary>' +
        '<div style="font-size:13px;line-height:1.5;">' +
          '<br><b>v4.0 (ULTIMATE):</b><br>' +
          '• Enhanced Text Editor (up to 128px, rotation, X/Y position)<br>' +
          '• Advanced Delete with element list<br>' +
          '• Settings panel with language & key bindings<br>' +
          '• Optimization mode<br>' +
          '• More Elite commands (createInput, createImage, clone, hide, show, move, resize)<br>' +
          '• Fixed HTML/CSS/JS editors (ignore menu clicks)<br><br>' +
          '<b>WEB EDIT v4.0 ULTIMATE — 2025</b>' +
        '</div>' +
      '</details>' +
    '</div>' +
    '<div id="we-text-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">' + t('textControl') + '</h3>' +
        '<div class="we-toolbar">' +
          '<button data-cmd="bold"><b>B</b></button>' +
          '<button data-cmd="italic"><i>I</i></button>' +
          '<button data-cmd="underline"><u>U</u></button>' +
          '<button data-cmd="strikeThrough"><s>S</s></button>' +
          '<select id="we-font-family">' +
            '<option value="Inter">Inter</option>' +
            '<option value="Comic Sans MS">Comic Sans</option>' +
            '<option value="Roboto Mono">Roboto Mono</option>' +
            '<option value="Arial">Arial</option>' +
          '</select>' +
          '<input type="color" id="we-color-picker" value="#ffffff">' +
          '<input type="file" id="we-file-input" accept=".txt,text/plain">' +
          '<button id="we-google-font">Google Font</button>' +
        '</div>' +
        '<div contenteditable="true" id="we-wysiwyg"></div>' +
        '<div class="we-text-controls">' +
          '<div class="we-control-group">' +
            '<label>' + t('fontSize') + ' (8-128px):</label>' +
            '<input type="number" id="we-font-size-input" min="8" max="128" value="16">' +
          '</div>' +
          '<div class="we-control-group">' +
            '<label>' + t('rotation') + ' (deg):</label>' +
            '<input type="number" id="we-text-rotation" min="0" max="360" value="0">' +
          '</div>' +
          '<div class="we-control-group">' +
            '<label>X Position (px):</label>' +
            '<input type="number" id="we-text-x" value="0">' +
          '</div>' +
          '<div class="we-control-group">' +
            '<label>Y Position (px):</label>' +
            '<input type="number" id="we-text-y" value="0">' +
          '</div>' +
          '<div class="we-control-group">' +
            '<label>' + t('textShadow') + ':</label>' +
            '<input type="text" id="we-text-shadow" placeholder="2px 2px 4px #000">' +
          '</div>' +
          '<div class="we-control-group">' +
            '<label>' + t('textOutline') + ':</label>' +
            '<input type="text" id="we-text-outline" placeholder="1px #fff">' +
          '</div>' +
          '<div class="we-control-group" style="grid-column:1/-1;">' +
            '<label>' + t('gradient') + ':</label>' +
            '<input type="text" id="we-text-gradient" placeholder="linear-gradient(45deg, #ff0, #f0f)">' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-text">' + t('save') + '</button>' +
          '<button class="we-btn" id="we-cancel-text">' + t('cancel') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-delete-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">' + t('advancedDelete') + '</h3>' +
        '<input type="text" class="we-filter-input" id="we-delete-filter" placeholder="Filter by tag, class, id...">' +
        '<div style="margin-bottom:10px;">' +
          '<button class="we-btn" id="we-select-all-delete">Select All</button>' +
          '<button class="we-btn" id="we-deselect-all-delete">Deselect All</button>' +
        '</div>' +
        '<div class="we-delete-list" id="we-delete-list"></div>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn danger" id="we-delete-selected">Delete Selected</button>' +
          '<button class="we-btn" id="we-cancel-delete">' + t('cancel') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-html-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">HTML</h3>' +
        '<textarea id="we-html-editor" placeholder="HTML..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-html">' + t('save') + '</button>' +
          '<button class="we-btn" id="we-cancel-html">' + t('cancel') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-css-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">CSS</h3>' +
        '<textarea id="we-css-editor" placeholder="CSS..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-css">' + t('save') + '</button>' +
          '<button class="we-btn" id="we-cancel-css">' + t('cancel') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-js-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">JS</h3>' +
        '<textarea id="we-js-editor" placeholder="JS..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-js">' + t('save') + '</button>' +
          '<button class="we-btn" id="we-cancel-js">' + t('cancel') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    function saveState() {
        historyStep++;
        history = history.slice(0, historyStep);
        history.push(document.documentElement.outerHTML);
        if (history.length > maxHistorySteps) history.shift();
        if (debugMode) devLog('[SAVE] State ' + historyStep);
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            document.documentElement.outerHTML = history[historyStep];
            setTimeout(init, 200);
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            document.documentElement.outerHTML = history[historyStep];
            setTimeout(init, 200);
        }
    }

    function applyTheme(name) {
        const t = THEMES[name] || THEMES.cyberpunk;
        document.documentElement.style.setProperty('--bg', t.bg);
        document.documentElement.style.setProperty('--accent', t.accent);
        document.documentElement.style.setProperty('--text', t.text);
        document.documentElement.style.setProperty('--header', t.header);
        currentTheme = name;
        if (debugMode) devLog('[THEME] ' + name);
    }

    function toggleMode(mode, active) {
        if (mode === 'text') document.body.style.cursor = active ? 'text' : 'default';
        else if (mode === 'del') document.body.style.cursor = active ? 'crosshair' : 'default';
        else if (mode === 'style') document.body.style.cursor = active ? 'pointer' : 'default';
        else if (mode === 'html' && active && selectedElement) openHtmlModal(selectedElement.outerHTML);
        else if (mode === 'css' && active) openCssModal('');
        else if (mode === 'js' && active) openJsModal(extractJsFromPage());
        if (mode === 'rainbow' && active) {
            document.body.style.animation = 'rainbow 2s linear infinite';
            const style = document.createElement('style');
            style.textContent = '@keyframes rainbow{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}';
            document.head.appendChild(style);
        }
    }

    function isWEElement(el) {
        return el.closest('#we-panel') || el.closest('[id^="we-"]');
    }

    function init() {
        if (document.getElementById('we-panel')) return;

        const style = document.createElement('style');
        style.textContent = css.replace(/var\(--bg\)/g, THEMES[currentTheme].bg)
                               .replace(/var\(--accent\)/g, THEMES[currentTheme].accent)
                               .replace(/var\(--text\)/g, THEMES[currentTheme].text)
                               .replace(/var\(--header\)/g, THEMES[currentTheme].header);
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', panelHTML());
        applyTheme(currentTheme);
        saveState();

        document.getElementById('we-lang-select').value = currentLang;
        document.getElementById('we-lang-select').onchange = function(e) {
            currentLang = e.target.value;
            document.getElementById('we-panel').remove();
            init();
        };

        document.getElementById('we-optimization').checked = optimizationMode;
        document.getElementById('we-optimization').onchange = function(e) {
            optimizationMode = e.target.checked;
            maxHistorySteps = optimizationMode ? 30 : 100;
            document.body.classList.toggle('we-compact', optimizationMode);
            logCommandResult('Optimization: ' + (optimizationMode ? 'ON' : 'OFF'));
        };

        document.getElementById('we-settings-toggle').onclick = function() {
            const section = document.getElementById('we-settings-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        };

        document.getElementById('we-settings-close').onclick = function() {
            document.getElementById('we-settings-section').style.display = 'none';
        };

        document.querySelectorAll('[data-mode]').forEach(function(btn) {
            btn.onclick = function() {
                const mode = btn.dataset.mode;
                modes[mode] = !modes[mode];
                btn.classList.toggle('active');
                toggleMode(mode, modes[mode]);
            };
        });

        document.getElementById('we-advanced-delete').onclick = function() {
            openAdvancedDelete();
        };

        document.addEventListener('dblclick', function(e) {
            if ((modes.text || modes.html) && !isWEElement(e.target)) {
                e.preventDefault();
                selectedElement = e.target;
                if (modes.text) openTextModal(e.target.innerHTML);
                if (modes.html) openHtmlModal(e.target.outerHTML);
            }
        });

        document.addEventListener('click', function(e) {
            if (modes.del && e.target !== document.body) {
                if (isWEElement(e.target)) return;
                e.preventDefault();
                e.stopPropagation();
                e.target.remove();
                saveState();
            }
        }, true);

        document.addEventListener('mouseover', function(e) {
            if (modes.style && !isWEElement(e.target)) {
                e.target.classList.add('we-highlight');
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (modes.style) e.target.classList.remove('we-highlight');
        });

        document.addEventListener('click', function(e) {
            if (modes.style && !isWEElement(e.target)) {
                e.preventDefault();
                selectedElement = e.target;
                const currentStyle = e.target.style.cssText;
                const newStyle = prompt('Edit style (CSS):', currentStyle);
                if (newStyle !== null) {
                    e.target.style.cssText = newStyle;
                    saveState();
                }
            }
        });

        document.getElementById('we-fps').onclick = function() {
            const fps = prompt('FPS (1-120):', fpsThrottle);
            if (fps && !isNaN(fps)) {
                fpsThrottle = Math.max(1, Math.min(120, parseInt(fps)));
                document.getElementById('we-fps').textContent = 'FPS: ' + fpsThrottle;
                logCommandResult('FPS: ' + fpsThrottle);
            }
        };

        document.getElementById('we-rotate').onclick = function() {
            screenRotation = (screenRotation + 90) % 360;
            document.body.style.transform = 'rotate(' + screenRotation + 'deg)';
            document.getElementById('we-rotate').textContent = 'Rotate: ' + screenRotation + '°';
            logCommandResult('Rotate: ' + screenRotation + '°');
        };

        document.getElementById('we-undo').onclick = undo;
        document.getElementById('we-redo').onclick = redo;

        document.getElementById('we-command-preset').onclick = function() {
            const presets = Object.keys(commandPresets).join(', ');
            const preset = prompt('Available: ' + presets, 'button');
            if (commandPresets[preset]) {
                document.body.insertAdjacentHTML('beforeend', commandPresets[preset]);
                saveState();
                logCommandResult('Preset: ' + preset);
            }
        };

        document.getElementById('we-elite-toggle').onclick = function() {
            eliteMenuOpen = !eliteMenuOpen;
            document.getElementById('we-elite-section').style.display = eliteMenuOpen ? 'block' : 'none';
        };

        document.getElementById('we-elite-close').onclick = function() {
            document.getElementById('we-elite-section').style.display = 'none';
            eliteMenuOpen = false;
        };

        document.getElementById('we-execute-command').onclick = function() {
            const cmd = document.getElementById('we-command-input').value;
            executeCommand(cmd);
            logToConsole(cmd);
        };

        document.getElementById('we-clear-console').onclick = function() {
            document.getElementById('we-console').innerHTML = '';
        };

        document.getElementById('we-dev-close').onclick = function() {
            document.getElementById('we-dev-section').style.display = 'none';
            debugMode = false;
        };

        document.getElementById('dev-inspect').onclick = function() {
            const selector = prompt('CSS Selector:', 'body');
            if (selector) {
                const el = document.querySelector(selector);
                if (el) {
                    console.log(el);
                    devLog('[INSPECT] ' + selector);
                } else {
                    devLog('[ERROR] Not found');
                }
            }
        };

        document.getElementById('dev-performance').onclick = function() {
            const perf = performance.getEntriesByType('navigation')[0];
            if (perf) {
                devLog('[PERF] Load: ' + perf.loadEventEnd + 'ms');
            }
            devLog('[PERF] Resources: ' + performance.getEntriesByType('resource').length);
        };

        document.getElementById('dev-console-log').onclick = function() {
            const oldLog = console.log;
            console.log = function() {
                oldLog.apply(console, arguments);
                devLog('[LOG] ' + Array.from(arguments).join(' '));
            };
            devLog('[INFO] Console intercepted');
        };

        document.getElementById('dev-disable-all').onclick = function() {
            Object.keys(modes).forEach(function(m) { modes[m] = false; });
            document.querySelectorAll('.we-btn.active').forEach(function(b) { b.classList.remove('active'); });
            document.body.style.cursor = 'default';
            devLog('[RESET] All disabled');
        };

        document.getElementById('we-dark').onclick = function() {
            document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
            logCommandResult('Dark mode');
        };

        document.getElementById('we-rainbow').onclick = function() {
            modes.rainbow = !modes.rainbow;
            toggleMode('rainbow', modes.rainbow);
            document.getElementById('we-rainbow').classList.toggle('active');
        };

        document.getElementById('we-download').onclick = function() {
            const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited-page.html';
            a.click();
            logCommandResult('HTML downloaded');
        };

        document.getElementById('we-download-zip').onclick = function() {
            if (typeof JSZip === 'undefined') {
                alert('JSZip loading...');
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                s.onload = function() { document.getElementById('we-download-zip').click(); };
                document.head.appendChild(s);
                return;
            }
            const zip = new JSZip();
            zip.file('index.html', document.documentElement.outerHTML);
            const cssContent = Array.from(document.styleSheets).map(function(s) {
                try { return Array.from(s.cssRules).map(function(r) { return r.cssText; }).join('\n'); } catch(e) { return ''; }
            }).join('\n');
            zip.file('styles.css', cssContent);
            zip.file('scripts.js', Array.from(document.scripts).map(function(s) { return s.innerHTML; }).join('\n'));
            zip.generateAsync({type: 'blob'}).then(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'edited-site.zip';
                a.click();
                logCommandResult('ZIP downloaded');
            });
        };

        document.getElementById('we-nuke').onclick = function() {
            if (confirm('NUKE entire page?')) {
                document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:#f00;">NUKED BY WEB EDIT v4.0</h1>';
                saveState();
            }
        };

        document.getElementById('beta-glitch').onclick = function() {
            document.body.style.animation = 'glitch 0.1s infinite';
            const s = document.createElement('style');
            s.textContent = '@keyframes glitch{0%,100%{transform:translate(0);}20%{transform:translate(-2px,2px) skew(2deg);}40%{transform:translate(2px,-2px) skew(-1deg);}}';
            document.head.appendChild(s);
            logCommandResult('Glitch ON');
        };

        document.getElementById('beta-neon').onclick = function() {
            document.querySelectorAll('*').forEach(function(el) { el.style.boxShadow = '0 0 10px #0ff'; });
            logCommandResult('Neon ON');
        };

        document.getElementById('beta-trail').onclick = function() {
            document.addEventListener('mousemove', function(e) {
                const t = document.createElement('div');
                t.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:5px;height:5px;background:#0ff;border-radius:50%;pointer-events:none;z-index:9999;animation:fadeOut 1s;';
                document.body.appendChild(t);
                setTimeout(function() { t.remove(); }, 1000);
            });
            const s = document.createElement('style');
            s.textContent = '@keyframes fadeOut{to{opacity:0;}}';
            document.head.appendChild(s);
            logCommandResult('Trail ON');
        };

        document.getElementById('beta-speed').onclick = function() {
            document.documentElement.style.setProperty('--speed', '0.5');
            const s = document.createElement('style');
            s.textContent = '*{transition-duration:calc(var(--speed,1)*0.3s)!important;animation-duration:calc(var(--speed,1)*1s)!important;}';
            document.head.appendChild(s);
            logCommandResult('Speed ×2 ON');
        };

        document.getElementById('we-theme-select').onchange = function(e) {
            applyTheme(e.target.value);
        };

        document.getElementById('we-pos-btn').onclick = function() {
            const positions = ['top', 'left', 'right'];
            panelPosition = positions[(positions.indexOf(panelPosition) + 1) % 3];
            const panel = document.getElementById('we-panel');
            if (panelPosition === 'top') {
                panel.style.left = '50%';
                panel.style.top = '10px';
                panel.style.right = 'auto';
                panel.style.transform = 'translateX(-50%)';
            } else if (panelPosition === 'left') {
                panel.style.left = '10px';
                panel.style.top = '50%';
                panel.style.right = 'auto';
                panel.style.transform = 'translateY(-50%)';
            } else {
                panel.style.left = 'auto';
                panel.style.top = '50%';
                panel.style.right = '10px';
                panel.style.transform = 'translateY(-50%)';
            }
        };

        document.getElementById('we-hide-btn').onclick = function() {
            document.getElementById('we-panel').style.display = 'none';
        };

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undo();
            }
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                redo();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleDebug();
            }
            if (e.key === keyBindings.delete && !e.target.matches('input, textarea')) {
                modes.del = !modes.del;
                const btn = document.querySelector('[data-mode="del"]');
                if (btn) btn.classList.toggle('active');
                toggleMode('del', modes.del);
            }
        });

        console.clear();
        console.log('%cWEB EDIT v4.0 ULTIMATE%c Loaded', 'color:' + THEMES[currentTheme].accent + ';font-size:40px;font-weight:bold;', 'font-size:18px;');
    }function openTextModal(content) {
        document.getElementById('we-text-modal').style.display = 'flex';
        const wysiwyg = document.getElementById('we-wysiwyg');
        wysiwyg.innerHTML = content;
        
        document.querySelectorAll('[data-cmd]').forEach(function(btn) {
            btn.onclick = function() { document.execCommand(btn.dataset.cmd, false, null); };
        });

        document.getElementById('we-font-family').onchange = function(e) {
            document.execCommand('fontName', false, e.target.value);
        };

        document.getElementById('we-color-picker').onchange = function(e) {
            document.execCommand('foreColor', false, e.target.value);
        };

        document.getElementById('we-file-input').onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    wysiwyg.textContent = ev.target.result;
                };
                reader.readAsText(file);
            }
        };

        document.getElementById('we-google-font').onclick = function() {
            const font = prompt('Google Font URL:');
            if (font) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = font;
                document.head.appendChild(link);
            }
        };

        document.getElementById('we-font-size-input').oninput = function(e) {
            wysiwyg.style.fontSize = e.target.value + 'px';
        };

        document.getElementById('we-text-rotation').oninput = function(e) {
            wysiwyg.style.transform = 'rotate(' + e.target.value + 'deg)';
        };

        document.getElementById('we-text-x').oninput = function(e) {
            const y = document.getElementById('we-text-y').value;
            wysiwyg.style.position = 'relative';
            wysiwyg.style.left = e.target.value + 'px';
            wysiwyg.style.top = y + 'px';
        };

        document.getElementById('we-text-y').oninput = function(e) {
            const x = document.getElementById('we-text-x').value;
            wysiwyg.style.position = 'relative';
            wysiwyg.style.left = x + 'px';
            wysiwyg.style.top = e.target.value + 'px';
        };

        document.getElementById('we-text-shadow').oninput = function(e) {
            wysiwyg.style.textShadow = e.target.value;
        };

        document.getElementById('we-text-outline').oninput = function(e) {
            wysiwyg.style.webkitTextStroke = e.target.value;
        };

        document.getElementById('we-text-gradient').oninput = function(e) {
            wysiwyg.style.background = e.target.value;
            wysiwyg.style.webkitBackgroundClip = 'text';
            wysiwyg.style.webkitTextFillColor = 'transparent';
        };

        document.getElementById('we-save-text').onclick = function() {
            if (selectedElement) {
                selectedElement.innerHTML = wysiwyg.innerHTML;
                selectedElement.style.fontSize = document.getElementById('we-font-size-input').value + 'px';
                selectedElement.style.transform = 'rotate(' + document.getElementById('we-text-rotation').value + 'deg)';
                selectedElement.style.position = 'relative';
                selectedElement.style.left = document.getElementById('we-text-x').value + 'px';
                selectedElement.style.top = document.getElementById('we-text-y').value + 'px';
                selectedElement.style.textShadow = document.getElementById('we-text-shadow').value;
                selectedElement.style.webkitTextStroke = document.getElementById('we-text-outline').value;
                if (document.getElementById('we-text-gradient').value) {
                    selectedElement.style.background = document.getElementById('we-text-gradient').value;
                    selectedElement.style.webkitBackgroundClip = 'text';
                    selectedElement.style.webkitTextFillColor = 'transparent';
                }
            }
            saveState();
            document.getElementById('we-text-modal').style.display = 'none';
        };

        document.getElementById('we-cancel-text').onclick = function() {
            document.getElementById('we-text-modal').style.display = 'none';
        };
    }

    function openAdvancedDelete() {
        document.getElementById('we-delete-modal').style.display = 'flex';
        const list = document.getElementById('we-delete-list');
        list.innerHTML = '';
        
        const elements = Array.from(document.body.querySelectorAll('*')).filter(function(el) {
            return !isWEElement(el);
        });

        elements.forEach(function(el, idx) {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? '#' + el.id : '';
            const cls = el.className ? '.' + el.className.split(' ').join('.') : '';
            const label = tag + id + cls;
            
            const item = document.createElement('div');
            item.className = 'we-delete-item';
            item.innerHTML = '<label><input type="checkbox" data-idx="' + idx + '"> ' + label + '</label>';
            list.appendChild(item);
        });

        document.getElementById('we-delete-filter').oninput = function(e) {
            const filter = e.target.value.toLowerCase();
            document.querySelectorAll('.we-delete-item').forEach(function(item) {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(filter) ? 'flex' : 'none';
            });
        };

        document.getElementById('we-select-all-delete').onclick = function() {
            document.querySelectorAll('.we-delete-item input').forEach(function(cb) { cb.checked = true; });
        };

        document.getElementById('we-deselect-all-delete').onclick = function() {
            document.querySelectorAll('.we-delete-item input').forEach(function(cb) { cb.checked = false; });
        };

        document.getElementById('we-delete-selected').onclick = function() {
            const selected = Array.from(document.querySelectorAll('.we-delete-item input:checked'));
            if (selected.length === 0) {
                alert('No elements selected');
                return;
            }
            if (confirm('Delete ' + selected.length + ' elements?')) {
                selected.forEach(function(cb) {
                    const idx = parseInt(cb.dataset.idx);
                    if (elements[idx]) elements[idx].remove();
                });
                saveState();
                document.getElementById('we-delete-modal').style.display = 'none';
                logCommandResult('Deleted ' + selected.length + ' elements');
            }
        };

        document.getElementById('we-cancel-delete').onclick = function() {
            document.getElementById('we-delete-modal').style.display = 'none';
        };
    }

    function openHtmlModal(content) {
        document.getElementById('we-html-modal').style.display = 'flex';
        document.getElementById('we-html-editor').value = content;

        document.getElementById('we-save-html').onclick = function() {
            if (selectedElement) selectedElement.outerHTML = document.getElementById('we-html-editor').value;
            saveState();
            document.getElementById('we-html-modal').style.display = 'none';
        };

        document.getElementById('we-cancel-html').onclick = function() {
            document.getElementById('we-html-modal').style.display = 'none';
        };
    }

    function openCssModal(content) {
        document.getElementById('we-css-modal').style.display = 'flex';
        document.getElementById('we-css-editor').value = content;

        document.getElementById('we-save-css').onclick = function() {
            const style = document.createElement('style');
            style.textContent = document.getElementById('we-css-editor').value;
            document.head.appendChild(style);
            saveState();
            document.getElementById('we-css-modal').style.display = 'none';
        };

        document.getElementById('we-cancel-css').onclick = function() {
            document.getElementById('we-css-modal').style.display = 'none';
        };
    }

    function openJsModal(content) {
        document.getElementById('we-js-modal').style.display = 'flex';
        document.getElementById('we-js-editor').value = content;

        document.getElementById('we-save-js').onclick = function() {
            try {
                eval(document.getElementById('we-js-editor').value);
                saveState();
            } catch (e) {
                alert('JS Error: ' + e.message);
            }
            document.getElementById('we-js-modal').style.display = 'none';
        };

        document.getElementById('we-cancel-js').onclick = function() {
            document.getElementById('we-js-modal').style.display = 'none';
        };
    }

    function extractJsFromPage() {
        return Array.from(document.scripts).map(function(s) { return s.innerHTML; }).join('\n\n');
    }

    function executeCommand(cmd) {
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        
        switch (command) {
            case 'createbtn':
            case 'createbutton':
                document.body.insertAdjacentHTML('beforeend', commandPresets.button);
                logCommandResult('Created: button');
                break;
            case 'createinput':
                document.body.insertAdjacentHTML('beforeend', commandPresets.input);
                logCommandResult('Created: input');
                break;
            case 'createimage':
            case 'createimg':
                document.body.insertAdjacentHTML('beforeend', commandPresets.image);
                logCommandResult('Created: image');
                break;
            case 'createvideo':
                document.body.insertAdjacentHTML('beforeend', commandPresets.video);
                logCommandResult('Created: video');
                break;
            case 'create':
                if (parts[1] && commandPresets[parts[1]]) {
                    document.body.insertAdjacentHTML('beforeend', commandPresets[parts[1]]);
                    logCommandResult('Created: ' + parts[1]);
                }
                break;
            case 'insert':
                document.body.insertAdjacentHTML('beforeend', parts.slice(1).join(' '));
                logCommandResult('Inserted HTML');
                break;
            case 'clone':
                if (parts[1]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el)) {
                        const clone = el.cloneNode(true);
                        el.parentNode.insertBefore(clone, el.nextSibling);
                        logCommandResult('Cloned: ' + parts[1]);
                    } else {
                        logCommandResult('Error: Element not found or protected');
                    }
                }
                break;
            case 'hide':
                if (parts[1]) {
                    const els = document.querySelectorAll(parts[1]);
                    els.forEach(function(el) {
                        if (!isWEElement(el)) el.style.display = 'none';
                    });
                    logCommandResult('Hidden: ' + parts[1] + ' (' + els.length + ' elements)');
                }
                break;
            case 'show':
                if (parts[1]) {
                    const els = document.querySelectorAll(parts[1]);
                    els.forEach(function(el) {
                        if (!isWEElement(el)) el.style.display = '';
                    });
                    logCommandResult('Shown: ' + parts[1] + ' (' + els.length + ' elements)');
                }
                break;
            case 'move':
                if (parts[1] && parts[2] && parts[3]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el)) {
                        el.style.position = 'relative';
                        el.style.left = parts[2] + 'px';
                        el.style.top = parts[3] + 'px';
                        logCommandResult('Moved: ' + parts[1] + ' to (' + parts[2] + ', ' + parts[3] + ')');
                    } else {
                        logCommandResult('Error: Element not found or protected');
                    }
                }
                break;
            case 'resize':
                if (parts[1] && parts[2] && parts[3]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el)) {
                        el.style.width = parts[2] + 'px';
                        el.style.height = parts[3] + 'px';
                        logCommandResult('Resized: ' + parts[1] + ' to ' + parts[2] + 'x' + parts[3]);
                    } else {
                        logCommandResult('Error: Element not found or protected');
                    }
                }
                break;
            case 'debug':
                if (parts[1] === '(144)' || parts[1] === '144') toggleDebug();
                break;
            case 'help':
                const help = 'Commands: createBtn, createInput, createImage, createVideo, create [preset], insert [html], clone [selector], hide [selector], show [selector], move [selector] x y, resize [selector] w h, debug(144), help';
                logToConsole(help);
                console.log(help);
                break;
            default:
                try { 
                    eval(cmd); 
                    logCommandResult('Executed: ' + cmd); 
                } catch(e) { 
                    logCommandResult('Error: ' + e.message); 
                }
        }
        saveState();
    }

    function logToConsole(msg) {
        const consoleDiv = document.getElementById('we-console');
        if (consoleDiv) {
            consoleDiv.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + msg + '</div>';
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
    }

    function devLog(msg) {
        const devConsole = document.getElementById('we-dev-console');
        if (devConsole) {
            devConsole.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + msg + '</div>';
            devConsole.scrollTop = devConsole.scrollHeight;
        }
        console.log('%c[WE DEV] ' + msg, 'color:#0f0;font-weight:bold;');
    }

    function logCommandResult(msg) {
        logToConsole(msg);
        console.log('%c[WE] ' + msg, 'color:#0ff;');
        if (debugMode) devLog(msg);
    }

    function toggleDebug() {
        debugMode = !debugMode;
        const devSection = document.getElementById('we-dev-section');
        if (devSection) devSection.style.display = debugMode ? 'block' : 'none';
        logCommandResult('Debug Mode: ' + (debugMode ? 'ON' : 'OFF'));
    }

    window.webedit = window.we = function() {
        if (document.getElementById('we-panel')) {
            alert('WEB EDIT v4.0 ULTIMATE already active!');
            return;
        }
        init();
    };

    window.webedit.dev = window.we.dev = function() {
        if (!document.getElementById('we-panel')) {
            init();
        }
        toggleDebug();
    };

    Object.defineProperty(window, 'debug', {
        set: function(value) {
            if (value === true || value === 144 || value === '144') {
                if (!document.getElementById('we-panel')) {
                    init();
                }
                toggleDebug();
            } else if (value === false) {
                debugMode = false;
                const devSection = document.getElementById('we-dev-section');
                if (devSection) devSection.style.display = 'none';
                logCommandResult('Debug Mode: OFF');
            }
        },
        get: function() {
            return debugMode;
        }
    });

    if (!window.JSZip) {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(s);
    }

    setTimeout(function() {
        console.clear();
        console.log('%cWEB EDIT v4.0 ULTIMATE%c Ready', 'color:#ff00ff;font-size:40px;font-weight:bold;', 'font-size:16px;color:#0ff;');
        console.log('%cwebedit() | Ctrl+Shift+D = Debug', 'color:#0ff;font-size:12px;');
        console.log('%cNew in v4.0: Enhanced Text Editor, Advanced Delete, Settings, More Commands!', 'color:#f0f;font-size:11px;');
    }, 500);

})();
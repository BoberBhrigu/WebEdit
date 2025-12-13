// ==UserScript==
// @name         WEB EDIT v4.1.2 ULTIMATE — Full Power
// @namespace    H7S
// @version      4.1.2
// @description  Мощнейший редактор сайтов • Anti-Block • Script Loader • Advanced Logging • More Commands
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
    let safeMode = true;
    let loggingEnabled = false;
    let logHistory = [];
    let lockedElements = new Set();
    let loadedScripts = [];
    let customCommands = {};
    let antiBlockActive = true;
    let blockAttempts = 0;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    let keyBindings = {
        delete: 'Delete',
        undo: 'KeyZ',
        redo: 'KeyY',
        devMode: 'KeyD'
    };

    const LANG = {
        en: {
            title: 'WEB EDIT v4.1.2 ULTIMATE',
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
            gradient: 'Gradient',
            safeMode: 'Safe Mode',
            antiBlock: 'Anti-Block',
            logging: 'Enable Logging',
            exportLogs: 'Export Logs',
            loadScript: 'Load Script',
            loadedScripts: 'Loaded Scripts',
            customCommands: 'Custom Commands'
        },
        ru: {
            title: 'WEB EDIT v4.1.2 УЛЬТИМЕЙТ',
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
            gradient: 'Градиент',
            safeMode: 'Безопасный режим',
            antiBlock: 'Анти-блок',
            logging: 'Логирование',
            exportLogs: 'Экспорт логов',
            loadScript: 'Загрузить скрипт',
            loadedScripts: 'Загруженные скрипты',
            customCommands: 'Свои команды'
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
    '#we-panel{position:fixed;left:50%;transform:translateX(-50%);top:10px;background:linear-gradient(135deg,var(--bg),var(--header));color:var(--text);padding:16px 24px;border-radius:20px;box-shadow:0 15px 40px rgba(0,0,0,0.7);z-index:2147483647;font-family:Inter,sans-serif;border:2px solid var(--accent);backdrop-filter:blur(12px);min-width:320px;max-width:96vw;transition:all 0.3s;}' +
    '#we-panel.dragging{cursor:move;opacity:0.8;}' +
    '.we-compact #we-panel{padding:8px 12px;min-width:280px;}' +
    '.we-compact .we-btn{padding:6px 10px;font-size:12px;}' +
    '.we-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px;}' +
    '.we-header strong{font-size:20px;color:var(--accent);text-shadow:0 0 10px;cursor:move;user-select:none;}' +
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
    '.we-js-error{border:2px solid #ff3366!important;background:#1a0000!important;}' +
    '.we-highlight{outline:3px dashed var(--accent)!important;cursor:pointer;}' +
    '.we-locked{outline:3px solid #ff3366!important;pointer-events:none;opacity:0.7;}' +
    '#we-console,#we-dev-console{background:#000;color:#00ff00;padding:10px;font-family:monospace;height:200px;overflow:auto;border:1px solid #0f0;border-radius:5px;}' +
    '.we-command-input{width:100%;padding:10px;background:rgba(0,0,0,0.5);color:var(--text);border:1px solid var(--accent);border-radius:5px;margin-bottom:10px;}' +
    '.we-elite-close{float:right;background:#f00;color:white;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;margin-left:10px;}' +
    '#we-dev-section,#we-settings-section{display:none;}' +
    '.we-delete-list{max-height:400px;overflow:auto;background:rgba(0,0,0,0.5);padding:10px;border-radius:8px;margin-top:10px;}' +
    '.we-delete-item{padding:8px;margin:5px 0;background:rgba(255,255,255,0.1);border:1px solid var(--accent);border-radius:5px;display:flex;justify-content:space-between;align-items:center;}' +
    '.we-delete-item:hover{background:rgba(255,255,255,0.2);}' +
    '.we-delete-item input[type="checkbox"]{margin-right:10px;}' +
    '.we-filter-input{width:100%;padding:8px;margin-bottom:10px;border-radius:5px;border:1px solid var(--accent);background:rgba(0,0,0,0.5);color:var(--text);}' +
    '.we-log-entry{padding:5px;margin:2px 0;border-left:3px solid var(--accent);background:rgba(0,0,0,0.3);font-size:11px;}' +
    '.we-log-entry.error{border-left-color:#ff3366;}' +
    '.we-log-entry.warning{border-left-color:#ffaa00;}' +
    '.we-log-entry.success{border-left-color:#00ff00;}' +
    '.debug-log{color:#ff0;font-size:12px;}' +
    '@keyframes matrix-rain{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}' +
    '.matrix-char{position:fixed;color:#0f0;font-family:monospace;font-size:20px;pointer-events:none;animation:matrix-rain 3s linear infinite;z-index:999999;}' +
    '@keyframes particle-explode{0%{transform:translate(0,0) scale(1);opacity:1;}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0;}}' +
    '.particle{position:fixed;width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:999999;animation:particle-explode 1s ease-out forwards;}' +
    '@keyframes shake{0%,100%{transform:translate(0,0);}10%,30%,50%,70%,90%{transform:translate(-10px,0);}20%,40%,60%,80%{transform:translate(10px,0);}}' +
    '.shake-effect{animation:shake 0.5s;}' +
    '@keyframes color-shift{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}' +
    '.color-shift-effect{animation:color-shift 3s linear infinite;}';

    function t(key) {
        return LANG[currentLang][key] || key;
    }

    // Anti-Block System
    function initAntiBlock() {
        if (!antiBlockActive) return;

        const originalRemove = Element.prototype.remove;
        const originalRemoveChild = Node.prototype.removeChild;
        const originalSetAttribute = Element.prototype.setAttribute;

        Element.prototype.remove = function() {
            if (this.closest('#we-panel') || this.closest('[id^="we-"]')) {
                blockAttempts++;
                logAction('warning', 'Anti-Block: Prevented removal of WE element');
                if (debugMode) devLog('[ANTI-BLOCK] Blocked removal attempt #' + blockAttempts);
                return;
            }
            return originalRemove.call(this);
        };

        Node.prototype.removeChild = function(child) {
            if (child && (child.closest && (child.closest('#we-panel') || child.closest('[id^="we-"]')))) {
                blockAttempts++;
                logAction('warning', 'Anti-Block: Prevented removeChild of WE element');
                if (debugMode) devLog('[ANTI-BLOCK] Blocked removeChild attempt #' + blockAttempts);
                return child;
            }
            return originalRemoveChild.call(this, child);
        };

        Element.prototype.setAttribute = function(name, value) {
            if ((this.closest('#we-panel') || this.closest('[id^="we-"]')) && name === 'style') {
                if (value.includes('display: none') || value.includes('display:none')) {
                    blockAttempts++;
                    logAction('warning', 'Anti-Block: Prevented hiding WE element');
                    return;
                }
            }
            return originalSetAttribute.call(this, name, value);
        };

        logAction('success', 'Anti-Block System initialized');
    }

    function logAction(type, message, data) {
        if (!loggingEnabled && type !== 'error' && type !== 'warning') return;

        const entry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            data: data || null
        };

        logHistory.push(entry);
        if (logHistory.length > 1000) logHistory.shift();

        if (debugMode) {
            const color = type === 'error' ? '#f00' : type === 'warning' ? '#fa0' : '#0f0';
            console.log('%c[WE LOG] ' + type.toUpperCase() + ': ' + message, 'color:' + color);
        }

        updateLogDisplay();
    }

    function updateLogDisplay() {
        const devConsole = document.getElementById('we-dev-console');
        if (!devConsole) return;

        const lastLogs = logHistory.slice(-50);
        devConsole.innerHTML = lastLogs.map(function(log) {
            return '<div class="we-log-entry ' + log.type + '">' +
                   '<span style="opacity:0.7;">[' + new Date(log.timestamp).toLocaleTimeString() + ']</span> ' +
                   '<span style="font-weight:bold;">' + log.type.toUpperCase() + ':</span> ' +
                   log.message +
                   '</div>';
        }).join('');
        devConsole.scrollTop = devConsole.scrollHeight;
    }

    function exportLogs() {
        const data = {
            version: '4.1.2',
            timestamp: new Date().toISOString(),
            logs: logHistory,
            settings: {
                theme: currentTheme,
                language: currentLang,
                optimizationMode: optimizationMode,
                antiBlock: antiBlockActive,
                safeMode: safeMode,
                loggingEnabled: loggingEnabled
            },
            loadedScripts: loadedScripts,
            customCommands: Object.keys(customCommands)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webedit-logs-' + Date.now() + '.json';
        a.click();
        logAction('success', 'Logs exported', { count: logHistory.length });
    }

    function loadExternalScript(url) {
        return new Promise((resolve, reject) => {
            if (loadedScripts.includes(url)) {
                logAction('warning', 'Script already loaded: ' + url);
                alert('Script already loaded!');
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.onload = function() {
                loadedScripts.push(url);
                logAction('success', 'Script loaded: ' + url);
                alert('Script loaded successfully!');
                resolve();
            };
            script.onerror = function() {
                logAction('error', 'Failed to load script: ' + url);
                alert('Failed to load script!');
                reject(new Error('Failed to load script'));
            };
            document.head.appendChild(script);
        });
    }

    function addCustomCommand(name, func) {
        if (customCommands[name]) {
            logAction('warning', 'Command already exists: ' + name);
            return false;
        }
        customCommands[name] = func;
        logAction('success', 'Custom command added: ' + name);
        return true;
    }

    function validateJavaScript(code) {
        try {
            new Function(code);
            return { valid: true, error: null };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    }

    function safeExecute(code) {
        if (!safeMode) {
            eval(code);
            return;
        }

        const validation = validateJavaScript(code);
        if (!validation.valid) {
            logAction('error', 'JavaScript validation failed', { error: validation.error });
            alert('Syntax Error: ' + validation.error);
            return;
        }

        try {
            eval(code);
            logAction('success', 'Code executed successfully');
        } catch (e) {
            logAction('error', 'Runtime error', { error: e.message });
            alert('Runtime Error: ' + e.message);
        }
    }

    function lockElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
            if (!isWEElement(el)) {
                lockedElements.add(el);
                el.classList.add('we-locked');
                logAction('success', 'Element locked: ' + selector);
            }
        });
    }

    function unlockElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
            if (lockedElements.has(el)) {
                lockedElements.delete(el);
                el.classList.remove('we-locked');
                logAction('success', 'Element unlocked: ' + selector);
            }
        });
    }

    function isElementLocked(el) {
        return lockedElements.has(el) || el.classList.contains('we-locked');
    }

    function duplicateElement(selector) {
        const el = document.querySelector(selector);
        if (!el || isWEElement(el)) {
            logAction('error', 'Cannot duplicate: element not found or protected');
            return;
        }

        const clone = el.cloneNode(true);
        const parent = el.parentNode;
        const rect = el.getBoundingClientRect();

        clone.style.position = 'absolute';
        clone.style.left = (rect.left + 20) + 'px';
        clone.style.top = (rect.top + 20) + 'px';

        parent.insertBefore(clone, el.nextSibling);
        logAction('success', 'Element duplicated: ' + selector);
        saveState();
    }

    function setElementStyle(selector, property, value) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            logAction('error', 'No elements found: ' + selector);
            return;
        }

        elements.forEach(function(el) {
            if (!isWEElement(el) && !isElementLocked(el)) {
                el.style[property] = value;
            }
        });

        logAction('success', 'Style applied: ' + selector + ' { ' + property + ': ' + value + ' }');
        saveState();
    }

    // Drag & Drop panel
    function initDragDrop() {
        const panel = document.getElementById('we-panel');
        const header = panel.querySelector('.we-header strong');

        header.addEventListener('mousedown', function(e) {
            isDragging = true;
            panel.classList.add('dragging');
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const panel = document.getElementById('we-panel');
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                const panel = document.getElementById('we-panel');
                panel.classList.remove('dragging');
            }
        });
    }

    // Beta Functions
    function createMatrixRain() {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const interval = setInterval(function() {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.left = Math.random() * window.innerWidth + 'px';
            char.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(char);

            setTimeout(function() { char.remove(); }, 5000);
        }, 100);

        logAction('success', 'Matrix Rain effect enabled');

        setTimeout(function() {
            clearInterval(interval);
            document.querySelectorAll('.matrix-char').forEach(function(el) { el.remove(); });
        }, 10000);
    }

    function createParticleExplosion(x, y) {
        const colors = ['#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#ffff00'];
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
            document.body.appendChild(particle);

            setTimeout(function() { particle.remove(); }, 1000);
        }
    }

    function enableParticleClick() {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#we-panel')) {
                createParticleExplosion(e.clientX, e.clientY);
            }
        });
        logAction('success', 'Particle explosion on click enabled');
    }

    function screenShake() {
        document.body.classList.add('shake-effect');
        setTimeout(function() {
            document.body.classList.remove('shake-effect');
        }, 500);
        logAction('success', 'Screen shake effect');
    }

    function colorShiftEffect() {
        document.body.classList.toggle('color-shift-effect');
        logAction('success', 'Color shift effect toggled');
    }

    function pixelateEffect() {
        const current = document.body.style.imageRendering;
        document.body.style.imageRendering = current === 'pixelated' ? 'auto' : 'pixelated';
        document.body.style.filter = current === 'pixelated' ? '' : 'contrast(1.2) saturate(1.5)';
        logAction('success', 'Pixelate effect toggled');
    }

    function waveEffect() {
        const elements = document.querySelectorAll('*:not(#we-panel):not([id^="we-"])');
        let delay = 0;
        elements.forEach(function(el) {
            setTimeout(function() {
                el.style.transform = 'translateY(-20px)';
                setTimeout(function() {
                    el.style.transform = '';
                }, 300);
            }, delay);
            delay += 50;
        });
        logAction('success', 'Wave effect applied');
    }

    function tilt3DEffect() {
        document.body.style.transform = document.body.style.transform ? '' : 'perspective(1000px) rotateX(5deg) rotateY(5deg)';
        logAction('success', '3D tilt effect toggled');
    }

    function blurBackgroundEffect() {
        const elements = document.querySelectorAll('*:not(#we-panel):not([id^="we-"])');
elements.forEach(function(el) {
const current = el.style.filter;
el.style.filter = current.includes('blur') ? '' : 'blur(3px)';
});
logAction('success', 'Background blur toggled');
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
      '<button class="we-btn" id="beta-matrix">Matrix Rain</button>' +
      '<button class="we-btn" id="beta-particle">Particle Click</button>' +
      '<button class="we-btn" id="beta-shake">Screen Shake</button>' +
      '<button class="we-btn" id="beta-colorshift">Color Shift</button>' +
      '<button class="we-btn" id="beta-pixelate">Pixelate</button>' +
      '<button class="we-btn" id="beta-wave">Wave Effect</button>' +
      '<button class="we-btn" id="beta-tilt">3D Tilt</button>' +
      '<button class="we-btn" id="beta-blur">Blur BG</button>' +
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
        '<p style="font-size:11px;opacity:0.7;margin-top:5px;">Undo: 30 steps, compact UI</p>' +
      '</div>' +
      '<div style="grid-column:1/-1;margin-top:10px;">' +
        '<label><input type="checkbox" id="we-anti-block" checked> ' + t('antiBlock') + '</label>' +
        '<p style="font-size:11px;opacity:0.7;margin-top:5px;">Protect WE from blocking</p>' +
      '</div>' +
      '<div style="grid-column:1/-1;margin-top:10px;">' +
        '<label><input type="checkbox" id="we-safe-mode" checked> ' + t('safeMode') + '</label>' +
        '<p style="font-size:11px;opacity:0.7;margin-top:5px;">Validate JS before execution</p>' +
      '</div>' +
      '<div style="grid-column:1/-1;margin-top:10px;">' +
        '<label><input type="checkbox" id="we-logging"> ' + t('logging') + '</label>' +
        '<p style="font-size:11px;opacity:0.7;margin-top:5px;">Enable action logging</p>' +
      '</div>' +
      '<div style="grid-column:1/-1;margin-top:10px;">' +
        '<button class="we-btn" id="we-export-logs">' + t('exportLogs') + '</button>' +
        '<button class="we-btn" id="we-load-script">' + t('loadScript') + '</button>' +
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
      '<div style="grid-column:1/-1;margin-top:10px;">' +
        '<h4 style="margin:0 0 5px 0;">' + t('loadedScripts') + ' (' + loadedScripts.length + ')</h4>' +
        '<div id="we-loaded-scripts-list" style="font-size:11px;max-height:100px;overflow:auto;"></div>' +
      '</div>' +
    '</div>' +
  '</details>' +
  '<details class="we-elite" id="we-elite-section" style="display:none;">' +
    '<summary>' + t('eliteMenu') + ' <button class="we-elite-close" id="we-elite-close">✕</button></summary>' +
    '<div class="we-elite-grid" style="resize:both;overflow:auto;max-height:400px;min-height:200px;">' +
      '<input type="text" class="we-command-input" id="we-command-input" placeholder="Command: createBtn, duplicate body, lock .ad, style body bg red, help">' +
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
    '<summary>' + t('about') + ' WEB EDIT v4.1.2 ULTIMATE</summary>' +
    '<div style="font-size:13px;line-height:1.5;">' +
      '<br><b>v4.1.2 (ULTIMATE):</b><br>' +
      '• Anti-Block System<br>' +
      '• Script Loader & Custom Commands<br>' +
      '• Advanced Logging & Export<br>' +
      '• Lock/Unlock Elements<br>' +
      '• Duplicate, Style commands<br>' +
      '• JS Syntax Validation<br>' +
      '• Drag & Drop Panel<br>' +
      '• 8 New Beta Effects<br>' +
      '• Enhanced Text Editor (up to 128px, rotation, X/Y)<br>' +
      '• Advanced Delete with filter<br>' +
      '• Settings: Language, Optimization, Key Bindings<br><br>' +
      '<b>WEB EDIT v4.1.2 ULTIMATE — 2025</b>' +
    '</div>' +
  '</details>' +
'</div>' +'<div id="we-text-modal">' +
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
        '<h3 style="margin-top:0;">JS <span id="we-js-validation" style="font-size:12px;"></span></h3>' +
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
        logAction('success', 'State saved', { step: historyStep });
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            document.documentElement.outerHTML = history[historyStep];
            setTimeout(init, 200);
            logAction('success', 'Undo', { step: historyStep });
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            document.documentElement.outerHTML = history[historyStep];
            setTimeout(init, 200);
            logAction('success', 'Redo', { step: historyStep });
        }
    }

    function applyTheme(name) {
        const theme = THEMES[name] || THEMES.cyberpunk;
        document.documentElement.style.setProperty('--bg', theme.bg);
        document.documentElement.style.setProperty('--accent', theme.accent);
        document.documentElement.style.setProperty('--text', theme.text);
        document.documentElement.style.setProperty('--header', theme.header);
        currentTheme = name;
        if (debugMode) devLog('[THEME] ' + name);
        logAction('success', 'Theme changed: ' + name);

        const themeSelect = document.getElementById('we-theme-select');
        if (themeSelect) themeSelect.value = name;
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
        initAntiBlock();
        initDragDrop();

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

        document.getElementById('we-anti-block').checked = antiBlockActive;
        document.getElementById('we-anti-block').onchange = function(e) {
            antiBlockActive = e.target.checked;
            if (antiBlockActive) initAntiBlock();
            logCommandResult('Anti-Block: ' + (antiBlockActive ? 'ON' : 'OFF'));
        };

        document.getElementById('we-safe-mode').checked = safeMode;
        document.getElementById('we-safe-mode').onchange = function(e) {
            safeMode = e.target.checked;
            logCommandResult('Safe Mode: ' + (safeMode ? 'ON' : 'OFF'));
        };

        document.getElementById('we-logging').checked = loggingEnabled;
        document.getElementById('we-logging').onchange = function(e) {
            loggingEnabled = e.target.checked;
            logCommandResult('Logging: ' + (loggingEnabled ? 'ON' : 'OFF'));
        };

        document.getElementById('we-export-logs').onclick = function() {
            exportLogs();
        };

        document.getElementById('we-load-script').onclick = function() {
            const url = prompt('Enter script URL (CDN):');
            if (url) {
                loadExternalScript(url).catch(function(e) {
                    console.error(e);
                });
            }
        };

        document.getElementById('we-settings-toggle').onclick = function() {
            const section = document.getElementById('we-settings-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
            updateLoadedScriptsList();
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
                if (isWEElement(e.target) || isElementLocked(e.target)) return;
                e.preventDefault();
                e.stopPropagation();
                e.target.remove();
                saveState();
                logAction('success', 'Element deleted');
            }
        }, true);

        document.addEventListener('mouseover', function(e) {
            if (modes.style && !isWEElement(e.target) && !isElementLocked(e.target)) {
                e.target.classList.add('we-highlight');
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (modes.style) e.target.classList.remove('we-highlight');
        });

        document.addEventListener('click', function(e) {
            if (modes.style && !isWEElement(e.target) && !isElementLocked(e.target)) {
                e.preventDefault();
                selectedElement = e.target;
                const currentStyle = e.target.style.cssText;
                const newStyle = prompt('Edit style (CSS):', currentStyle);
                if (newStyle !== null) {
                    e.target.style.cssText = newStyle;
                    saveState();
                    logAction('success', 'Style edited');
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
                document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:#f00;">NUKED BY WEB EDIT v4.1.2</h1>';
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

        document.getElementById('beta-matrix').onclick = createMatrixRain;
        document.getElementById('beta-particle').onclick = enableParticleClick;
        document.getElementById('beta-shake').onclick = screenShake;
        document.getElementById('beta-colorshift').onclick = colorShiftEffect;
        document.getElementById('beta-pixelate').onclick = pixelateEffect;
        document.getElementById('beta-wave').onclick = waveEffect;
        document.getElementById('beta-tilt').onclick = tilt3DEffect;
        document.getElementById('beta-blur').onclick = blurBackgroundEffect;

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
        console.log('%cWEB EDIT v4.1.2 ULTIMATE%c Loaded', 'color:' + THEMES[currentTheme].accent + ';font-size:40px;font-weight:bold;', 'font-size:18px;');
    }

    function updateLoadedScriptsList() {
        const list = document.getElementById('we-loaded-scripts-list');
        if (!list) return;

        if (loadedScripts.length === 0) {
            list.innerHTML = '<p style="opacity:0.5;">No scripts loaded</p>';
        } else {
            list.innerHTML = loadedScripts.map(function(url) {
                return '<div style="padding:3px;border-bottom:1px solid rgba(255,255,255,0.1);">' + url + '</div>';
            }).join('');
        }
    }
    function openTextModal(content) {
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
            logAction('success', 'Text edited and saved');
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
            const cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : '';
            const label = tag + id + cls;
            const isLocked = isElementLocked(el);

            const item = document.createElement('div');
            item.className = 'we-delete-item';
            item.innerHTML = '<label style="display:flex;align-items:center;gap:5px;">' +
                '<input type="checkbox" data-idx="' + idx + '" ' + (isLocked ? 'disabled' : '') + '> ' +
                label + (isLocked ? ' <span style="color:#ff3366;font-size:10px;">[LOCKED]</span>' : '') +
                '</label>';
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
            document.querySelectorAll('.we-delete-item input:not(:disabled)').forEach(function(cb) { cb.checked = true; });
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
                let deletedCount = 0;
                selected.forEach(function(cb) {
                    const idx = parseInt(cb.dataset.idx);
                    if (elements[idx] && !isElementLocked(elements[idx])) {
                        elements[idx].remove();
                        deletedCount++;
                    }
                });
                saveState();
                document.getElementById('we-delete-modal').style.display = 'none';
                logCommandResult('Deleted ' + deletedCount + ' elements');
                logAction('success', 'Advanced delete', { count: deletedCount });
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
            if (selectedElement && !isWEElement(selectedElement) && !isElementLocked(selectedElement)) {
                selectedElement.outerHTML = document.getElementById('we-html-editor').value;
                saveState();
                logAction('success', 'HTML edited');
            }
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
            logAction('success', 'CSS added');
        };

        document.getElementById('we-cancel-css').onclick = function() {
            document.getElementById('we-css-modal').style.display = 'none';
        };
    }

    function openJsModal(content) {
        document.getElementById('we-js-modal').style.display = 'flex';
        const editor = document.getElementById('we-js-editor');
        const validation = document.getElementById('we-js-validation');
        editor.value = content;
        editor.classList.remove('we-js-error');

        editor.oninput = function() {
            const code = editor.value;
            const result = validateJavaScript(code);

            if (result.valid) {
                editor.classList.remove('we-js-error');
                validation.innerHTML = '<span style="color:#00ff00;">✓ Valid</span>';
            } else {
                editor.classList.add('we-js-error');
                validation.innerHTML = '<span style="color:#ff3366;">✗ ' + result.error + '</span>';
            }
        };

        document.getElementById('we-save-js').onclick = function() {
            const code = editor.value;
            safeExecute(code);
            saveState();
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

        if (customCommands[command]) {
            try {
                customCommands[command](parts.slice(1));
                logCommandResult('Custom command executed: ' + command);
                return;
            } catch (e) {
                logCommandResult('Custom command error: ' + e.message);
                return;
            }
        }

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
            case 'duplicate':
                if (parts[1]) {
                    duplicateElement(parts[1]);
                }
                break;
            case 'clone':
                if (parts[1]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el) && !isElementLocked(el)) {
                        const clone = el.cloneNode(true);
                        el.parentNode.insertBefore(clone, el.nextSibling);
                        logCommandResult('Cloned: ' + parts[1]);
                    } else {
                        logCommandResult('Error: Element not found, protected or locked');
                    }
                }
                break;
            case 'hide':
                if (parts[1]) {
                    const els = document.querySelectorAll(parts[1]);
                    let count = 0;
                    els.forEach(function(el) {
                        if (!isWEElement(el) && !isElementLocked(el)) {
                            el.style.display = 'none';
                            count++;
                        }
                    });
                    logCommandResult('Hidden: ' + parts[1] + ' (' + count + ' elements)');
                }
                break;
            case 'show':
                if (parts[1]) {
                    const els = document.querySelectorAll(parts[1]);
                    let count = 0;
                    els.forEach(function(el) {
                        if (!isWEElement(el) && !isElementLocked(el)) {
                            el.style.display = '';
                            count++;
                        }
                    });
                    logCommandResult('Shown: ' + parts[1] + ' (' + count + ' elements)');
                }
                break;
            case 'move':
                if (parts[1] && parts[2] && parts[3]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el) && !isElementLocked(el)) {
                        el.style.position = 'relative';
                        el.style.left = parts[2] + 'px';
                        el.style.top = parts[3] + 'px';
                        logCommandResult('Moved: ' + parts[1] + ' to (' + parts[2] + ', ' + parts[3] + ')');
                    } else {
                        logCommandResult('Error: Element not found, protected or locked');
                    }
                }
                break;
            case 'resize':
                if (parts[1] && parts[2] && parts[3]) {
                    const el = document.querySelector(parts[1]);
                    if (el && !isWEElement(el) && !isElementLocked(el)) {
                        el.style.width = parts[2] + 'px';
                        el.style.height = parts[3] + 'px';
                        logCommandResult('Resized: ' + parts[1] + ' to ' + parts[2] + 'x' + parts[3]);
                    } else {
                        logCommandResult('Error: Element not found, protected or locked');
                    }
                }
                break;
            case 'style':
                if (parts[1] && parts[2] && parts[3]) {
                    setElementStyle(parts[1], parts[2], parts.slice(3).join(' '));
                }
                break;
            case 'lock':
                if (parts[1]) {
                    lockElement(parts[1]);
                }
                break;
            case 'unlock':
                if (parts[1]) {
                    unlockElement(parts[1]);
                }
                break;
            case 'loadscript':
            case 'load':
                if (parts[1]) {
                    loadExternalScript(parts[1]).catch(function(e) {
                        logCommandResult('Error loading script: ' + e.message);
                    });
                }
                break;
            case 'export':
                if (parts[1] === 'html') {
                    document.getElementById('we-download').click();
                } else if (parts[1] === 'logs') {
                    exportLogs();
                }
break;
            case 'debug':
                if (parts[1] === '(144)' || parts[1] === '144') toggleDebug();
                break;
            case 'help': {
                const help = 'Commands: createBtn, createInput, createImage, createVideo | create [preset], insert [html] | duplicate [selector] | clone [selector], hide [selector], show [selector] | move [selector] x y, resize [selector] w h | style [selector] property value | lock [selector], unlock [selector] | loadScript [url], export html, export logs | debug(144), help | javascript: [code] | Custom: ' + Object.keys(customCommands).join(', ');
                logToConsole(help);
                console.log(help);
                alert(help);
                break;
            }
            default:
                if (cmd.toLowerCase().startsWith('javascript:')) {
                    const jsCode = cmd.substring(11).trim();
                    safeExecute(jsCode);
                } else {
                    try {
                        safeExecute(cmd);
                    } catch(e) {
                        logCommandResult('Error: ' + e.message);
                    }
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
        logAction('success', msg);
    }

    function toggleDebug() {
        debugMode = !debugMode;
        const devSection = document.getElementById('we-dev-section');
        if (devSection) devSection.style.display = debugMode ? 'block' : 'none';
        logCommandResult('Debug Mode: ' + (debugMode ? 'ON' : 'OFF'));
        if (debugMode) updateLogDisplay();
    }

    document.addEventListener('click', function(e) {
        if (e.target.id === 'we-delete-modal') {
            document.getElementById('we-delete-modal').style.display = 'none';
        }
        if (e.target.id === 'we-text-modal') {
            document.getElementById('we-text-modal').style.display = 'none';
        }
        if (e.target.id === 'we-html-modal') {
            document.getElementById('we-html-modal').style.display = 'none';
        }
        if (e.target.id === 'we-css-modal') {
            document.getElementById('we-css-modal').style.display = 'none';
        }
        if (e.target.id === 'we-js-modal') {
            document.getElementById('we-js-modal').style.display = 'none';
        }
    });

    window.webedit = window.we = function() {
        if (document.getElementById('we-panel')) {
            alert('WEB EDIT v4.1.2 ULTIMATE already active!');
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

    window.webedit.addCommand = window.we.addCommand = addCustomCommand;
    window.webedit.lock = window.we.lock = lockElement;
    window.webedit.unlock = window.we.unlock = unlockElement;
    window.webedit.loadScript = window.we.loadScript = loadExternalScript;
    window.webedit.exportLogs = window.we.exportLogs = exportLogs;

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
        console.log('%cWEB EDIT v4.1.2 ULTIMATE%c Ready', 'color:#ff00ff;font-size:40px;font-weight:bold;', 'font-size:16px;color:#0ff;');
        console.log('%cwebedit() | Ctrl+Shift+D = Debug | webedit.addCommand(name, func)', 'color:#0ff;font-size:12px;');
        console.log('%cNew: Anti-Block, Script Loader, Logging, Lock/Unlock, duplicate, style commands!', 'color:#f0f;font-size:11px;');
    }, 500);

})();
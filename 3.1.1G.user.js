// ==UserScript==
// @name         WEB EDIT v3.1.1 ELITE — GitHub Safe
// @namespace    https://webedit.pro
// @version      3.1.1
// @description  Мощный редактор сайтов • HTML/CSS/JS • Темы • Dev Mode • GitHub Safe
// @author       Your God
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

    const commandPresets = {
        button: '<button onclick="alert(\'Click!\')">Новая Кнопка</button>',
        form: '<form><input type="text" placeholder="Ввод"><button>Отправить</button></form>',
        div: '<div style="background:red;padding:20px;">Новый DIV</div>',
        script: '<script>console.log("JS!");<\/script>',
        menuBtn: '<button style="position:fixed;top:10px;right:10px;z-index:9999;background:purple;color:white;padding:10px;border-radius:5px;">Elite Menu</button>'
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
    '.we-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px;}' +
    '.we-header strong{font-size:20px;color:var(--accent);text-shadow:0 0 10px;}' +
    '.we-tools{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;}' +
    '.we-btn{padding:10px 16px;background:rgba(255,255,255,0.05);border:1px solid var(--accent);color:var(--accent);border-radius:12px;cursor:pointer;font-weight:600;transition:all 0.3s;backdrop-filter:blur(5px);}' +
    '.we-btn:hover{background:var(--accent);color:#000;transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.4);}' +
    '.we-btn.active{background:var(--accent);color:#000;box-shadow:0 0 20px var(--accent);}' +
    '.we-btn.danger{border-color:#ff3366;color:#ff3366;}' +
    '.we-btn.danger:hover{background:#ff3366;color:white;}' +
    '.we-btn.elite{border-color:#00ff00;color:#00ff00;font-size:12px;}' +
    '.we-btn.elite:hover{background:#00ff00;color:#000;}' +
    'details.we-beta,details.we-about,details.we-elite,details.we-dev{margin-top:16px;background:rgba(0,0,0,0.3);padding:12px;border-radius:12px;}' +
    'summary{cursor:pointer;font-weight:600;color:var(--accent);user-select:none;}' +
    '.we-beta-grid,.we-elite-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;margin-top:10px;}' +
    '#we-text-modal,#we-html-modal,#we-css-modal,#we-js-modal,#we-elite-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);z-index:2147483647;display:none;align-items:center;justify-content:center;}' +
    '.we-modal-content{background:var(--bg);padding:24px;border-radius:20px;border:2px solid var(--accent);width:90%;max-width:900px;max-height:90vh;overflow:auto;color:var(--text);resize:both;}' +
    '.we-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;padding:12px;background:rgba(0,0,0,0.3);border-radius:12px;}' +
    '.we-toolbar button,.we-toolbar select,.we-toolbar input{padding:8px 12px;border-radius:8px;border:1px solid var(--accent);background:rgba(255,255,255,0.1);color:var(--text);}' +
    '#we-wysiwyg,#we-html-editor,#we-css-editor,#we-js-editor{width:100%;min-height:300px;background:#111;color:white;padding:20px;border-radius:12px;font-size:16px;outline:none;font-family:"Roboto Mono",monospace;border:1px solid var(--accent);}' +
    '.we-highlight{outline:3px dashed var(--accent)!important;cursor:pointer;}' +
    '#we-console{background:#000;color:#00ff00;padding:10px;font-family:monospace;height:200px;overflow:auto;border:1px solid #0f0;border-radius:5px;}' +
    '.we-command-input{width:100%;padding:10px;background:rgba(0,0,0,0.5);color:var(--text);border:1px solid var(--accent);border-radius:5px;margin-bottom:10px;}' +
    '.we-elite-close{float:right;background:#f00;color:white;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;margin-left:10px;}' +
    '#we-dev-section{display:none;}' +
    '.debug-log{color:#ff0;font-size:12px;}';

    const panelHTML = '<div id="we-panel">' +
      '<div class="we-header">' +
        '<strong>WEB EDIT v3.1.1 ELITE</strong>' +
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
          '<button class="we-btn" id="we-pos-btn" style="padding:5px 10px;">Position</button>' +
          '<button class="we-btn" id="we-hide-btn" style="padding:5px 10px;">Hide</button>' +
          '<button class="we-btn elite" id="we-elite-toggle">Elite Menu</button>' +
        '</div>' +
      '</div>' +
      '<div class="we-tools">' +
        '<button class="we-btn" data-mode="text">Text Control</button>' +
        '<button class="we-btn" data-mode="del">Delete</button>' +
        '<button class="we-btn" data-mode="style">Style Edit</button>' +
        '<button class="we-btn" data-mode="html">HTML Edit</button>' +
        '<button class="we-btn" data-mode="css">CSS Edit</button>' +
        '<button class="we-btn" data-mode="js">JS Edit</button>' +
        '<button class="we-btn" id="we-dark">Dark Mode</button>' +
        '<button class="we-btn" id="we-rainbow">Rainbow</button>' +
        '<button class="we-btn" id="we-fps">FPS: 60</button>' +
        '<button class="we-btn" id="we-rotate">Rotate: 0°</button>' +
        '<button class="we-btn" id="we-undo">Undo</button>' +
        '<button class="we-btn" id="we-redo">Redo</button>' +
        '<button class="we-btn" id="we-download">Download HTML</button>' +
        '<button class="we-btn" id="we-download-zip">Download ZIP</button>' +
        '<button class="we-btn" id="we-command-preset">Заготовки</button>' +
        '<button class="we-btn danger" id="we-nuke">NUKE</button>' +
      '</div>' +
      '<details class="we-beta">' +
        '<summary>BETA ФУНКЦИИ</summary>' +
        '<div class="we-beta-grid">' +
          '<button class="we-btn" id="beta-glitch">Glitch</button>' +
          '<button class="we-btn" id="beta-neon">Neon Glow</button>' +
          '<button class="we-btn" id="beta-trail">Mouse Trail</button>' +
          '<button class="we-btn" id="beta-speed">Speed ×2</button>' +
        '</div>' +
      '</details>' +
      '<details class="we-elite" id="we-elite-section" style="display:none;">' +
        '<summary>ELITE SECRET MENU <button class="we-elite-close" id="we-elite-close">✕</button></summary>' +
        '<div class="we-elite-grid" style="resize:both;overflow:auto;max-height:400px;min-height:200px;">' +
          '<input type="text" class="we-command-input" id="we-command-input" placeholder="Команда: create button, debug(144), help">' +
          '<button class="we-btn" id="we-execute-command">Execute</button>' +
          '<div id="we-console"></div>' +
          '<button class="we-btn" id="we-clear-console">Clear Console</button>' +
        '</div>' +
      '</details>' +
      '<details class="we-dev" id="we-dev-section">' +
        '<summary>DEV TOOLS <button class="we-elite-close" id="we-dev-close">✕</button></summary>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:10px;">' +
          '<button class="we-btn" id="dev-inspect">Inspect</button>' +
          '<button class="we-btn" id="dev-performance">Performance</button>' +
          '<button class="we-btn" id="dev-console-log">Console Log</button>' +
          '<button class="we-btn danger" id="dev-disable-all">Disable All</button>' +
        '</div>' +
        '<div id="we-dev-console" style="margin-top:10px;background:#000;color:#0f0;padding:10px;font-family:monospace;height:150px;overflow:auto;border:1px solid #0f0;border-radius:5px;"></div>' +
      '</details>' +
      '<details class="we-about">' +
        '<summary>About WEB EDIT v3.1.1 ELITE</summary>' +
        '<div style="font-size:13px;line-height:1.5;">' +
          '<br><b>v3.1.1 (GitHub Safe):</b><br>' +
          '• Delete fix<br>' +
          '• Elite Menu: Close + Resize<br>' +
          '• Commands в консоль<br>' +
          '• Dev Mode: debug(144)<br>' +
          '• Download ZIP<br>' +
          '• Удалены: RickRoll, Epilepsy, Freeze, Server<br><br>' +
          '<b>WEB EDIT v3.1.1 ELITE — 2025</b>' +
        '</div>' +
      '</details>' +
    '</div>' +
    '<div id="we-text-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">Текст</h3>' +
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
          '<select id="we-font-size">' +
            '<option>12px</option><option>16px</option><option>24px</option><option>36px</option>' +
          '</select>' +
          '<input type="color" id="we-color-picker" value="#ffffff">' +
          '<input type="file" id="we-file-input" accept=".txt,text/plain">' +
          '<button id="we-google-font">Google Font</button>' +
        '</div>' +
        '<div contenteditable="true" id="we-wysiwyg"></div>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-text">Сохранить</button>' +
          '<button class="we-btn" id="we-cancel-text">Отмена</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-html-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">HTML</h3>' +
        '<textarea id="we-html-editor" placeholder="HTML..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-html">Сохранить</button>' +
          '<button class="we-btn" id="we-cancel-html">Отмена</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-css-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">CSS</h3>' +
        '<textarea id="we-css-editor" placeholder="CSS..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-css">Сохранить</button>' +
          '<button class="we-btn" id="we-cancel-css">Отмена</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-js-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">JS</h3>' +
        '<textarea id="we-js-editor" placeholder="JS..."></textarea>' +
        '<div style="margin-top:20px;text-align:right;">' +
          '<button class="we-btn" id="we-save-js">Сохранить</button>' +
          '<button class="we-btn" id="we-cancel-js">Отмена</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="we-elite-modal">' +
      '<div class="we-modal-content">' +
        '<h3 style="margin-top:0;">Elite Pro Console</h3>' +
        '<div id="we-elite-console" style="background:#000;color:#0f0;padding:20px;height:400px;overflow:auto;font-family:monospace;border:1px solid #0f0;border-radius:8px;"></div>' +
        '<input type="text" id="we-elite-command" placeholder="fps 30, rotate 90, theme matrix" style="width:100%;padding:10px;margin-top:10px;background:#111;color:#0f0;border:1px solid #0f0;border-radius:5px;">' +
        '<button class="we-btn" id="we-elite-execute" style="margin-top:10px;">Run</button>' +
      '</div>' +
    '</div>';

    function saveState() {
        historyStep++;
        history = history.slice(0, historyStep);
        history.push(document.documentElement.outerHTML);
        if (history.length > 100) history.shift();
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

    function init() {
        if (document.getElementById('we-panel')) return;

        const style = document.createElement('style');
        style.textContent = css.replace(/var\(--bg\)/g, THEMES[currentTheme].bg)
                               .replace(/var\(--accent\)/g, THEMES[currentTheme].accent)
                               .replace(/var\(--text\)/g, THEMES[currentTheme].text)
                               .replace(/var\(--header\)/g, THEMES[currentTheme].header);
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', panelHTML);
        applyTheme(currentTheme);
        saveState();

        document.querySelectorAll('[data-mode]').forEach(function(btn) {
            btn.onclick = function() {
                const mode = btn.dataset.mode;
                modes[mode] = !modes[mode];
                btn.classList.toggle('active');
                toggleMode(mode, modes[mode]);
            };
        });

        document.addEventListener('dblclick', function(e) {
            if ((modes.text || modes.html) && !e.target.closest('#we-panel') && !e.target.closest('[id^="we-"]')) {
                e.preventDefault();
                selectedElement = e.target;
                if (modes.text) openTextModal(e.target.innerHTML);
                if (modes.html) openHtmlModal(e.target.outerHTML);
            }
        });

        document.addEventListener('click', function(e) {
            if (modes.del && e.target !== document.body) {
                if (e.target.closest('#we-panel') || e.target.closest('[id^="we-"]')) return;
                e.target.remove();
                saveState();
            }
        });

        document.addEventListener('mouseover', function(e) {
            if (modes.style && !e.target.closest('#we-panel') && !e.target.closest('[id^="we-"]')) {
                e.target.classList.add('we-highlight');
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (modes.style) e.target.classList.remove('we-highlight');
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
            const preset = prompt('Доступные: ' + presets, 'button');
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
            if (confirm('NUKE всю страницу?')) {
                document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:#f00;">NUKED BY WEB EDIT v3.1.1</h1>';
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
            if (e.ctrlKey && e.key === 'z') undo();
            if (e.ctrlKey && e.key === 'y') redo();
            if (e.ctrlKey && e.shiftKey && e.key === 'D') toggleDebug();
        });

        console.clear();
        console.log('%cWEB EDIT v3.1.1 ELITE%c Loaded', 'color:' + THEMES[currentTheme].accent + ';font-size:40px;font-weight:bold;', 'font-size:18px;');
    }

    function openTextModal(content) {
        document.getElementById('we-text-modal').style.display = 'flex';
        document.getElementById('we-wysiwyg').innerHTML = content;
        
        document.querySelectorAll('[data-cmd]').forEach(function(btn) {
            btn.onclick = function() { document.execCommand(btn.dataset.cmd, false, null); };
        });

        document.getElementById('we-font-family').onchange = function(e) {
            document.execCommand('fontName', false, e.target.value);
        };

        document.getElementById('we-font-size').onchange = function(e) {
            document.getElementById('we-wysiwyg').style.fontSize = e.target.value;
        };

        document.getElementById('we-color-picker').onchange = function(e) {
            document.execCommand('foreColor', false, e.target.value);
        };

        document.getElementById('we-file-input').onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    document.getElementById('we-wysiwyg').textContent = ev.target.result;
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

        document.getElementById('we-save-text').onclick = function() {
            if (selectedElement) selectedElement.innerHTML = document.getElementById('we-wysiwyg').innerHTML;
            saveState();
            document.getElementById('we-text-modal').style.display = 'none';
        };

        document.getElementById('we-cancel-text').onclick = function() {
            document.getElementById('we-text-modal').style.display = 'none';
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
        const parts = cmd.toLowerCase().split(' ');
        switch (parts[0]) {
            case 'create':
                if (parts[1] in commandPresets) {
                    document.body.insertAdjacentHTML('beforeend', commandPresets[parts[1]]);
                    logCommandResult('Created: ' + parts[1]);
                }
                break;
            case 'insert':
                document.body.insertAdjacentHTML('beforeend', parts.slice(1).join(' '));
                break;
            case 'debug':
                if (parts[1] === '(144)') toggleDebug();
                break;
            case 'help':
                const help = 'Commands: create [button|form|div|script|menuBtn], insert [html], debug(144), help';
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
            alert('WEB EDIT v3.1.1 ELITE уже активен!');
            return;
        }
        init();
    };

    if (!window.JSZip) {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(s);
    }

    setTimeout(function() {
        console.clear();
        console.log('%cWEB EDIT v3.1.1 ELITE%c Ready', 'color:#ff00ff;font-size:40px;font-weight:bold;', 'font-size:16px;color:#0ff;');
        console.log('%cwebedit() | Ctrl+Shift+D = Debug', 'color:#0ff;font-size:12px;');
    }, 500);
// === ДОПОЛНИТЕЛЬНЫЕ КОМАНДЫ ДЛЯ DEV MODE ===
    
    // Команда в консоли: webedit('dev') или we('dev')
    window.webedit.dev = window.we.dev = function() {
        if (!document.getElementById('we-panel')) {
            init();
        }
        toggleDebug();
    };

    // Команда в консоли: debug = true;
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

    // Улучшенная команда debug в Elite Menu
    const originalExecuteCommand = executeCommand;
    executeCommand = function(cmd) {
        const cleanCmd = cmd.toLowerCase().replace(/[^\w\s]/g, ''); // Убираем спецсимволы
        if (cleanCmd.includes('debug')) {
            toggleDebug();
            return;
        }
        originalExecuteCommand(cmd);
    };

})();

      
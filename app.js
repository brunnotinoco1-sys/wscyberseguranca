// ==========================================
// W&S Cyber Segurança - Core Logic (2026)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initNavigation();
    initMobileMenu();
    initThreatMap();
    initPasswordChecker();
    initRiskQuiz();
    initEncryptor();
    initGlossaryFilter();
    initPricingCalculator();
    initFormHandlers();
});

// 1. Digital Clock System
function initClock() {
    const timeDisplay = document.getElementById('systemTime');
    
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = `CORE_TIME: ${hrs}:${mins}:${secs}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 2. Navigation & Tabs
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchSection(targetTab);
        });
    });

    // Subtabs inside the Tips (Dicas de Proteção) section
    const tipsButtons = document.querySelectorAll('.tips-menu-btn');
    const tipsSections = document.querySelectorAll('.tip-sub-section');

    tipsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-subtab');
            
            tipsButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tipsSections.forEach(sec => {
                if (sec.id === targetSubtab) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });
        });
    });
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');

    // Hide all sections and remove active classes
    sections.forEach(sec => sec.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    // Activate the targeted section
    const activeSec = document.getElementById(sectionId);
    if (activeSec) {
        activeSec.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Set active class on corresponding nav item
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === sectionId) {
            item.classList.add('active');
        }
    });

    // Auto-close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// 3. Mobile Hamburger Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', (e) => {
        const isOpen = sidebar.classList.contains('open');
        sidebar.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', !isOpen);
        e.stopPropagation();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// 4. Animated Threat Map (Canvas)
function initThreatMap() {
    const canvas = document.getElementById('threatMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale for high resolution screens
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        ctx.scale(dpr, dpr);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Nodes representing major cyber centers (simulated cities)
    const locations = [
        { name: 'São Paulo', x: 0.35, y: 0.75 },
        { name: 'New York', x: 0.32, y: 0.32 },
        { name: 'London', x: 0.50, y: 0.25 },
        { name: 'Frankfurt', x: 0.54, y: 0.27 },
        { name: 'Tokyo', x: 0.85, y: 0.40 },
        { name: 'Sydney', x: 0.90, y: 0.82 },
        { name: 'Moscow', x: 0.65, y: 0.22 },
        { name: 'Beijing', x: 0.78, y: 0.35 }
    ];

    const attacks = [];
    const maxAttacks = 5;
    
    const attackTypes = [
        { name: 'Bruteforce SSH', color: '#ffaa00', danger: 'MEDIO' },
        { name: 'DDoS Amplification', color: '#ff0055', danger: 'CRITICO' },
        { name: 'SQL Injection', color: '#00f0ff', danger: 'BAIXO' },
        { name: 'Ransomware Payload', color: '#ff0055', danger: 'CRITICO' },
        { name: 'Malicious API Request', color: '#00ff66', danger: 'DEFENDIDO' }
    ];

    // Log Stream Node
    const logContainer = document.getElementById('threatLog');
    const blockedCounter = document.getElementById('statBlocked');
    let blockedCount = 294810;

    function addLogEntry(src, dest, type) {
        const entry = document.createElement('div');
        entry.className = `threat-log-entry ${type.danger === 'CRITICO' ? 'critical' : ''}`;
        
        const now = new Date();
        const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        entry.innerHTML = `<span>${timeStr} <strong>${type.name}</strong> (${src.name} → ${dest.name})</span> <span style="font-weight:bold;">[${type.danger === 'DEFENDIDO' ? 'BLOQUEADO' : 'MITIGADO'}]</span>`;
        
        logContainer.prepend(entry);
        
        // Remove old entries
        while (logContainer.children.length > 25) {
            logContainer.removeChild(logContainer.lastChild);
        }

        // Increment count
        blockedCount += Math.floor(Math.random() * 3) + 1;
        blockedCounter.textContent = blockedCount.toLocaleString('pt-BR');
    }

    function createAttack() {
        if (attacks.length >= maxAttacks) return;
        
        const srcIndex = Math.floor(Math.random() * locations.length);
        let destIndex = Math.floor(Math.random() * locations.length);
        while (destIndex === srcIndex) {
            destIndex = Math.floor(Math.random() * locations.length);
        }

        const src = locations[srcIndex];
        const dest = locations[destIndex];
        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];

        attacks.push({
            src,
            dest,
            progress: 0,
            speed: 0.015 + Math.random() * 0.015,
            color: type.color,
            pulse: 0
        });

        addLogEntry(src, dest, type);
    }

    // Canvas Draw Loop
    function draw() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, w, h);

        // Draw connections / Grid background
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let i = 0; i < h; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(w, i);
            ctx.stroke();
        }

        // Draw Nodes
        locations.forEach(loc => {
            const nx = loc.x * w;
            const ny = loc.y * h;

            // Outer ring pulse
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(nx, ny, 8, 0, Math.PI * 2);
            ctx.stroke();

            // Inner solid core
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(nx, ny, 3, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
            ctx.font = '9px monospace';
            ctx.fillText(loc.name, nx + 10, ny + 3);
        });

        // Draw Active Attacks
        for (let i = attacks.length - 1; i >= 0; i--) {
            const att = attacks[i];
            att.progress += att.speed;

            if (att.progress >= 1) {
                // Node impact splash
                ctx.fillStyle = att.color;
                ctx.beginPath();
                ctx.arc(att.dest.x * w, att.dest.y * h, 12, 0, Math.PI * 2);
                ctx.globalAlpha = 0.25;
                ctx.fill();
                ctx.globalAlpha = 1.0;
                
                attacks.splice(i, 1);
                continue;
            }

            const x1 = att.src.x * w;
            const y1 = att.src.y * h;
            const x2 = att.dest.x * w;
            const y2 = att.dest.y * h;

            // Draw curved arc
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Control point for quadratic curve (bend upwards)
            const cx = (x1 + x2) / 2 - dy * 0.15;
            const cy = (y1 + y2) / 2 + dx * 0.15;

            // Interpolated position for the tracer dot
            const t = att.progress;
            const tx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
            const ty = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

            // Draw the arc link
            ctx.strokeStyle = att.color;
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(cx, cy, x2, y2);
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Draw tracer dot
            ctx.fillStyle = att.color;
            ctx.beginPath();
            ctx.arc(tx, ty, 3, 0, Math.PI * 2);
            ctx.fill();

            // Glow around tracer
            ctx.shadowBlur = 8;
            ctx.shadowColor = att.color;
            ctx.beginPath();
            ctx.arc(tx, ty, 5, 0, Math.PI * 2);
            ctx.strokeStyle = att.color;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0; // reset
        }

        // Trigger new attack randomly
        if (Math.random() < 0.02) {
            createAttack();
        }

        requestAnimationFrame(draw);
    }

    // Initialize Map Attacks
    for (let i = 0; i < 3; i++) {
        createAttack();
    }
    
    draw();
}

// 5. Password Complexity Evaluator
function initPasswordChecker() {
    const pwdInput = document.getElementById('passwordInput');
    const pwdToggleBtn = document.getElementById('pwdToggleBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthTxt = document.getElementById('pwdStrengthTxt');
    const crackTime = document.getElementById('pwdCrackTime');
    const suggestionsBox = document.getElementById('pwdSuggestionsBox');
    const suggestionsList = document.getElementById('pwdSuggestionsList');

    // Show/Hide Password Toggle
    pwdToggleBtn.addEventListener('click', () => {
        const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwdInput.setAttribute('type', type);
        pwdToggleBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });

    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        if (!val) {
            strengthBar.style.width = '0%';
            strengthTxt.textContent = 'Insegura';
            strengthTxt.style.color = 'var(--accent-red)';
            crackTime.textContent = 'Imediato';
            crackTime.style.color = 'var(--accent-red)';
            suggestionsBox.style.display = 'none';
            return;
        }

        let score = 0;
        const suggestions = [];

        // Evaluator Rules
        if (val.length >= 8) score += 20;
        else suggestions.push('Aumente o comprimento para no mínimo 8 caracteres (recomendado: 14+).');

        if (val.length >= 14) score += 20;

        if (/[A-Z]/.test(val)) score += 15;
        else suggestions.push('Adicione pelo menos uma letra maiúscula (A-Z).');

        if (/[a-z]/.test(val)) score += 15;
        
        if (/[0-9]/.test(val)) score += 15;
        else suggestions.push('Adicione pelo menos um número (0-9).');

        if (/[^A-Za-z0-9]/.test(val)) score += 15;
        else suggestions.push('Adicione símbolos especiais (!, @, #, $, %, etc.).');

        // Entropy adjustments for repetitive patterns
        if (/(\w)\1{2,}/.test(val)) {
            score -= 15;
            suggestions.push('Evite caracteres repetidos seguidos (ex: aaa, 111).');
        }

        score = Math.max(0, Math.min(100, score));

        // Format visual components
        strengthBar.style.width = `${score}%`;

        let speedText = 'Razoável';
        let speedColor = 'var(--accent-cyan)';
        let timeEst = 'Algumas horas';

        if (score < 40) {
            speedText = 'Extremamente Insegura';
            speedColor = 'var(--accent-red)';
            timeEst = val.length < 5 ? 'Imediato (Milissegundos)' : 'Poucos segundos';
            strengthBar.style.backgroundColor = 'var(--accent-red)';
        } else if (score < 65) {
            speedText = 'Fraca';
            speedColor = 'var(--accent-amber)';
            timeEst = 'Alguns dias';
            strengthBar.style.backgroundColor = 'var(--accent-amber)';
        } else if (score < 85) {
            speedText = 'Forte';
            speedColor = 'var(--accent-cyan)';
            timeEst = 'Anos (Força bruta comum)';
            strengthBar.style.backgroundColor = 'var(--accent-cyan)';
        } else {
            speedText = 'Criptográfica (Segurança Militar)';
            speedColor = 'var(--accent-green)';
            timeEst = 'Trilhões de Séculos (Inquebrável)';
            strengthBar.style.backgroundColor = 'var(--accent-green)';
        }

        strengthTxt.textContent = speedText;
        strengthTxt.style.color = speedColor;
        crackTime.textContent = timeEst;
        crackTime.style.color = speedColor;

        // Display suggestions list
        if (suggestions.length > 0) {
            suggestionsBox.style.display = 'block';
            suggestionsList.innerHTML = '';
            suggestions.forEach(sug => {
                const li = document.createElement('li');
                li.textContent = sug;
                suggestionsList.appendChild(li);
            });
        } else {
            suggestionsBox.style.display = 'none';
        }
    });
}

// 6. Invasion Risk Assessment Quiz
function initRiskQuiz() {
    const questions = [
        {
            text: "Com que frequência você atualiza o sistema operacional do seu celular e computador?",
            options: [
                { text: "Assim que a atualização é lançada (Automático)", score: 0 },
                { text: "Uma vez por mês / Quando me lembro", score: 10 },
                { text: "Raramente / Ignoro atualizações para não mudar o sistema", score: 25 }
            ]
        },
        {
            text: "Como você cria e gerencia suas senhas nos sites que utiliza?",
            options: [
                { text: "Uso senhas diferentes criadas por mim ou salvas em post-it", score: 15 },
                { text: "Uso o mesmo padrão de senha mudando apenas um número no final", score: 20 },
                { text: "Utilizo um cofre/gerenciador de senhas gerando senhas aleatórias e longas", score: 0 }
            ]
        },
        {
            text: "Qual é a sua atitude em relação à Verificação em Duas Etapas (2FA)?",
            options: [
                { text: "Tenho ativo em todas as contas importantes usando app autenticador", score: 0 },
                { text: "Tenho ativo via SMS ou e-mail secundário", score: 10 },
                { text: "Não uso 2FA porque atrasa a navegação diária", score: 25 }
            ]
        },
        {
            text: "O que você faz se receber um link suspeito de banco ou correios no SMS/WhatsApp?",
            options: [
                { text: "Clico apenas para ver do que se trata antes de fechar", score: 20 },
                { text: "Nunca clico. Verifico acessando o aplicativo oficial do banco", score: 0 },
                { text: "Abro em um navegador anônimo achando que é seguro", score: 15 }
            ]
        },
        {
            text: "Você se conecta a redes Wi-Fi públicas sem senha (cafés, praças, hotéis)?",
            options: [
                { text: "Sim, sempre para economizar meu plano de dados móvel", score: 25 },
                { text: "Sim, mas utilizo um serviço de VPN ativo para trafegar dados", score: 5 },
                { text: "Nunca utilizo redes públicas para acessar dados bancários ou redes", score: 0 }
            ]
        }
    ];

    let currentQ = 0;
    let quizScore = 0;
    
    const container = document.getElementById('quizContainer');
    const progress = document.getElementById('quizProgress');
    const questionText = document.getElementById('quizQuestionText');
    const optionsContainer = document.getElementById('quizOptions');
    const nextBtn = document.getElementById('quizNextBtn');

    function loadQuestion() {
        if (currentQ >= questions.length) {
            showQuizResults();
            return;
        }

        nextBtn.style.display = 'none';
        const q = questions[currentQ];
        questionText.textContent = `Questão ${currentQ + 1} de ${questions.length}: ${q.text}`;
        
        // Progress percentage
        progress.style.width = `${(currentQ / questions.length) * 100}%`;

        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = 'quiz-option';
            div.innerHTML = `<span class="quiz-option-radio"></span><span>${opt.text}</span>`;
            
            div.addEventListener('click', () => {
                // Clear selected
                const siblings = optionsContainer.querySelectorAll('.quiz-option');
                siblings.forEach(s => s.classList.remove('selected'));
                
                div.classList.add('selected');
                div.setAttribute('data-score', opt.score);
                nextBtn.style.display = 'inline-block';
            });

            optionsContainer.appendChild(div);
        });
    }

    nextBtn.addEventListener('click', () => {
        const selected = optionsContainer.querySelector('.quiz-option.selected');
        if (!selected) return;

        quizScore += parseInt(selected.getAttribute('data-score'));
        currentQ++;
        loadQuestion();
    });

    function showQuizResults() {
        progress.style.width = '100%';
        
        let rating = '';
        let color = '';
        let advice = '';

        if (quizScore <= 20) {
            rating = 'BAIXO RISCO (Blindado)';
            color = 'var(--accent-green)';
            advice = 'Excelente! Você segue as diretrizes modernas de segurança digital. Seus dados estão bem protegidos. Continue monitorando e atualizando seus segredos corporativos.';
        } else if (quizScore <= 60) {
            rating = 'RISCO MODERADO (Vulnerável)';
            color = 'var(--accent-amber)';
            advice = 'Cuidado. Existem brechas críticas no seu comportamento (como uso de Wi-Fi aberto ou reutilização de senhas). Recomendamos utilizar um cofre de senhas e habilitar 2FA em autenticador imediatamente.';
        } else {
            rating = 'ALTO RISCO (Exposto)';
            color = 'var(--accent-red)';
            advice = 'Atenção Crítica! Seus hábitos de navegação facilitam a invasão de celulares e roubo de credenciais bancárias. É altamente provável que algum vírus já tenha acesso silencioso aos seus dados. Considere reformatar dispositivos e solicitar nossa consultoria de prevenção contra invasão.';
        }

        container.innerHTML = `
            <div class="quiz-result">
                <div class="quiz-score-circle" style="border-color: ${color};">
                    <span class="quiz-score-val" style="color: ${color};">${quizScore}%</span>
                    <span class="quiz-score-lbl">Risco Geral</span>
                </div>
                <div class="quiz-rating" style="color: ${color};">${rating}</div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">${advice}</p>
                <button class="btn-cyber btn-cyber-green" onclick="location.reload();" style="padding: 0.6rem 1.5rem; font-size: 0.85rem;">Reiniciar Teste</button>
            </div>
        `;
    }

    // Load first question
    loadQuestion();
}

// 7. Simulated File Encryption (AES-256)
function initEncryptor() {
    const cryptInput = document.getElementById('cryptInput');
    const cryptKey = document.getElementById('cryptKey');
    const generateKeyBtn = document.getElementById('generateKeyBtn');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const cryptOutput = document.getElementById('cryptOutput');

    let currentEncryptedString = '';

    function generateKey() {
        const hexChars = '0123456789ABCDEF';
        let key = '';
        for (let i = 0; i < 64; i++) {
            key += hexChars[Math.floor(Math.random() * 16)];
        }
        cryptKey.value = key;
        showNotification('Sucesso', 'Chave AES de 256 bits gerada localmente.', 'success');
    }

    generateKeyBtn.addEventListener('click', generateKey);

    encryptBtn.addEventListener('click', () => {
        const text = cryptInput.value;
        const key = cryptKey.value;

        if (!text) {
            showNotification('Erro', 'Insira algum texto para criptografar.', 'info');
            return;
        }
        if (!key) {
            showNotification('Erro', 'Gere uma chave AES antes de cifrar.', 'info');
            return;
        }

        cryptOutput.innerHTML = '<span class="crypt-output-lbl">AES OUTPUT</span><span>[EXECUTANDO MATRIX HASH EM MEMÓRIA...]</span>';
        
        let counter = 0;
        const matrixInterval = setInterval(() => {
            const scramble = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent = scramble.toUpperCase();
            counter++;
            
            if (counter > 8) {
                clearInterval(matrixInterval);
                // Real base64 + mock cipher text formatting
                const b64 = btoa(unescape(encodeURIComponent(text)));
                const mockCipher = `AES256-${key.substring(0,8)}-${b64}`;
                currentEncryptedString = mockCipher;
                
                cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent = mockCipher;
                showNotification('Dados Cifrados', 'Texto criptografado em memória volátil.', 'success');
            }
        }, 80);
    });

    decryptBtn.addEventListener('click', () => {
        const key = cryptKey.value;
        const text = cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent;

        if (!text || text.includes('[Aguardando') || text.includes('[EXECUTANDO')) {
            showNotification('Erro', 'Não há dados criptografados para decifrar.', 'info');
            return;
        }
        if (!key) {
            showNotification('Erro', 'Forneça a chave AES correspondente.', 'info');
            return;
        }

        // Verify signature
        if (!text.startsWith(`AES256-${key.substring(0,8)}`)) {
            showNotification('Falha de Decifragem', 'Chave AES incorreta ou dados corrompidos. Decapagem abortada.', 'info');
            return;
        }

        cryptOutput.innerHTML = '<span class="crypt-output-lbl">AES DECRYPT</span><span>[REVERSÃO DE HASH CRIPTOGRÁFICO...]</span>';

        let counter = 0;
        const matrixInterval = setInterval(() => {
            const scramble = Math.random().toString(36).substring(2, 10);
            cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent = `REBUILDING: ${scramble.toUpperCase()}`;
            counter++;

            if (counter > 8) {
                clearInterval(matrixInterval);
                try {
                    const b64Part = text.split('-')[2];
                    const decoded = decodeURIComponent(escape(atob(b64Part)));
                    cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent = decoded;
                    showNotification('Decodificado', 'Dados restaurados com integridade.', 'success');
                } catch (e) {
                    cryptOutput.querySelector('span:not(.crypt-output-lbl)').textContent = 'ERRO NA ASSINATURA DOS DADOS';
                }
            }
        }, 80);
    });

    // Generate initial key
    generateKey();
}

// 8. Search Filter for Virus Glossary Accordions
function initGlossaryFilter() {
    const searchInput = document.getElementById('virusSearch');
    const cards = document.querySelectorAll('#virusGlossaryContainer .virus-card');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const name = card.getAttribute('data-virus-name');
                if (name.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Accordion expand/collapse
    cards.forEach(card => {
        const header = card.querySelector('.virus-header');
        header.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');
            
            // Close all other cards
            cards.forEach(c => c.classList.remove('open'));
            
            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });
}

// 9. Interactive Budget Pricing Calculator
function initPricingCalculator() {
    const serviceCards = document.querySelectorAll('.service-select-card');
    const envSelect = document.getElementById('hireEnvironment');
    const priSelect = document.getElementById('hirePriority');
    const priceDisplay = document.getElementById('calcPriceDisplay');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            calculateTotal();
        });
    });

    if (envSelect) envSelect.addEventListener('change', calculateTotal);
    if (priSelect) priSelect.addEventListener('change', calculateTotal);

    function calculateTotal() {
        let baseTotal = 0;
        
        // Sum active services
        const selectedServices = document.querySelectorAll('.service-select-card.selected');
        selectedServices.forEach(card => {
            baseTotal += parseInt(card.getAttribute('data-price'));
        });

        if (baseTotal === 0) {
            priceDisplay.textContent = 'R$ 0,00';
            return;
        }

        // Get Multipliers
        const envMultiplier = parseFloat(envSelect.options[envSelect.selectedIndex].getAttribute('data-multiplier'));
        const priMultiplier = parseFloat(priSelect.options[priSelect.selectedIndex].getAttribute('data-multiplier'));

        // Compute final cost
        const finalCost = baseTotal * envMultiplier * priMultiplier;

        // Display nicely formatted
        priceDisplay.textContent = finalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    calculateTotal();
}

// 10. Form Submissions and Terminal Simulator Responses
function initFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    const hireForm = document.getElementById('hireForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;

            // Simple validation simulation
            showNotification('SSL Transmissão', 'Enviando pacote seguro criptografado...', 'info');
            
            setTimeout(() => {
                showNotification('Mensagem Enviada', `Obrigado ${name}! Seu e-mail foi enfileirado para wscybersegurancadev@proton.me.`, 'success');
                contactForm.reset();
            }, 1500);
        });
    }

    if (hireForm) {
        hireForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('hireName').value;
            const email = document.getElementById('hireEmail').value;
            const totalVal = document.getElementById('calcPriceDisplay').textContent;

            // Make sure at least one service is selected
            const selectedServices = document.querySelectorAll('.service-select-card.selected');
            if (selectedServices.length === 0) {
                showNotification('Atenção', 'Selecione pelo menos um serviço do catálogo para solicitar a análise.', 'info');
                return;
            }

            showNotification('Contrato Gerado', 'Compilando termo de NDA confidencial...', 'info');

            setTimeout(() => {
                showNotification('Solicitação Enviada', `Olá ${name}, a W&S recebeu seu pedido de Risco estimado em ${totalVal}. Entraremos em contato via ${email} com os termos técnicos.`, 'success');
                
                // Clear selection
                document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
                hireForm.reset();
                document.getElementById('calcPriceDisplay').textContent = 'R$ 0,00';
            }, 1800);
        });
    }
}

// Helper: Show custom cyberpunk notification
function showNotification(title, text, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;

    let icon = '<i class="fa-solid fa-bell"></i>';
    if (type === 'success') {
        icon = '<i class="fa-solid fa-circle-check"></i>';
    } else if (type === 'info') {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    notif.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-body">
            <div class="notification-title">${title}</div>
            <div class="notification-text">${text}</div>
        </div>
    `;

    container.appendChild(notif);

    // Auto dismiss
    setTimeout(() => {
        notif.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 4000);
}

// Download triggering utilities
function triggerDownload(fileName) {
    showNotification('Iniciando Download', `Verificando assinaturas SHA-256 para ${fileName}...`, 'info');
    
    setTimeout(() => {
        // Create virtual download
        const blob = new Blob([`W&S Cyber Segurança - Mock Binary Payload for ${fileName}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Concluído', `${fileName} baixado com sucesso. Verifique o seu diretório local.`, 'success');
    }, 1500);
}

function triggerManualDownload() {
    showNotification('Processando PDF', 'Gerando compilação do Guia de Sobrevivência Digital 2026...', 'info');

    setTimeout(() => {
        const content = `===========================================================
W&S CYBER SEGURANÇA - GUIA DE SOBREVIVÊNCIA DIGITAL 2026
Elaborado por Wendell & Scheilla
===========================================================

1. SEGURANÇA NO SMARTPHONE (CELULAR)
------------------------------------
* Desative conexões automáticas de Wi-Fi e Bluetooth.
* Nunca baixe aplicativos fora das lojas oficiais (Google Play / App Store).
* Mantenha o sistema operacional atualizado. As falhas do tipo Zero-Day são corrigidas continuamente nestes patches.
* Monitore permissões de acessibilidade em Apps de terceiros.

2. SENHAS E COFRES
------------------
* Crie senhas longas baseadas em frases fáceis de lembrar, mas difíceis de bruteforçar.
  Exemplo bom: "Cavalo-Verde-Corre-Rapido-2026!" (31 caracteres)
  Exemplo ruim: "Wendell123"
* Salve-as em um cofre local portátil. Nunca armazene em arquivos .txt ou notas expostas no desktop.

3. AUTENTICAÇÃO EM DUAS ETAPAS (2FA)
------------------------------------
* Fuja da autenticação via SMS. Em caso de clonagem de chip (SIM Swapping), o invasor receberá o código.
* Prefira chaves de segurança USB ou aplicativos autenticadores isolados.

4. CONTATO E SUPORTE DE INCIDENTES
----------------------------------
Fale com nossos engenheiros em caso de suspeitas de invasão a qualquer momento:
* wscybersegurancadev@proton.me (Desenvolvimento Seguro e Defesa de Sistemas)
* scheilladatabasa@proton.me (Análise de Bancos de Dados e Forense Digital)

===========================================================
CONEXÃO SEGURA CRIPTOGRAFADA W&S SHIELD
===========================================================`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'WS_Guia_Sobrevivencia_Digital_2026.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('PDF Salvo', 'Guia de Sobrevivência baixado com sucesso!', 'success');
    }, 1800);
}

function showPgpKey() {
    const pgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP v4
Comment: W&S Cyber Security Cryptography Key

mQENBF4/z+IBCAC6Zz5V+E8U+W1Rk2v7a8J... [KEY EXCERPT]
wscybersegurancadev@proton.me / scheilladatabasa@proton.me
-----END PGP PUBLIC KEY BLOCK-----`;
    
    alert("W&S CHAVE PÚBLICA DE CRIPTOGRAFIA:\n\n" + pgpKey + "\n\nUse esta assinatura para criptografar comunicações críticas.");
}

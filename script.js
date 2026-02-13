/**
 * ================================================================
 * GAPCHECKER PRO - MULTI-ID VERSION 5.0
 * Motivation Premier X Support Link Box © 2026
 * Supports: Name (Alias1 + Alias2) format
 * ================================================================
 */

// ===== CONFIGURATION =====
const CONFIG = {
    appName: 'GapChecker Pro',
    version: '5.0.0',
    copyright: 'Motivation Premier X Support Link Box',
    maxHistory: 25,
    toastDuration: 3500,
    debounceDelay: 400,
    similarityThreshold: 0.65,
    loadingSteps: {
        step1: 600,
        step2: 600,
        step3: 800,
        step4: 500
    }
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    allDoneList: 'gapchecker_allDone',
    commenterList: 'gapchecker_commenter',
    history: 'gapchecker_history',
    theme: 'gapchecker_theme'
};

// ===== DOM ELEMENTS =====
const DOM = {};

// ===== GLOBAL STATE =====
let currentSpellingSuggestions = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    console.log(`🚀 ${CONFIG.appName} v${CONFIG.version} initializing...`);
    cacheElements();
    initTheme();
    loadSavedData();
    updatePreview();
    updateHistoryBadge();
    setupEventListeners();
    showShortcutsHint();
    console.log('✅ App initialized successfully!');
}

// ===== CACHE DOM ELEMENTS =====
function cacheElements() {
    DOM.allDoneList = document.getElementById('allDoneList');
    DOM.commenterList = document.getElementById('commenterList');
    DOM.checkBtn = document.getElementById('checkBtn');
    DOM.themeToggle = document.getElementById('themeToggle');
    DOM.historyBtn = document.getElementById('historyBtn');
    DOM.closeHistory = document.getElementById('closeHistory');
    DOM.clearHistory = document.getElementById('clearHistory');
    DOM.copyResult = document.getElementById('copyResult');
    DOM.resetAllDone = document.getElementById('resetAllDone');
    DOM.resetCommenter = document.getElementById('resetCommenter');
    DOM.pasteAllDone = document.getElementById('pasteAllDone');
    DOM.pasteCommenter = document.getElementById('pasteCommenter');
    DOM.exportBtn = document.getElementById('exportBtn');
    DOM.shareBtn = document.getElementById('shareBtn');
    DOM.resultsSection = document.getElementById('resultsSection');
    DOM.loadingOverlay = document.getElementById('loadingOverlay');
    DOM.historyModal = document.getElementById('historyModal');
    DOM.quickResultModal = document.getElementById('quickResultModal');
    DOM.spellingModal = document.getElementById('spellingModal');
    DOM.historyList = document.getElementById('historyList');
    DOM.historyCount = document.getElementById('historyCount');
    DOM.toast = document.getElementById('toast');
    DOM.shortcutsHint = document.getElementById('shortcutsHint');
    DOM.previewAllDone = document.getElementById('previewAllDone');
    DOM.previewCommenter = document.getElementById('previewCommenter');
    DOM.previewStatus = document.getElementById('previewStatus');
    DOM.statusIcon = document.getElementById('statusIcon');
    DOM.allDoneCount = document.getElementById('allDoneCount');
    DOM.commenterCount = document.getElementById('commenterCount');
    DOM.statAllDone = document.getElementById('statAllDone');
    DOM.statTotalComment = document.getElementById('statTotalComment');
    DOM.statGroupComment = document.getElementById('statGroupComment');
    DOM.statSupportGap = document.getElementById('statSupportGap');
    DOM.progressBar = document.getElementById('progressBar');
    DOM.progressPercent = document.getElementById('progressPercent');
    DOM.progressDone = document.getElementById('progressDone');
    DOM.progressRemaining = document.getElementById('progressRemaining');
    DOM.resultTitle = document.getElementById('resultTitle');
    DOM.resultSubtitle = document.getElementById('resultSubtitle');
    DOM.resultContent = document.getElementById('resultContent');
    DOM.matchedCount = document.getElementById('matchedCount');
    DOM.matchedContent = document.getElementById('matchedContent');
    DOM.extraCount = document.getElementById('extraCount');
    DOM.extraContent = document.getElementById('extraContent');
    DOM.quickResultOutput = document.getElementById('quickResultOutput');
    DOM.loadingText = document.getElementById('loadingText');
    DOM.loadingIcon = document.getElementById('loadingIcon');
    DOM.loadingProgressBar = document.getElementById('loadingProgressBar');
    DOM.loadingPercent = document.getElementById('loadingPercent');
    DOM.step1 = document.getElementById('step1');
    DOM.step2 = document.getElementById('step2');
    DOM.step3 = document.getElementById('step3');
    DOM.step4 = document.getElementById('step4');
    DOM.spellingHelper = document.getElementById('spellingHelper');
    DOM.spellingCount = document.getElementById('spellingCount');
    DOM.spellingList = document.getElementById('spellingList');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    if (DOM.checkBtn) DOM.checkBtn.addEventListener('click', performAnalysis);
    if (DOM.themeToggle) DOM.themeToggle.addEventListener('click', toggleTheme);
    if (DOM.historyBtn) DOM.historyBtn.addEventListener('click', openHistoryModal);
    if (DOM.closeHistory) DOM.closeHistory.addEventListener('click', closeHistoryModal);
    if (DOM.clearHistory) DOM.clearHistory.addEventListener('click', clearAllHistory);
    
    if (DOM.historyModal) {
        DOM.historyModal.addEventListener('click', (e) => {
            if (e.target === DOM.historyModal) closeHistoryModal();
        });
    }
    
    // Quick Result & Spelling Modals
    const closeQuickResult = document.getElementById('closeQuickResult');
    const closeQuickResultBtn = document.getElementById('closeQuickResultBtn');
    const copyQuickResult = document.getElementById('copyQuickResult');
    
    if (closeQuickResult) closeQuickResult.addEventListener('click', closeQuickResultModal);
    if (closeQuickResultBtn) closeQuickResultBtn.addEventListener('click', closeQuickResultModal);
    if (copyQuickResult) copyQuickResult.addEventListener('click', () => copyToClipboard(DOM.quickResultOutput?.value));
    if (DOM.quickResultModal) {
        DOM.quickResultModal.addEventListener('click', (e) => {
            if (e.target === DOM.quickResultModal) closeQuickResultModal();
        });
    }
    
    const closeSpelling = document.getElementById('closeSpelling');
    const closeSpellingBtn = document.getElementById('closeSpellingBtn');
    
    if (closeSpelling) closeSpelling.addEventListener('click', closeSpellingModal);
    if (closeSpellingBtn) closeSpellingBtn.addEventListener('click', closeSpellingModal);
    if (DOM.spellingModal) {
        DOM.spellingModal.addEventListener('click', (e) => {
            if (e.target === DOM.spellingModal) closeSpellingModal();
        });
    }
    if (DOM.spellingHelper) DOM.spellingHelper.addEventListener('click', openSpellingModal);
    
    // List Management
    if (DOM.resetAllDone) DOM.resetAllDone.addEventListener('click', () => resetList('allDone'));
    if (DOM.resetCommenter) DOM.resetCommenter.addEventListener('click', () => resetList('commenter'));
    if (DOM.pasteAllDone) DOM.pasteAllDone.addEventListener('click', () => pasteFromClipboard('allDone'));
    if (DOM.pasteCommenter) DOM.pasteCommenter.addEventListener('click', () => pasteFromClipboard('commenter'));
    if (DOM.copyResult) DOM.copyResult.addEventListener('click', copyMainResult);
    if (DOM.exportBtn) DOM.exportBtn.addEventListener('click', exportResults);
    if (DOM.shareBtn) DOM.shareBtn.addEventListener('click', shareResults);
    
    // Auto-save with debounce
    if (DOM.allDoneList) {
        DOM.allDoneList.addEventListener('input', debounce(() => {
            saveToStorage(STORAGE_KEYS.allDoneList, DOM.allDoneList.value);
            updatePreview();
        }, CONFIG.debounceDelay));
    }
    
    if (DOM.commenterList) {
        DOM.commenterList.addEventListener('input', debounce(() => {
            saveToStorage(STORAGE_KEYS.commenterList, DOM.commenterList.value);
            updatePreview();
        }, CONFIG.debounceDelay));
    }
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('click', (e) => {
        if (e.target.closest('.toast-close') && DOM.toast) DOM.toast.classList.remove('show');
    });
}

// ===== KEYBOARD SHORTCUTS & UTILS =====
function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        performAnalysis();
    }
    if (e.key === 'Escape') {
        closeHistoryModal();
        closeQuickResultModal();
        closeSpellingModal();
    }
}

function showShortcutsHint() {
    if (DOM.shortcutsHint) {
        DOM.shortcutsHint.style.display = 'block';
        setTimeout(() => DOM.shortcutsHint.style.display = 'none', 5000);
    }
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveToStorage(key, value) {
    try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch (e) { console.error(e); }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? defaultValue : JSON.parse(value);
    } catch { return localStorage.getItem(key) || defaultValue; }
}

// ===== THEME =====
function initTheme() {
    const savedTheme = getFromStorage(STORAGE_KEYS.theme, 'dark');
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    saveToStorage(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`${newTheme === 'dark' ? '🌙 ডার্ক' : '☀️ লাইট'} মোড`, 'info');
}

// ===== DATA MANAGEMENT =====
function loadSavedData() {
    if (DOM.allDoneList) DOM.allDoneList.value = getFromStorage(STORAGE_KEYS.allDoneList, '');
    if (DOM.commenterList) DOM.commenterList.value = getFromStorage(STORAGE_KEYS.commenterList, '');
}

function resetList(type) {
    if (!confirm('লিস্ট মুছে ফেলতে চান?')) return;
    const key = type === 'allDone' ? STORAGE_KEYS.allDoneList : STORAGE_KEYS.commenterList;
    const el = type === 'allDone' ? DOM.allDoneList : DOM.commenterList;
    if (el) el.value = '';
    localStorage.removeItem(key);
    updatePreview();
    hideResults();
    showToast('লিস্ট মুছে ফেলা হয়েছে', 'info');
}

async function pasteFromClipboard(type) {
    try {
        const text = await navigator.clipboard.readText();
        const el = type === 'allDone' ? DOM.allDoneList : DOM.commenterList;
        const key = type === 'allDone' ? STORAGE_KEYS.allDoneList : STORAGE_KEYS.commenterList;
        if (el) {
            el.value = text;
            saveToStorage(key, text);
            updatePreview();
            showToast('পেস্ট করা হয়েছে!', 'success');
        }
    } catch { showToast('পেস্ট করতে পারেনি', 'error'); }
}

function updatePreview() {
    const allDoneText = DOM.allDoneList?.value || '';
    const commenterText = DOM.commenterList?.value || '';
    const allDoneNames = parseAllDoneList(allDoneText);
    const commenterNames = parseCommenterList(commenterText);
    
    if (DOM.previewAllDone) DOM.previewAllDone.textContent = allDoneNames.length;
    if (DOM.previewCommenter) DOM.previewCommenter.textContent = commenterNames.length;
    if (DOM.allDoneCount) DOM.allDoneCount.textContent = `${allDoneNames.length} জন সদস্য`;
    if (DOM.commenterCount) DOM.commenterCount.textContent = `${commenterNames.length} জন কমেন্টার`;
    
    updatePreviewStatus(allDoneNames.length, commenterNames.length);
}

function updatePreviewStatus(allDoneCount, commenterCount) {
    if (!DOM.previewStatus || !DOM.statusIcon) return;
    if (allDoneCount > 0 && commenterCount > 0) {
        DOM.previewStatus.textContent = 'চেক করতে প্রস্তুত!';
        DOM.previewStatus.style.color = 'var(--accent-green)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        DOM.statusIcon.style.background = 'var(--accent-green-light)';
        DOM.statusIcon.style.color = 'var(--accent-green)';
    } else if (allDoneCount > 0 || commenterCount > 0) {
        DOM.previewStatus.textContent = 'আরেকটি লিস্ট দিন';
        DOM.previewStatus.style.color = 'var(--accent-orange)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
        DOM.statusIcon.style.background = 'var(--accent-orange-light)';
        DOM.statusIcon.style.color = 'var(--accent-orange)';
    } else {
        DOM.previewStatus.textContent = 'লিস্ট পেস্ট করুন';
        DOM.previewStatus.style.color = 'var(--primary)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        DOM.statusIcon.style.background = 'var(--primary-light)';
        DOM.statusIcon.style.color = 'var(--primary)';
    }
}

// ================================================================
// 🎯 PARSING LOGIC (UPDATED FOR MULTI-ID SUPPORT)
// ================================================================

function simpleNormalize(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .replace(/@/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

// UPDATED: Extracts aliases from brackets (Nirob + Kamrul)
function parseAllDoneList(text) {
    if (!text || !text.trim()) return [];
    
    const lines = text.split('\n');
    const results = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line || isHeaderLine(line)) continue;
        
        let rawName = extractNameFromLine(line);
        if (!rawName || rawName.includes('#N/A') || rawName === 'No Post') continue;
        
        // --- MULTI-ID LOGIC STARTS HERE ---
        let mainName = rawName;
        let aliases = [];
        
        // Check for brackets ()
        if (rawName.includes('(') && rawName.includes(')')) {
            const parts = rawName.split('(');
            mainName = parts[0].trim(); // Name before bracket
            
            const insideBrackets = parts[1].split(')')[0]; // Text inside brackets
            
            // Split aliases by + or , or /
            const rawAliases = insideBrackets.split(/[+,/]/);
            
            rawAliases.forEach(alias => {
                const normalizedAlias = simpleNormalize(alias);
                if (normalizedAlias.length >= 2) {
                    aliases.push(normalizedAlias);
                }
            });
        }
        
        // Add main name to aliases as well
        const normalizedMain = simpleNormalize(mainName);
        if (normalizedMain.length >= 2) {
            if (!aliases.includes(normalizedMain)) {
                aliases.push(normalizedMain);
            }
            
            results.push({
                original: rawName.trim(), // Keep full string like "Maruf (Nirob)"
                normalized: normalizedMain,
                aliases: aliases // Array of all valid names for this person
            });
        }
        // --- MULTI-ID LOGIC ENDS HERE ---
    }
    
    // Remove duplicates based on original string
    return results.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.original === item.original
        ))
    );
}

function isHeaderLine(line) {
    const lower = line.toLowerCase();
    const headers = [
        'তারিখ:', 'বার:', '👇', 'সাপোর্ট করেছেন', 'তালিকা', 
        'যারা লিংক', '━', '─', '═', 'link no', '*link'
    ];
    return headers.some(h => lower.includes(h));
}

function extractNameFromLine(line) {
    const arrows = ['➤', '→', '➔', '▶', '►'];
    for (let arrow of arrows) {
        if (line.includes(arrow)) return line.substring(line.indexOf(arrow) + 1).trim();
    }
    if (line.includes('@')) return line.substring(line.indexOf('@')).trim();
    return line.replace(/^[\d️⃣]+[.\-)\s:]+/, '').trim();
}

function parseCommenterList(text) {
    if (!text || !text.trim()) return [];
    const lines = text.split('\n');
    const results = [];
    const seen = new Set();
    
    for (let line of lines) {
        line = line.trim();
        if (!line || isHeaderLine(line)) continue;
        const normalized = simpleNormalize(line);
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        if (normalized.length >= 2) {
            results.push({ original: line.trim(), normalized: normalized });
        }
    }
    return results;
}

function extractLinkNo(text) {
    const patterns = [
        /Link\s*No[:\-\.\s]*(\d+)/i,
        /\*Link\s*No[:\-\.\s]*(\d+)\*/i,
        /লিংক\s*(?:নং|নম্বর)?[:\-\.\s]*(\d+)/i,
        /#(\d+)/
    ];
    for (let p of patterns) {
        const match = text.match(p);
        if (match) return match[1];
    }
    return 'N/A';
}

// ================================================================
// 🔤 SPELLING HELPER
// ================================================================
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i-1] === str2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;
    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 1;
    return (maxLen - levenshteinDistance(str1, str2)) / maxLen;
}

function findSpellingSuggestions(gapList, commenters) {
    const suggestions = [];
    for (let gapUser of gapList) {
        // Only check against main normalized name for simplicity in suggestions
        const gapNormalized = gapUser.normalized; 
        let bestMatch = null;
        let bestSimilarity = 0;
        
        for (let commenter of commenters) {
            const commNormalized = commenter.normalized;
            // Skip if it's already an alias match (handled in main logic)
            if (gapUser.aliases.includes(commNormalized)) continue;

            const similarity = calculateSimilarity(gapNormalized, commNormalized);
            if (similarity >= CONFIG.similarityThreshold && similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = commenter.original;
            }
        }
        if (bestMatch) {
            suggestions.push({
                gapName: gapUser.original,
                similarTo: bestMatch,
                similarity: Math.round(bestSimilarity * 100)
            });
        }
    }
    suggestions.sort((a, b) => b.similarity - a.similarity);
    return suggestions;
}

// ===== LOADING STEPS =====
function resetLoadingSteps() {
    [DOM.step1, DOM.step2, DOM.step3, DOM.step4].forEach(step => {
        if (step) step.classList.remove('active', 'completed');
    });
    if (DOM.loadingProgressBar) DOM.loadingProgressBar.style.width = '0%';
    if (DOM.loadingPercent) DOM.loadingPercent.textContent = '0%';
    if (DOM.loadingText) DOM.loadingText.innerHTML = 'প্রস্তুত হচ্ছে<span class="loading-dots"></span>';
    if (DOM.loadingIcon) DOM.loadingIcon.className = 'fa-solid fa-magnifying-glass';
    document.querySelector('.spinner-core')?.classList.remove('success');
}

function updateLoadingStep(stepNumber, status, text, percent) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    for (let i = 1; i < stepNumber; i++) {
        const prevStep = document.getElementById(`step${i}`);
        if (prevStep) {
            prevStep.classList.remove('active');
            prevStep.classList.add('completed');
        }
    }
    if (stepElement) {
        stepElement.classList.remove('completed');
        if (status === 'active') stepElement.classList.add('active');
        else if (status === 'completed') {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
        }
    }
    if (DOM.loadingText && text) DOM.loadingText.innerHTML = text + '<span class="loading-dots"></span>';
    if (DOM.loadingProgressBar && percent !== undefined) DOM.loadingProgressBar.style.width = percent + '%';
    if (DOM.loadingPercent && percent !== undefined) DOM.loadingPercent.textContent = percent + '%';
}

function completeLoading() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`)?.classList.add('completed');
    }
    if (DOM.loadingProgressBar) DOM.loadingProgressBar.style.width = '100%';
    if (DOM.loadingPercent) DOM.loadingPercent.textContent = '100%';
    if (DOM.loadingText) DOM.loadingText.innerHTML = '✅ বিশ্লেষণ সম্পন্ন!';
    if (DOM.loadingIcon) DOM.loadingIcon.className = 'fa-solid fa-check';
    document.querySelector('.spinner-core')?.classList.add('success');
}

// ===== MAIN ANALYSIS (UPDATED MATCHING LOGIC) =====
async function performAnalysis() {
    const allDoneText = DOM.allDoneList?.value?.trim() || '';
    const commenterText = DOM.commenterList?.value?.trim() || '';
    
    if (!allDoneText) return showToast('All Done লিস্ট পেস্ট করুন!', 'error');
    if (!commenterText) return showToast('Commenter লিস্ট পেস্ট করুন!', 'error');
    
    showLoading();
    resetLoadingSteps();
    
    try {
        updateLoadingStep(1, 'active', 'All Done লিস্ট প্রসেস হচ্ছে (Multi-ID)', 10);
        await sleep(CONFIG.loadingSteps.step1);
        const allDoneUsers = parseAllDoneList(allDoneText);
        updateLoadingStep(1, 'completed', '', 25);
        
        if (allDoneUsers.length === 0) {
            hideLoading();
            return showToast('All Done লিস্ট থেকে নাম পাওয়া যায়নি!', 'error');
        }
        
        updateLoadingStep(2, 'active', 'Commenter লিস্ট প্রসেস হচ্ছে', 35);
        await sleep(CONFIG.loadingSteps.step2);
        const commenters = parseCommenterList(commenterText);
        updateLoadingStep(2, 'completed', '', 50);
        
        updateLoadingStep(3, 'active', 'মাল্টি-আইডি ম্যাচিং চেক করা হচ্ছে', 60);
        await sleep(CONFIG.loadingSteps.step3);
        
        const commenterSet = new Set(commenters.map(c => c.normalized));
        const matched = [];
        const gap = []; // Stores full user objects temporarily for spelling check
        const matchedNormalized = new Set();
        
        // --- MATCHING LOGIC ---
        for (let user of allDoneUsers) {
            // Check if ANY alias of the user exists in the commenter list
            const isMatch = user.aliases.some(alias => commenterSet.has(alias));
            
            if (isMatch) {
                matched.push(user.original); // Add the full name "Maruf (Nirob)" to matched
                // Mark all aliases as matched so we can find extras later
                user.aliases.forEach(alias => matchedNormalized.add(alias));
            } else {
                gap.push(user);
            }
        }
        
        updateLoadingStep(3, 'completed', '', 75);
        updateLoadingStep(4, 'active', 'রিপোর্ট তৈরি করা হচ্ছে', 85);
        await sleep(CONFIG.loadingSteps.step4);
        
        // Extras: Commenters who were NOT found in any alias list
        const extras = commenters
            .filter(c => !matchedNormalized.has(c.normalized))
            .map(c => c.original);
            
        // Generate spelling suggestions for the GAP list
        currentSpellingSuggestions = findSpellingSuggestions(gap, commenters);
        
        const gapNames = gap.map(u => u.original);
        const linkNo = extractLinkNo(commenterText);
        
        const resultsData = {
            allDoneCount: allDoneUsers.length,
            totalComment: commenters.length,
            groupComment: matched.length,
            supportGap: gapNames.length,
            matched,
            gap: gapNames,
            extras,
            linkNo,
            timestamp: new Date().toLocaleString('bn-BD'),
            percent: allDoneUsers.length > 0 ? Math.round((matched.length / allDoneUsers.length) * 100) : 0,
            spellingSuggestions: currentSpellingSuggestions
        };
        
        completeLoading();
        await sleep(500);
        hideLoading();
        
        displayResults(resultsData);
        displaySpellingHelper(currentSpellingSuggestions);
        generateQuickResult(resultsData);
        saveToHistory(resultsData);
        showToast(`বিশ্লেষণ সম্পন্ন! ${gapNames.length} জন গ্যাপ।`, 'success');
        
    } catch (error) {
        console.error('Analysis error:', error);
        hideLoading();
        showToast('বিশ্লেষণে সমস্যা হয়েছে!', 'error');
    }
}

// ===== DISPLAY RESULTS =====
function displayResults(data) {
    if (DOM.statAllDone) DOM.statAllDone.textContent = data.allDoneCount;
    if (DOM.statTotalComment) DOM.statTotalComment.textContent = data.totalComment;
    if (DOM.statGroupComment) DOM.statGroupComment.textContent = data.groupComment;
    if (DOM.statSupportGap) DOM.statSupportGap.textContent = data.supportGap;
    
    if (DOM.progressBar) DOM.progressBar.style.width = `${data.percent}%`;
    if (DOM.progressPercent) DOM.progressPercent.textContent = `${data.percent}%`;
    if (DOM.progressDone) DOM.progressDone.textContent = `${data.groupComment} জন করেছে`;
    if (DOM.progressRemaining) DOM.progressRemaining.textContent = `${data.supportGap} জন বাকি`;
    
    if (DOM.resultTitle) DOM.resultTitle.textContent = `যারা কমেন্ট করেননি (${data.supportGap} জন)`;
    if (DOM.resultSubtitle) DOM.resultSubtitle.textContent = `Link No: ${data.linkNo}`;
    
    if (DOM.resultContent) {
        if (data.gap.length > 0) {
            let gapText = `Link No ${data.linkNo}:- তে যারা কমেন্ট করেননি\nমোট গ্যাপ: ${data.gap.length} জন\n\n`;
            data.gap.forEach((name, i) => gapText += `${i + 1}. ${name}\n`);
            DOM.resultContent.textContent = gapText;
        } else {
            DOM.resultContent.textContent = '🎉 অভিনন্দন! সবাই সাপোর্ট করেছে!';
        }
    }
    
    if (DOM.matchedCount) DOM.matchedCount.textContent = data.matched.length;
    if (DOM.matchedContent) DOM.matchedContent.textContent = data.matched.length > 0 ? data.matched.join('\n') : 'কেউ ম্যাচ হয়নি';
    if (DOM.extraCount) DOM.extraCount.textContent = data.extras.length;
    if (DOM.extraContent) DOM.extraContent.textContent = data.extras.length > 0 ? data.extras.join('\n') : 'কোনো বাইরের Commenter নেই';
    
    showResults();
}

function displaySpellingHelper(suggestions) {
    if (!DOM.spellingHelper) return;
    DOM.spellingHelper.style.display = suggestions.length > 0 ? 'flex' : 'none';
    if (DOM.spellingCount) DOM.spellingCount.textContent = suggestions.length;
}

function renderSpellingSuggestions() {
    if (!DOM.spellingList) return;
    if (currentSpellingSuggestions.length === 0) {
        DOM.spellingList.innerHTML = `<div class="no-suggestions"><i class="fa-solid fa-circle-check"></i><p>কোনো সম্ভাব্য বানান সমস্যা পাওয়া যায়নি!</p></div>`;
        return;
    }
    
    DOM.spellingList.innerHTML = currentSpellingSuggestions.map((item, index) => {
        const similarityClass = item.similarity >= 85 ? 'high' : item.similarity >= 75 ? 'medium' : 'low';
        return `
            <div class="spelling-item">
                <div class="spelling-item-header">
                    <span class="spelling-number">${index + 1}</span>
                    <span class="similarity-badge ${similarityClass}">${item.similarity}% মিল</span>
                </div>
                <div class="spelling-comparison">
                    <div class="spelling-name gap-name"><span class="label">গ্যাপ লিস্টে:</span><span class="name">${item.gapName}</span></div>
                    <div class="spelling-arrow"><i class="fa-solid fa-arrows-left-right"></i></div>
                    <div class="spelling-name commenter-name"><span class="label">কমেন্টারে:</span><span class="name">${item.similarTo}</span></div>
                </div>
                <div class="spelling-hint"><i class="fa-solid fa-lightbulb"></i><span>যাচাই করুন: এই দুটো কি একই ব্যক্তি?</span></div>
            </div>`;
    }).join('');
}

function generateQuickResult(data) {
    if (!DOM.quickResultOutput) return;
    let report = `📊 GapChecker Pro Report\n${'━'.repeat(35)}\n\n🔗 Link No: ${data.linkNo}\n📅 সময়: ${data.timestamp}\n\n📈 Statistics:\n   • All Done: ${data.allDoneCount} জন\n   • মোট কমেন্ট: ${data.totalComment} জন\n   • গ্রুপ ম্যাচ: ${data.groupComment} জন\n   • সাপোর্ট গ্যাপ: ${data.supportGap} জন\n   • Success Rate: ${data.percent}%\n\n${'━'.repeat(35)}\n\n`;
    
    if (data.gap.length > 0) {
        report += `⚠️ যারা কমেন্ট করেননি:\n\n`;
        data.gap.forEach((name, i) => report += `${i + 1}. ${name}\n`);
    } else {
        report += `🎉 সবাই সাপোর্ট করেছে!\n`;
    }
    
    if (data.spellingSuggestions && data.spellingSuggestions.length > 0) {
        report += `\n${'━'.repeat(35)}\n\n⚠️ ${data.spellingSuggestions.length} টি নামে বানান সমস্যা থাকতে পারে\n`;
    }
    
    report += `\n${'━'.repeat(35)}\n© ${CONFIG.copyright}`;
    DOM.quickResultOutput.value = report;
}

function showResults() {
    if (DOM.resultsSection) {
        DOM.resultsSection.classList.add('show');
        DOM.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}
function hideResults() {
    if (DOM.resultsSection) DOM.resultsSection.classList.remove('show');
    if (DOM.spellingHelper) DOM.spellingHelper.style.display = 'none';
}

// ===== COPY, EXPORT & HISTORY =====
async function copyMainResult() {
    const text = DOM.resultContent?.textContent;
    if (text) {
        await copyToClipboard(text);
        if (DOM.copyResult) {
            DOM.copyResult.classList.add('copied');
            const span = DOM.copyResult.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = 'কপি হয়েছে!';
                setTimeout(() => { DOM.copyResult.classList.remove('copied'); span.textContent = original; }, 2500);
            }
        }
    }
}

async function copyToClipboard(text) {
    try { await navigator.clipboard.writeText(text); showToast('কপি করা হয়েছে!', 'success'); }
    catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('কপি করা হয়েছে!', 'success');
    }
}

function exportResults() {
    const text = DOM.quickResultOutput?.value || DOM.resultContent?.textContent;
    if (!text) return showToast('এক্সপোর্ট করার কিছু নেই', 'error');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GapChecker_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('রিপোর্ট ডাউনলোড হয়েছে!', 'success');
}

async function shareResults() {
    const text = DOM.quickResultOutput?.value || DOM.resultContent?.textContent;
    if (!text) return showToast('শেয়ার করার কিছু নেই', 'error');
    if (navigator.share) {
        try { await navigator.share({ title: 'GapChecker Pro Report', text }); } catch {}
    } else copyToClipboard(text);
}

function saveToHistory(data) {
    let history = getFromStorage(STORAGE_KEYS.history, []);
    history.unshift({
        linkNo: data.linkNo,
        date: data.timestamp,
        allDoneCount: data.allDoneCount,
        totalComment: data.totalComment,
        groupComment: data.groupComment,
        supportGap: data.supportGap,
        percent: data.percent
    });
    saveToStorage(STORAGE_KEYS.history, history.slice(0, CONFIG.maxHistory));
    updateHistoryBadge();
}

function updateHistoryBadge() {
    if (DOM.historyCount) DOM.historyCount.textContent = getFromStorage(STORAGE_KEYS.history, []).length;
}

function renderHistory() {
    const history = getFromStorage(STORAGE_KEYS.history, []);
    if (!DOM.historyList) return;
    if (history.length === 0) {
        DOM.historyList.innerHTML = `<div class="no-history"><i class="fa-solid fa-clock-rotate-left"></i><p>কোনো হিস্ট্রি নেই</p></div>`;
        return;
    }
    DOM.historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-header"><span class="history-item-title"><i class="fa-solid fa-link"></i> Link No: ${item.linkNo}</span><span class="history-item-date">${item.date}</span></div>
            <div class="history-item-stats">
                <span><i class="fa-solid fa-clipboard-check"></i> ${item.allDoneCount}</span>
                <span><i class="fa-solid fa-comments"></i> ${item.totalComment}</span>
                <span><i class="fa-solid fa-user-check"></i> ${item.groupComment}</span>
                <span><i class="fa-solid fa-user-xmark"></i> ${item.supportGap}</span>
                <span><i class="fa-solid fa-percent"></i> ${item.percent}%</span>
            </div>
        </div>`).join('');
}
function clearAllHistory() {
    if (confirm('সব হিস্ট্রি মুছে ফেলতে চান?')) {
        localStorage.removeItem(STORAGE_KEYS.history);
        updateHistoryBadge();
        renderHistory();
        showToast('হিস্ট্রি মুছে ফেলা হয়েছে', 'info');
    }
}
function openHistoryModal() { renderHistory(); DOM.historyModal?.classList.add('show'); }
function closeHistoryModal() { DOM.historyModal?.classList.remove('show'); }
function closeQuickResultModal() { DOM.quickResultModal?.classList.remove('show'); }
function openSpellingModal() { renderSpellingSuggestions(); DOM.spellingModal?.classList.add('show'); }
function closeSpellingModal() { DOM.spellingModal?.classList.remove('show'); }
function showLoading() { DOM.loadingOverlay?.classList.add('show'); }
function hideLoading() { DOM.loadingOverlay?.classList.remove('show'); }

function showToast(message, type = 'info') {
    if (!DOM.toast) return;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const icon = DOM.toast.querySelector('.toast-icon');
    const msg = DOM.toast.querySelector('.toast-message');
    if (icon) icon.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>`;
    if (msg) msg.textContent = message;
    DOM.toast.className = `toast ${type} show`;
    setTimeout(() => DOM.toast.classList.remove('show'), CONFIG.toastDuration);
}

// ===== ERROR HANDLING =====
window.onerror = function(msg) { console.error(msg); showToast('কিছু সমস্যা হয়েছে', 'error'); hideLoading(); return false; };
console.log(`🎉 ${CONFIG.appName} v${CONFIG.version} ready!`);

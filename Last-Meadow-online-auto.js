(async function() {
    // ============================================================
    // 1. CONFIG & INITIALIZATION
    // ============================================================
    const PREFIX = "[Gorilla-Auto]";
    console.log(`%c${PREFIX} Initializing Webpack API Auto-Farmer...`, "color: #5865F2; font-weight: bold; font-size: 14px;");

    // ============================================================
    // 2. WEBPACK EXTRACTION
    // ============================================================
    let wpRequire;
    try {
        wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
        window.webpackChunkdiscord_app.pop();
    } catch {
        console.error(`${PREFIX} ❌ Failed to access Webpack.`);
        return;
    }

    const search = (filter) => Object.values(wpRequire.c).find(x => x?.exports && filter(x?.exports))?.exports;
    const findModule = (props) => search(x => props.every(p => x[p] || x.Z?.[p] || x.ZP?.[p]));

    let api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get)?.exports?.tn 
           ?? Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo
           ?? findModule(['get', 'post', 'put'])?.default 
           ?? findModule(['get', 'post', 'put']);

    if (!api || typeof api.post !== 'function') {
        console.error(`${PREFIX} ❌ Failed to find Discord Internal API Module.`);
        return;
    }

    // ============================================================
    // 3. CONTROLLER
    // ============================================================
    window.gorilla = {
        isActive: true,
        minDelayMs: 5000,
        maxDelayMs: 8000,
        activityType: "gathering", 
        
        stop: function() {
            this.isActive = false;
            console.log(`%c${PREFIX} 🛑 Script completely stopped and removed.`, "color: #ed4245; font-weight: bold;");
            delete window.gorilla;
        },

        triggerSuccessAudio: function() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
                
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } catch (e) {
                console.log(`${PREFIX} ⚠️ Audio output failed.`);
            }
        }
    };

    console.log(`%c=========================================`, "color: #b5bac1");
    console.log(`%c🦍 Gorilla Bot Started (Random 5-8s)!`, "color: #57F287; font-weight: bold; font-size: 14px;");
    console.log(`%c⏹️ พิมพ์ \`gorilla.stop()\` เพื่อหยุดสคริปต์`, "color: white");
    console.log(`%c=========================================`, "color: #b5bac1");

    // ============================================================
    // 4. CORE LOGIC 
    // ============================================================
    while (window.gorilla && window.gorilla.isActive) {
        try {
            await api.post({ url: `/gorilla/activity/${window.gorilla.activityType}/start` });
            
            const randomWaitTime = Math.floor(Math.random() * (window.gorilla.maxDelayMs - window.gorilla.minDelayMs + 1)) + window.gorilla.minDelayMs;
            console.log(`%c${PREFIX} ⏳ Started... waiting ${(randomWaitTime / 1000).toFixed(1)}s`, "color: cyan");

            await new Promise(resolve => setTimeout(resolve, randomWaitTime));
            
            if (!window.gorilla || !window.gorilla.isActive) break;

            const completeRes = await api.post({ url: `/gorilla/activity/${window.gorilla.activityType}/complete` });
            
            const countersRes = await api.get({ url: `/gorilla/counters` });
            
            const completeData = completeRes.body || {};
            const countersData = countersRes.body || {};

            const level = completeData.user_data?.level ?? "N/A";
            const xp = completeData.user_data?.xp ?? "N/A";

            const changes = completeData.changes || {};
            let rewardText = Object.entries(changes).map(([key, val]) => `${key}: +${val}`).join(', ');
            if (!rewardText) rewardText = "No items";

            const woodObj = countersData.resource_counters?.find(c => c.id === 'wood');
            const metalObj = countersData.resource_counters?.find(c => c.id === 'metal');
            const woodTotal = woodObj ? woodObj.current_count : 0;
            const metalTotal = metalObj ? metalObj.current_count : 0;

            console.log(`%c${PREFIX} 🎉 [Level: ${level} | XP: ${xp}] 🎁 ได้รับ: ${rewardText} (📦 ยอดรวม ไม้: ${woodTotal}, เหล็ก: ${metalTotal})`, "color: gold");

            if (level !== "N/A" && level >= 100) {
                console.log(`%c${PREFIX} 🎯 เลเวล 100 แล้ว! หยุดการทำงาน...`, "color: #57F287; font-size: 16px; font-weight: bold;");
                window.gorilla.triggerSuccessAudio();
                window.gorilla.stop();
                break;
            }

        } catch (error) {
            const errorMsg = error.body?.message || error.message || "Unknown Error";
            console.error(`${PREFIX} ❌ API Error:`, errorMsg);
            
            const retryWait = Math.floor(Math.random() * 2000) + 2000;
            await new Promise(resolve => setTimeout(resolve, retryWait));
        }
    }
})();
